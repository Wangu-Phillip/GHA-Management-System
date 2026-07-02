import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Megaphone, Link2, RefreshCw, Plus, TrendingUp, TrendingDown,
  DollarSign, MousePointerClick, Eye, ShoppingCart, Zap, Brain,
  CheckCircle2, AlertCircle, Clock, ChevronDown, X, BarChart2,
  Target, Users, Lightbulb, ArrowUpRight, ArrowDownRight, Loader2,
  Settings2, Calendar
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FacebookAdAccount, FacebookCampaign, FacebookInsight, AdvisorAdvice
} from '../types';

interface Props {
  guesthouseId: string;
}

type Tab = 'connect' | 'overview' | 'campaigns' | 'ai-advisor';

const OBJECTIVES = [
  'OUTCOME_AWARENESS',
  'OUTCOME_TRAFFIC',
  'OUTCOME_ENGAGEMENT',
  'OUTCOME_LEADS',
  'OUTCOME_APP_PROMOTION',
  'OUTCOME_SALES',
];

// ─── Small helper components ──────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color, trend
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4`}>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-gray-900 mt-0.5">{value}</p>
        {sub && (
          <p className={`text-[11px] font-semibold mt-0.5 flex items-center gap-1 ${
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
            {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    PAUSED: 'bg-amber-50 text-amber-700 border-amber-100',
    ARCHIVED: 'bg-gray-100 text-gray-500 border-gray-200',
    DELETED: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${map[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FacebookAdsView({ guesthouseId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [account, setAccount] = useState<FacebookAdAccount | null>(null);
  const [campaigns, setCampaigns] = useState<FacebookCampaign[]>([]);
  const [insights, setInsights] = useState<FacebookInsight[]>([]);
  const [advice, setAdvice] = useState<AdvisorAdvice | null>(null);
  const [windowDays, setWindowDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [error, setError] = useState('');

  // Connect-account form
  const [formAdAccountId, setFormAdAccountId] = useState('');
  const [formToken, setFormToken] = useState('');
  const [formPageId, setFormPageId] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');

  // Create-campaign modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campName, setCampName] = useState('');
  const [campObjective, setCampObjective] = useState('OUTCOME_TRAFFIC');
  const [campDailyBudget, setCampDailyBudget] = useState('');
  const [campStartTime, setCampStartTime] = useState('');
  const [campStopTime, setCampStopTime] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Budget edit
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [budgetValue, setBudgetValue] = useState('');

  // ── Fetchers ────────────────────────────────────────────────────────────────

  const fetchAccount = useCallback(async () => {
    try {
      const res = await fetch(`/api/facebook/account?guesthouseId=${guesthouseId}`);
      if (res.ok) setAccount(await res.json());
    } catch {}
  }, [guesthouseId]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch(`/api/facebook/campaigns?guesthouseId=${guesthouseId}`);
      if (res.ok) setCampaigns(await res.json());
    } catch {}
  }, [guesthouseId]);

  const fetchInsights = useCallback(async (days: number) => {
    try {
      const res = await fetch(
        `/api/facebook/insights?guesthouseId=${guesthouseId}&days=${days}&level=CAMPAIGN`
      );
      if (res.ok) setInsights(await res.json());
    } catch {}
  }, [guesthouseId]);

  const fetchAdvice = useCallback(async (days: number) => {
    setAdvisorLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/facebook/ai-advisor?guesthouseId=${guesthouseId}&windowDays=${days}`
      );
      if (res.ok) setAdvice(await res.json());
      else setError('Failed to load AI advice.');
    } catch {
      setError('Network error loading AI advice.');
    } finally {
      setAdvisorLoading(false);
    }
  }, [guesthouseId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAccount(), fetchCampaigns(), fetchInsights(windowDays)]).finally(() =>
      setLoading(false)
    );
  }, [guesthouseId]);

  useEffect(() => {
    fetchInsights(windowDays);
  }, [windowDays]);

  useEffect(() => {
    if (activeTab === 'ai-advisor' && !advice) {
      fetchAdvice(windowDays);
    }
  }, [activeTab]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await fetch('/api/facebook/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesthouseId, days: windowDays }),
      });
      const data = await res.json() as any;
      setSyncMsg(data.message || 'Sync complete.');
      await Promise.all([fetchCampaigns(), fetchInsights(windowDays)]);
    } catch {
      setSyncMsg('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectLoading(true);
    setConnectMsg('');

    const normalizedId = formAdAccountId.trim();
    if (!/^\d+$/.test(normalizedId)) {
      setConnectMsg('Invalid Ad Account ID. It must consist only of numbers (from Meta Business Manager).');
      setConnectLoading(false);
      return;
    }
    if (formToken.length < 20) {
      setConnectMsg('Access Token appears too short. Please use a valid System User Token from Meta Business Manager.');
      setConnectLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/facebook/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          adAccountId: normalizedId,
          accessToken: formToken,
          pageId: formPageId,
          accountName: formAccountName,
        }),
      });
      const data = await res.json() as any;
      if (res.ok) {
        setAccount(data.account);
        setConnectMsg('✓ Account connected. Running initial sync...');
        await handleSync();
        setActiveTab('overview');
      } else {
        setConnectMsg(data.error || 'Connection failed.');
      }
    } catch {
      setConnectMsg('Network error.');
    } finally {
      setConnectLoading(false);
    }
  };


  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/facebook/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          name: campName,
          objective: campObjective,
          dailyBudget: campDailyBudget ? Number(campDailyBudget) : undefined,
          startTime: campStartTime || undefined,
          stopTime: campStopTime || undefined,
        }),
      });
      if (res.ok) {
        await fetchCampaigns();
        setShowCreateModal(false);
        setCampName(''); setCampObjective('OUTCOME_TRAFFIC');
        setCampDailyBudget(''); setCampStartTime(''); setCampStopTime('');
      }
    } catch {}
    finally { setCreateLoading(false); }
  };

  const handleUpdateBudget = async (campaignId: string) => {
    if (!budgetValue) return;
    try {
      await fetch(`/api/facebook/campaigns/${campaignId}/budget`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesthouseId, dailyBudget: Number(budgetValue) }),
      });
      setEditingBudget(null);
      setBudgetValue('');
      await fetchCampaigns();
    } catch {}
  };

  const handleRegenerateAdvice = async () => {
    setAdvisorLoading(true);
    setError('');
    try {
      const res = await fetch('/api/facebook/ai-advisor/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesthouseId, windowDays }),
      });
      if (res.ok) setAdvice(await res.json());
    } catch {
      setError('Failed to regenerate advice.');
    } finally {
      setAdvisorLoading(false);
    }
  };

  // ── Derived Metrics ─────────────────────────────────────────────────────────

  const totalSpend = insights.reduce((s, r) => s + r.spend, 0);
  const totalImpressions = insights.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = insights.reduce((s, r) => s + r.clicks, 0);
  const totalConversions = insights.reduce((s, r) => s + r.conversions, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;

  // Aggregate daily spend + impressions for the chart
  const dailyChartData = (() => {
    const map: Record<string, { date: string; spend: number; impressions: number; clicks: number }> = {};
    for (const r of insights) {
      if (!map[r.date]) map[r.date] = { date: r.date, spend: 0, impressions: 0, clicks: 0 };
      map[r.date].spend += r.spend;
      map[r.date].impressions += r.impressions;
      map[r.date].clicks += r.clicks;
    }
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  })();

  // Per-campaign total spend for bar chart
  const campaignChartData = (() => {
    const map: Record<string, { name: string; spend: number; conversions: number }> = {};
    for (const r of insights) {
      const name = r.objectName || r.objectId;
      if (!map[r.objectId]) map[r.objectId] = { name, spend: 0, conversions: 0 };
      map[r.objectId].spend += r.spend;
      map[r.objectId].conversions += r.conversions;
    }
    return Object.values(map);
  })();

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Brain },
    { id: 'connect', label: 'Account Settings', icon: Settings2 },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="facebook-ads-view">
      {/* Page Header */}
      <div className="flex items-center justify-between" id="fb-header">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Facebook Ads Manager</h2>
            <p className="text-xs text-gray-400">
              {account
                ? `Connected: ${account.accountName || account.adAccountId}`
                : 'No ad account connected — running in Demo Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1" id="fb-range-selector">
            {[7, 30, 90, 365, 3650].map((d) => (
              <button
                key={d}
                onClick={() => { setWindowDays(d); fetchInsights(d); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  windowDays === d
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                id={`fb-range-${d}d`}
              >
                {d === 365 ? '1y' : d === 3650 ? 'All Time' : `${d}d`}
              </button>
            ))}
          </div>

          {/* Sync button */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            id="fb-sync-btn"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className={`text-xs px-4 py-2.5 rounded-xl border font-medium ${
          syncMsg.includes('fail') || syncMsg.includes('error')
            ? 'bg-red-50 text-red-700 border-red-100'
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }`} id="fb-sync-msg">
          {syncMsg}
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl" id="fb-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            id={`fb-tab-${id}`}
          >
            <Icon className={`h-3.5 w-3.5 ${id === 'ai-advisor' ? 'text-amber-400' : ''}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >

          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6" id="fb-overview">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" id="fb-kpi-grid">
                <KpiCard label="Total Spend" value={`$${totalSpend.toFixed(2)}`}
                  icon={DollarSign} color="bg-blue-600" sub={`Last ${windowDays}d`} trend="neutral" />
                <KpiCard label="Impressions" value={totalImpressions.toLocaleString()}
                  icon={Eye} color="bg-indigo-600" sub="Total reach touches" trend="neutral" />
                <KpiCard label="Clicks" value={totalClicks.toLocaleString()}
                  icon={MousePointerClick} color="bg-violet-600" trend="up" sub="Link clicks" />
                <KpiCard label="Conversions" value={totalConversions.toString()}
                  icon={ShoppingCart} color="bg-emerald-600" trend="up"
                  sub={`$${(totalSpend / Math.max(1, totalConversions)).toFixed(2)} / conv.`} />
                <KpiCard label="Avg. CTR" value={`${avgCtr.toFixed(2)}%`}
                  icon={Target} color="bg-amber-500"
                  sub={avgCtr >= 2 ? 'Above benchmark' : 'Below 2% benchmark'}
                  trend={avgCtr >= 2 ? 'up' : 'down'} />
                <KpiCard label="Avg. CPC" value={`$${avgCpc.toFixed(2)}`}
                  icon={Zap} color="bg-rose-500" trend="neutral" sub="Cost per click" />
              </div>

              {/* Spend + Clicks Line Chart */}
              {dailyChartData.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="fb-spend-chart">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Daily Spend & Clicks</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={dailyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }}
                        tickFormatter={(v) => v.slice(5)} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }}
                        formatter={(v: any, n: string) =>
                          n === 'spend' ? [`$${Number(v).toFixed(2)}`, 'Spend'] : [v, 'Clicks']} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line yAxisId="left" type="monotone" dataKey="spend"
                        stroke="#2563eb" strokeWidth={2} dot={false} name="spend" />
                      <Line yAxisId="right" type="monotone" dataKey="clicks"
                        stroke="#7c3aed" strokeWidth={2} dot={false} name="clicks" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center" id="fb-no-data">
                  <RefreshCw className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No insight data yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Click <strong>Sync Now</strong> to pull data.</p>
                </div>
              )}

              {/* Campaign Spend Bar Chart */}
              {campaignChartData.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="fb-camp-chart">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Spend by Campaign</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={campaignChartData} layout="vertical" barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `$${v.toFixed(0)}`} />
                      <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }}
                        formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Spend']} />
                      <Bar dataKey="spend" fill="#2563eb" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* ── Campaigns Tab ── */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4" id="fb-campaigns">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">{campaigns.length} campaigns in D1</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  id="fb-create-camp-btn"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Campaign
                </button>
              </div>

              {campaigns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Megaphone className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-500">No campaigns yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Click <strong>Sync Now</strong> or create a campaign.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="fb-campaigns-table">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {['Campaign', 'Status', 'Objective', 'Daily Budget', 'Start', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-bold text-gray-500 uppercase text-[10px] tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {campaigns.map((camp) => (
                        <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800 max-w-[200px] truncate">{camp.name}</td>
                          <td className="px-4 py-3"><StatusBadge status={camp.status} /></td>
                          <td className="px-4 py-3 text-gray-500 font-mono text-[10px]">{camp.objective || '—'}</td>
                          <td className="px-4 py-3">
                            {editingBudget === camp.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={budgetValue}
                                  onChange={(e) => setBudgetValue(e.target.value)}
                                  className="w-20 px-2 py-1 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="0.00"
                                  autoFocus
                                  id={`budget-input-${camp.id}`}
                                />
                                <button onClick={() => handleUpdateBudget(camp.id)}
                                  className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                  <CheckCircle2 className="h-3 w-3" />
                                </button>
                                <button onClick={() => setEditingBudget(null)}
                                  className="p-1 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="font-semibold text-gray-700">
                                {camp.dailyBudget ? `$${camp.dailyBudget.toFixed(2)}/day` : '—'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {camp.startTime ? new Date(camp.startTime).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => { setEditingBudget(camp.id); setBudgetValue(String(camp.dailyBudget || '')); }}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-[10px] flex items-center gap-1"
                              id={`edit-budget-${camp.id}`}
                            >
                              <DollarSign className="h-3 w-3" />
                              Edit Budget
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Create Campaign Modal */}
              <AnimatePresence>
                {showCreateModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    id="create-camp-modal-bg"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
                      id="create-camp-modal"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-gray-900 text-sm">Create New Campaign</h3>
                        <button onClick={() => setShowCreateModal(false)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateCampaign} className="space-y-3" id="create-camp-form">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Campaign Name</label>
                          <input required value={campName} onChange={(e) => setCampName(e.target.value)}
                            placeholder="e.g. Summer Getaway Promo"
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            id="camp-name-input" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Objective</label>
                          <select value={campObjective} onChange={(e) => setCampObjective(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            id="camp-objective-select">
                            {OBJECTIVES.map((o) => (
                              <option key={o} value={o}>{o.replace('OUTCOME_', '')}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Daily Budget (USD)</label>
                          <input type="number" value={campDailyBudget} onChange={(e) => setCampDailyBudget(e.target.value)}
                            placeholder="e.g. 30"
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            id="camp-budget-input" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                            <input type="date" value={campStartTime} onChange={(e) => setCampStartTime(e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              id="camp-start-input" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                            <input type="date" value={campStopTime} onChange={(e) => setCampStopTime(e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              id="camp-stop-input" />
                          </div>
                        </div>
                        <button type="submit" disabled={createLoading}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                          id="create-camp-submit">
                          {createLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                          {createLoading ? 'Creating…' : 'Create Campaign'}
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── AI Advisor Tab ── */}
          {activeTab === 'ai-advisor' && (
            <div className="space-y-5" id="fb-ai-advisor">
              {/* Header controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                    <Brain className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">AI Performance Advisor</h3>
                    {advice && (
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {advice.isFromCache ? 'Cached • ' : 'Fresh • '}
                        Generated {new Date(advice.generatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {[30, 90, 365, 3650].map((d) => (
                      <button key={d}
                        onClick={() => { setWindowDays(d); setAdvice(null); fetchAdvice(d); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          windowDays === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        id={`advisor-window-${d}d`}>
                        {d === 365 ? '1y' : d === 3650 ? 'All Time' : `${d}d`}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRegenerateAdvice}
                    disabled={advisorLoading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold transition-all"
                    id="advisor-regenerate-btn"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${advisorLoading ? 'animate-spin' : ''}`} />
                    {advisorLoading ? 'Generating…' : 'Regenerate'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {advisorLoading && !advice && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-amber-50 flex items-center justify-center">
                        <Brain className="h-7 w-7 text-amber-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <Loader2 className="h-3 w-3 text-white animate-spin" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Analysing your ad performance…</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Fetching {windowDays}-day insights from D1 and running Gemini inference
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {advice && (
                <div className="space-y-4" id="advisor-cards">

                  {/* Performance Summary */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20" id="advisor-summary">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-blue-200" />
                      <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Performance Summary</span>
                    </div>
                    <p className="text-sm leading-relaxed text-blue-50">{advice.performanceSummary}</p>
                  </div>

                  {/* Budget Suggestions */}
                  {advice.budgetSuggestions?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4" id="advisor-budgets">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <h4 className="text-sm font-bold text-gray-900">Budget Reallocation Suggestions</h4>
                      </div>
                      <div className="space-y-3">
                        {advice.budgetSuggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{s.campaignName}</p>
                              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{s.rationale}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-2 justify-end">
                                <span className="text-xs text-gray-400 line-through">${s.currentDailyBudget}/d</span>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                                  s.suggestedDailyBudget > s.currentDailyBudget
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  ${s.suggestedDailyBudget}/d
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top + Bottom Performers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="advisor-performers">
                    {/* Top Performers */}
                    {advice.topPerformers?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          <h4 className="text-sm font-bold text-gray-900">Top Performers</h4>
                        </div>
                        {advice.topPerformers.map((p, i) => (
                          <div key={i} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <p className="text-xs font-bold text-emerald-800 truncate">{p.campaignName}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {[
                                { l: 'Spend', v: `$${p.totalSpend.toFixed(0)}` },
                                { l: 'CTR', v: `${p.avgCtr.toFixed(1)}%` },
                                { l: 'ROAS', v: `${p.avgRoas.toFixed(1)}x` },
                              ].map(({ l, v }) => (
                                <div key={l} className="text-center">
                                  <p className="text-[9px] text-emerald-600 font-bold uppercase">{l}</p>
                                  <p className="text-xs font-black text-emerald-800">{v}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Performers */}
                    {advice.bottomPerformers?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <h4 className="text-sm font-bold text-gray-900">Needs Attention</h4>
                        </div>
                        {advice.bottomPerformers.map((p, i) => (
                          <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-xs font-bold text-red-800 truncate">{p.campaignName}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {[
                                { l: 'Spend', v: `$${p.totalSpend.toFixed(0)}` },
                                { l: 'CTR', v: `${p.avgCtr.toFixed(1)}%` },
                                { l: 'ROAS', v: `${p.avgRoas.toFixed(1)}x` },
                              ].map(({ l, v }) => (
                                <div key={l} className="text-center">
                                  <p className="text-[9px] text-red-500 font-bold uppercase">{l}</p>
                                  <p className="text-xs font-black text-red-700">{v}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audience Insights */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="advisor-audience">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-indigo-500" />
                      <h4 className="text-sm font-bold text-gray-900">Audience Insights</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{advice.audienceInsights}</p>
                  </div>

                  {/* 30-Day Outlook */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg" id="advisor-outlook">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">30-Day Outlook</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-200">{advice.outlook30Days}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Connect / Settings Tab ── */}
          {activeTab === 'connect' && (
            <div className="max-w-lg space-y-5" id="fb-connect">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold ${
                account
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                {account ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {account
                  ? `Connected to ${account.accountName || account.adAccountId}`
                  : 'No ad account connected — using demo mode with synthetic data'}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="fb-connect-form-card">
                <h3 className="text-sm font-black text-gray-900 mb-1">
                  {account ? 'Update Ad Account' : 'Connect Meta Ad Account'}
                </h3>
                <p className="text-xs text-gray-400 mb-5">
                  Find your Ad Account ID and Access Token in{' '}
                  <a href="https://business.facebook.com/settings/ad-accounts" target="_blank" rel="noreferrer"
                    className="text-blue-600 hover:underline font-medium">
                    Meta Business Manager
                  </a>. Leave Access Token blank to continue in demo mode.
                </p>

                <form onSubmit={handleConnect} className="space-y-4" id="fb-connect-form">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Ad Account ID <span className="text-red-400">*</span>
                    </label>
                    <input required value={formAdAccountId} onChange={(e) => setFormAdAccountId(e.target.value)}
                      placeholder="act_1234567890"
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                      id="fb-account-id-input" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Access Token (leave blank for demo mode)
                    </label>
                    <input type="password" value={formToken} onChange={(e) => setFormToken(e.target.value)}
                      placeholder="EAAxxxxxxxxx..."
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                      id="fb-access-token-input" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Account Name (optional)</label>
                    <input value={formAccountName} onChange={(e) => setFormAccountName(e.target.value)}
                      placeholder="e.g. Pinecrest Ridge Ads"
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      id="fb-account-name-input" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Page ID (optional)</label>
                    <input value={formPageId} onChange={(e) => setFormPageId(e.target.value)}
                      placeholder="1234567890"
                      className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                      id="fb-page-id-input" />
                  </div>

                  {connectMsg && (
                    <div className={`text-xs px-3 py-2 rounded-xl ${
                      connectMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>{connectMsg}</div>
                  )}

                  <button type="submit" disabled={connectLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    id="fb-connect-submit">
                    {connectLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                    {connectLoading ? 'Connecting…' : account ? 'Update Account' : 'Connect Account'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
