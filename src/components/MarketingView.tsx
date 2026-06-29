import React, { useState } from 'react';
import { Campaign, MessageLog, Guesthouse, Customer } from '../types';
import { Send, Settings, Sparkles, MessageSquare, ShieldAlert, History, Key, CheckCircle, RefreshCw, Smartphone } from 'lucide-react';

interface MarketingProps {
  campaigns: Campaign[];
  logs: MessageLog[];
  guesthouse: Guesthouse;
  guesthouseId: string;
  optInCount: number;
  customers: Customer[];
  onRefresh: () => Promise<void>;
  onUpdateGuesthouse: (gh: Guesthouse) => void;
}

export default function MarketingView({
  campaigns,
  logs,
  guesthouse,
  guesthouseId,
  optInCount,
  customers = [],
  onRefresh,
  onUpdateGuesthouse
}: MarketingProps) {
  const [subTab, setSubTab] = useState<'campaign' | 'review' | 'logs' | 'settings'>('campaign');

  // Campaign Form State
  const [campName, setCampName] = useState('');
  const [campTemplate, setCampTemplate] = useState('Hi {{name}}! We are offering a special discount for your next weekend escape at Pinecrest Ridge! Use coupon SUMMER15 for 15% off.');
  const [campaignStatus, setCampaignStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // WhatsApp Meta form states
  const [phoneId, setPhoneId] = useState(guesthouse.whatsappPhoneId || '');
  const [token, setToken] = useState(guesthouse.whatsappToken || '');
  const [businessId, setBusinessId] = useState(guesthouse.whatsappBusinessId || '');
  const [saveStatus, setSaveStatus] = useState(false);

  // Automation states
  const [automationTriggering, setAutomationTriggering] = useState(false);
  const [automationResult, setAutomationResult] = useState<any>(null);

  // Single Quick Message States
  const [quickPhone, setQuickPhone] = useState('');
  const [quickText, setQuickText] = useState('');
  const [quickStatus, setQuickStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Submit WhatsApp Meta credentials
  const saveWhatsAppSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/marketing/whatsapp-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          whatsappPhoneId: phoneId,
          whatsappToken: token,
          whatsappBusinessId: businessId
        })
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateGuesthouse(data.guesthouse);
        setSaveStatus(true);
        setTimeout(() => setSaveStatus(false), 2000);
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Launch Campaign Blast
  const launchCampaignBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campTemplate) return;
    setCampaignStatus('sending');

    try {
      const response = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          campaignName: campName,
          messageTemplate: campTemplate
        })
      });

      if (response.ok) {
        setCampaignStatus('success');
        setCampName('');
        await onRefresh();
        setTimeout(() => setCampaignStatus('idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      setCampaignStatus('idle');
    }
  };

  // Dispatch manual single quick text
  const sendQuickText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone || !quickText) return;
    setQuickStatus('sending');

    try {
      const response = await fetch('/api/marketing/whatsapp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          phone: quickPhone,
          content: quickText,
          messageType: 'GENERAL'
        })
      });

      if (response.ok) {
        setQuickStatus('success');
        setQuickPhone('');
        setQuickText('');
        await onRefresh();
        setTimeout(() => setQuickStatus('idle'), 2000);
      }
    } catch (err) {
      console.error(err);
      setQuickStatus('idle');
    }
  };

  // Trigger day-of-checkout automatic feedback solicitation right now!
  const triggerCheckoutSweep = async () => {
    setAutomationTriggering(true);
    setAutomationResult(null);

    try {
      const response = await fetch('/api/marketing/whatsapp-automations/trigger-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesthouseId })
      });

      if (response.ok) {
        const data = await response.json();
        setAutomationResult(data);
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAutomationTriggering(false);
    }
  };

  return (
    <div className="space-y-6" id="marketing-view">
      {/* Sub menu tabs */}
      <div className="flex border-b border-gray-100 gap-4" id="marketing-sub-tabs">
        <button
          onClick={() => setSubTab('campaign')}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            subTab === 'campaign' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-campaign"
        >
          <Sparkles className="h-4 w-4" />
          Broadcast Campaigns
        </button>

        <button
          onClick={() => setSubTab('review')}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            subTab === 'review' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-review"
        >
          <MessageSquare className="h-4 w-4" />
          Checkout Review Automations
        </button>

        <button
          onClick={() => setSubTab('logs')}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            subTab === 'logs' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-logs"
        >
          <History className="h-4 w-4" />
          WhatsApp Log Audit
        </button>

        <button
          onClick={() => setSubTab('settings')}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            subTab === 'settings' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-settings"
        >
          <Settings className="h-4 w-4" />
          Meta API Integration
        </button>
      </div>

      {/* Broadcast Campaigns tab panel */}
      {subTab === 'campaign' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="campaigns-panel">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-6" id="campaign-creator-card">
            <div id="creator-headers">
              <h4 className="font-semibold text-gray-900">Configure Marketing Broadcast</h4>
              <p className="text-xs text-gray-400 mt-1">
                Trigger bulk messages to <span className="font-bold text-gray-700">{optInCount} active customers</span> who consented under Botswana Data Protection Act (DPA) terms.
              </p>
            </div>

            <form onSubmit={launchCampaignBlast} className="space-y-4" id="campaign-form">
              <div className="space-y-1" id="field-camp-name">
                <label className="text-xs font-bold text-gray-500">CAMPAIGN TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. July Summer Escape Off"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="field-camp-template">
                <label className="text-xs font-bold text-gray-500">WHATSAPP MESSAGE TEXT (CUSTOM TEMPLATE)</label>
                <textarea
                  rows={4}
                  required
                  value={campTemplate}
                  onChange={(e) => setCampTemplate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
                <p className="text-[10px] text-gray-400 font-medium">Use <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">{"{{name}}"}</code> to dynamically personalize the customer's name.</p>
              </div>

              {optInCount === 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2" id="no-consent-warning">
                  <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                  <span>No customers have checked the "WhatsApp Promotional Opt-In" box in your customer records yet. Head to the Customers register to toggle marketing permissions.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={campaignStatus === 'sending' || campaignStatus === 'success'}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                  id="campaign-submit-btn"
                >
                  {campaignStatus === 'sending' ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Blasting Campaigns...
                    </>
                  ) : campaignStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Dispatched Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Bulk Blast Template to {optInCount} Guests
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Quick manual text sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between" id="quick-manual-card">
            <div className="space-y-4" id="quick-manual-inner">
              <div id="quick-headers">
                <h4 className="font-semibold text-gray-900">Direct Message Sandbox</h4>
                <p className="text-xs text-gray-400 mt-1">Send a single quick message instantly to test client phone inputs.</p>
              </div>

              <form onSubmit={sendQuickText} className="space-y-4" id="quick-form">
                <div className="space-y-1" id="field-quick-customer-select">
                  <label className="text-xs font-bold text-gray-500">SELECT CONSENTED CUSTOMER</label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setQuickPhone(val);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white text-gray-700"
                  >
                    <option value="">-- Or select from consented customers --</option>
                    {customers.filter(c => c.optInPromo).map(c => (
                      <option key={c.id} value={c.phone}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1" id="field-quick-phone">
                  <label className="text-xs font-bold text-gray-500">RECIPIENT PHONE (WITH COUNTRY CODE)</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +267 71234567"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1" id="field-quick-text">
                  <label className="text-xs font-bold text-gray-500">CONTENT</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Hi there, checking on your stay?"
                    value={quickText}
                    onChange={(e) => setQuickText(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quickStatus === 'sending' || quickStatus === 'success'}
                  className="w-full py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                  id="quick-submit-btn"
                >
                  {quickStatus === 'sending' ? 'Transmitting...' : quickStatus === 'success' ? 'Sent!' : 'Shoot Sandbox Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Checkout review automation panel */}
      {subTab === 'review' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="review-automation-panel">
          <div id="review-auto-headers">
            <h4 className="font-semibold text-gray-900">Daily Checkout Review Solicitation</h4>
            <p className="text-xs text-gray-400 mt-1">
              Guesthouses can collect Google/TripAdvisor reviews automatically. The engine matches bookings checking out today, formats templates, and prompts checkout messages automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="review-stats-grid">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100" id="stat-reviews-total">
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Review Reminders Sent</span>
              <span className="text-2xl font-extrabold text-gray-900 block mt-1">
                {logs.filter(l => l.messageType === 'REVIEW_REQUEST' && l.status === 'DELIVERED').length}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100" id="stat-reviews-response">
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Simulated Response Rate</span>
              <span className="text-2xl font-extrabold text-teal-600 block mt-1">68%</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between" id="stat-reviews-frequency">
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Trigger Time</span>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-xs text-gray-400 font-medium">Scan checkouts at:</span>
                <select
                  value={guesthouse.reviewTriggerTime || '11:00 AM'}
                  onChange={async (e) => {
                    const newTime = e.target.value;
                    try {
                      const response = await fetch('/api/marketing/whatsapp-settings', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          guesthouseId: guesthouse.id,
                          reviewTriggerTime: newTime,
                        })
                      });
                      if (response.ok) {
                        const res = await response.json();
                        onUpdateGuesthouse(res.guesthouse);
                      } else {
                        alert('Failed to save trigger time');
                      }
                    } catch (err) {
                      console.error('Failed to update trigger time:', err);
                    }
                  }}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none"
                  id="trigger-time-select"
                >
                  {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4" id="review-trigger-block">
            <div id="trigger-headers">
              <h5 className="font-semibold text-gray-800 text-xs">Run Manual Automated Sweep</h5>
              <p className="text-xs text-gray-500">Scan for checkout events on the current date and run dispatch instantly.</p>
            </div>

            <button
              onClick={triggerCheckoutSweep}
              disabled={automationTriggering}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              id="checkout-sweep-btn"
            >
              {automationTriggering ? 'Scanning checkouts...' : 'Scan & Ingest Review Messages'}
            </button>

            {automationResult && (
              <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs space-y-1 animate-fade-in" id="sweep-result">
                <p className="font-bold">Checkout Scanner completed successfully!</p>
                <p>Processed checked-out guests today: <span className="font-bold">{automationResult.processedCheckoutsTodayCount}</span></p>
                <p>Messages successfully dispatched to WhatsApp Business: <span className="font-bold">{automationResult.messagesSuccessfullyDispatchedCount}</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Logs Audit Panel */}
      {subTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="logs-panel">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between" id="logs-header">
            <h4 className="font-semibold text-gray-900 text-xs">WhatsApp Message Dispatch Logs</h4>
            <span className="text-xs font-mono text-gray-500">{logs.length} messages logged</span>
          </div>

          <div className="overflow-x-auto" id="logs-table-wrapper">
            <table className="w-full text-left text-xs border-collapse" id="logs-table">
              <thead>
                <tr className="bg-gray-100/50 text-[10px] font-bold text-gray-500 border-b border-gray-100 uppercase">
                  <th className="p-3">Logged At</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Content</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50" id="logs-table-body">
                {logs.length > 0 ? (
                  logs.slice().reverse().map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50/50" id={`log-${l.id}`}>
                      <td className="p-3 text-gray-400 text-[10px]">{new Date(l.createdAt).toLocaleTimeString()} - {new Date(l.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-mono font-medium text-gray-800">{l.phone}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          l.messageType === 'PROMO' ? 'bg-amber-50 text-amber-700' :
                          l.messageType === 'REVIEW_REQUEST' ? 'bg-teal-50 text-teal-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {l.messageType}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 font-medium max-w-sm truncate" title={l.content}>{l.content}</td>
                      <td className="p-3 font-semibold text-gray-500">{l.direction}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          l.status === 'DELIVERED' || l.status === 'READ' ? 'bg-green-50 text-green-700' :
                          l.status === 'FAILED' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      No communications logged. Launch a broadcast campaign or send sandbox tests to audit messages.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Meta API Integration Settings */}
      {subTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="settings-panel">
          <div id="settings-headers">
            <h4 className="font-semibold text-gray-900">Setup Meta WhatsApp Business API Cloud Endpoint</h4>
            <p className="text-xs text-gray-400 mt-1">Connect your verified Meta developer accounts to transmit outbound texts directly from your business numbers.</p>
          </div>

          <form onSubmit={saveWhatsAppSettings} className="space-y-4 max-w-xl" id="whatsapp-settings-form">
            <div className="space-y-1" id="field-phone-id">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Smartphone className="h-4 w-4" />
                <label>META WHATSAPP PHONE NUMBER ID</label>
              </div>
              <input
                type="text"
                placeholder="e.g. 108495029302941"
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1" id="field-token">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Key className="h-4 w-4" />
                <label>WHATSAPP SYSTEM ACCESS TOKEN</label>
              </div>
              <input
                type="password"
                placeholder="EAAGb0ZC..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1" id="field-business-id">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Settings className="h-4 w-4" />
                <label>WHATSAPP BUSINESS ACCOUNT ID</label>
              </div>
              <input
                type="text"
                placeholder="e.g. 984501920392019"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
              id="save-settings-btn"
            >
              Update WhatsApp Number Settings
            </button>

            {saveStatus && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs animate-fade-in" id="settings-success">
                Meta credentials stored successfully! Ready to send outbound WhatsApp messages from your business account.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
