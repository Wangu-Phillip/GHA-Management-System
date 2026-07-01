/**
 * Facebook / Meta Graph API service.
 *
 * Wraps the Meta Graph API v21.0 to pull campaign data, insights, and
 * manage campaigns. Also contains the data normalizer that converts raw
 * Graph API responses into our internal FacebookInsight shape before writing
 * to D1.
 *
 * When no real access token is available, mock data is returned so the UI
 * and caching layer can be tested without a live Meta Business account.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NormalizedInsight {
  objectId: string;
  objectLevel: 'CAMPAIGN' | 'ADSET' | 'AD' | 'ACCOUNT';
  objectName: string;
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  conversions: number;
  cpm: number;
  ctr: number;
  cpc: number;
  roas: number;
}

export interface RawGraphInsight {
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  campaign_name?: string;
  adset_name?: string;
  ad_name?: string;
  date_start: string;
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  cpm?: string;
  ctr?: string;
  cpc?: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
}

export interface GraphCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

export interface GraphAdSet {
  id: string;
  name: string;
  status: string;
  daily_budget?: string;
  targeting?: Record<string, unknown>;
  bid_strategy?: string;
}

export interface GraphAd {
  id: string;
  name: string;
  status: string;
  creative?: { title?: string; body?: string };
}

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

// ─── Normalizer ───────────────────────────────────────────────────────────────

/**
 * Converts raw Graph API insight rows into our unified internal format.
 * Handles the nested `actions` array to extract purchase/conversion counts
 * and `action_values` to compute ROAS.
 */
export function normalizeInsights(
  raw: RawGraphInsight[],
  level: 'CAMPAIGN' | 'ADSET' | 'AD' | 'ACCOUNT'
): NormalizedInsight[] {
  return raw.map((r) => {
    const impressions = parseInt(r.impressions || '0', 10);
    const clicks = parseInt(r.clicks || '0', 10);
    const spend = parseFloat(r.spend || '0');
    const reach = parseInt(r.reach || '0', 10);
    const cpm = parseFloat(r.cpm || '0');
    const ctr = parseFloat(r.ctr || '0');
    const cpc = parseFloat(r.cpc || '0');

    // Extract conversions: sum of purchase, complete_registration, lead actions
    const conversionTypes = [
      'purchase',
      'offsite_conversion.fb_pixel_purchase',
      'complete_registration',
      'lead',
      'omni_purchase',
    ];
    const conversions = (r.actions || [])
      .filter((a) => conversionTypes.includes(a.action_type))
      .reduce((sum, a) => sum + parseInt(a.value || '0', 10), 0);

    // Extract ROAS from action_values (purchase value / spend)
    const purchaseValue = (r.action_values || [])
      .filter((a) =>
        ['purchase', 'offsite_conversion.fb_pixel_purchase', 'omni_purchase'].includes(a.action_type)
      )
      .reduce((sum, a) => sum + parseFloat(a.value || '0'), 0);
    const roas = spend > 0 ? Math.round((purchaseValue / spend) * 100) / 100 : 0;

    const objectId =
      level === 'CAMPAIGN'
        ? r.campaign_id || ''
        : level === 'ADSET'
        ? r.adset_id || ''
        : level === 'AD'
        ? r.ad_id || ''
        : 'account';
    const objectName =
      level === 'CAMPAIGN'
        ? r.campaign_name || ''
        : level === 'ADSET'
        ? r.adset_name || ''
        : level === 'AD'
        ? r.ad_name || ''
        : 'Account';

    return {
      objectId,
      objectLevel: level,
      objectName,
      date: r.date_start,
      impressions,
      clicks,
      spend,
      reach,
      conversions,
      cpm,
      ctr,
      cpc,
      roas,
    };
  });
}

// ─── Graph API Calls ──────────────────────────────────────────────────────────

async function graphGet(path: string, accessToken: string): Promise<any> {
  const url = `${GRAPH_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function graphPost(path: string, accessToken: string, body: Record<string, unknown>): Promise<any> {
  const url = `${GRAPH_API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const b = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${b}`);
  }
  return res.json();
}

async function graphPatch(path: string, accessToken: string, body: Record<string, unknown>): Promise<any> {
  const url = `${GRAPH_API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST', // Graph API uses POST with method_override for PATCH
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...body, method: 'post' }),
  });
  if (!res.ok) {
    const b = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${b}`);
  }
  return res.json();
}

/**
 * Fetches campaign-level daily insights for the specified date range.
 * Uses breakdown=day to get granular per-day rows.
 */
export async function fetchAdInsights(
  accessToken: string,
  adAccountId: string,
  {
    since,
    until,
    level = 'campaign',
  }: { since: string; until: string; level?: 'campaign' | 'adset' | 'ad' | 'account' }
): Promise<NormalizedInsight[]> {
  const fields = [
    'campaign_id',
    'campaign_name',
    'adset_id',
    'adset_name',
    'ad_id',
    'ad_name',
    'impressions',
    'clicks',
    'spend',
    'reach',
    'cpm',
    'ctr',
    'cpc',
    'actions',
    'action_values',
    'date_start',
  ].join(',');

  const params = new URLSearchParams({
    fields,
    time_range: JSON.stringify({ since, until }),
    time_increment: '1',
    level,
    limit: '200',
    access_token: accessToken,
  });

  const path = `/${adAccountId}/insights?${params.toString()}`;
  const data = await graphGet(path, accessToken);
  const raw: RawGraphInsight[] = data.data || [];

  const levelMap: Record<string, 'CAMPAIGN' | 'ADSET' | 'AD' | 'ACCOUNT'> = {
    campaign: 'CAMPAIGN',
    adset: 'ADSET',
    ad: 'AD',
    account: 'ACCOUNT',
  };

  return normalizeInsights(raw, levelMap[level] || 'CAMPAIGN');
}

/**
 * Lists all campaigns for the given ad account.
 */
export async function fetchCampaigns(
  accessToken: string,
  adAccountId: string
): Promise<GraphCampaign[]> {
  const fields = 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time';
  const params = new URLSearchParams({ fields, limit: '100', access_token: accessToken });
  const data = await graphGet(`/${adAccountId}/campaigns?${params}`, accessToken);
  return data.data || [];
}

/**
 * Lists all ad sets inside a campaign.
 */
export async function fetchAdSets(
  accessToken: string,
  campaignId: string
): Promise<GraphAdSet[]> {
  const fields = 'id,name,status,daily_budget,targeting,bid_strategy';
  const params = new URLSearchParams({ fields, limit: '100', access_token: accessToken });
  const data = await graphGet(`/${campaignId}/adsets?${params}`, accessToken);
  return data.data || [];
}

/**
 * Lists all ads inside an ad set.
 */
export async function fetchAds(accessToken: string, adSetId: string): Promise<GraphAd[]> {
  const fields = 'id,name,status,creative{title,body}';
  const params = new URLSearchParams({ fields, limit: '100', access_token: accessToken });
  const data = await graphGet(`/${adSetId}/ads?${params}`, accessToken);
  return data.data || [];
}

/**
 * Creates a new campaign via the Graph API.
 */
export async function createCampaign(
  accessToken: string,
  adAccountId: string,
  payload: {
    name: string;
    objective: string;
    status?: string;
    dailyBudget?: number;
    lifetimeBudget?: number;
    startTime?: string;
    stopTime?: string;
  }
): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    name: payload.name,
    objective: payload.objective,
    status: payload.status || 'PAUSED',
    special_ad_categories: [],
  };
  if (payload.dailyBudget) body.daily_budget = Math.round(payload.dailyBudget * 100); // in cents
  if (payload.lifetimeBudget) body.lifetime_budget = Math.round(payload.lifetimeBudget * 100);
  if (payload.startTime) body.start_time = payload.startTime;
  if (payload.stopTime) body.stop_time = payload.stopTime;

  return graphPost(`/${adAccountId}/campaigns`, accessToken, body);
}

/**
 * Updates a campaign's daily budget or status.
 */
export async function updateCampaignBudget(
  accessToken: string,
  campaignId: string,
  dailyBudgetCents: number
): Promise<{ success: boolean }> {
  return graphPatch(`/${campaignId}`, accessToken, {
    daily_budget: dailyBudgetCents,
  });
}

// ─── Mock Data (when no real credentials are set) ─────────────────────────────

/**
 * Generates synthetic Facebook Ads insight data for local dev / demo mode.
 * Produces 30 days of daily data for 3 mock campaigns.
 */
export function generateMockInsights(adAccountId: string): NormalizedInsight[] {
  const campaigns = [
    { id: 'mock-camp-001', name: 'Weekend Getaway Promo', spend_base: 45, imp_base: 3200, ctr_base: 2.1 },
    { id: 'mock-camp-002', name: 'Honeymoon Package', spend_base: 30, imp_base: 1800, ctr_base: 3.4 },
    { id: 'mock-camp-003', name: 'Business Traveler', spend_base: 20, imp_base: 1100, ctr_base: 1.8 },
  ];

  const insights: NormalizedInsight[] = [];
  const baseDate = new Date('2026-06-01');

  for (let d = 0; d < 30; d++) {
    const day = new Date(baseDate);
    day.setDate(day.getDate() + d);
    const dateStr = day.toISOString().split('T')[0];
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const weekendMult = isWeekend ? 1.45 : 1.0;

    for (const c of campaigns) {
      const jitter = 0.85 + Math.random() * 0.3;
      const impressions = Math.round(c.imp_base * weekendMult * jitter);
      const ctr = c.ctr_base * (0.9 + Math.random() * 0.2);
      const clicks = Math.round((impressions * ctr) / 100);
      const spend = Math.round(c.spend_base * weekendMult * jitter * 100) / 100;
      const cpm = spend > 0 && impressions > 0 ? (spend / impressions) * 1000 : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const conversions = Math.round(clicks * 0.04 * (0.8 + Math.random() * 0.4));
      const roas = spend > 0 ? Math.round((conversions * 180) / spend * 100) / 100 : 0;

      insights.push({
        objectId: c.id,
        objectLevel: 'CAMPAIGN',
        objectName: c.name,
        date: dateStr,
        impressions,
        clicks,
        spend,
        reach: Math.round(impressions * 0.85),
        conversions,
        cpm: Math.round(cpm * 100) / 100,
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        roas,
      });
    }
  }

  return insights;
}

export function generateMockCampaigns(): GraphCampaign[] {
  return [
    {
      id: 'mock-camp-001',
      name: 'Weekend Getaway Promo',
      status: 'ACTIVE',
      objective: 'CONVERSIONS',
      daily_budget: '4500',
      start_time: '2026-06-01T00:00:00+0000',
    },
    {
      id: 'mock-camp-002',
      name: 'Honeymoon Package',
      status: 'ACTIVE',
      objective: 'TRAFFIC',
      daily_budget: '3000',
      start_time: '2026-06-01T00:00:00+0000',
    },
    {
      id: 'mock-camp-003',
      name: 'Business Traveler',
      status: 'PAUSED',
      objective: 'REACH',
      daily_budget: '2000',
      start_time: '2026-06-01T00:00:00+0000',
    },
  ];
}
