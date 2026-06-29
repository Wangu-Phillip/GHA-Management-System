import React, { useState, useEffect } from 'react';
import { Campaign, MessageLog, Guesthouse, Customer, Booking } from '../types';
import { Send, Settings, Sparkles, MessageSquare, ShieldAlert, History, Key, CheckCircle, RefreshCw, Smartphone, Users, Check, ChevronDown, ChevronUp, MessageCircle, AlertCircle, Eye, CornerDownRight } from 'lucide-react';

interface MarketingProps {
  campaigns: Campaign[];
  logs: MessageLog[];
  guesthouse: Guesthouse;
  guesthouseId: string;
  optInCount: number;
  customers: Customer[];
  bookings: Booking[];
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
  bookings = [],
  onRefresh,
  onUpdateGuesthouse
}: MarketingProps) {
  const [subTab, setSubTab] = useState<'campaign' | 'review' | 'logs' | 'settings'>('campaign');
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);

  // Campaign Form State
  const [campName, setCampName] = useState('');
  const [campTemplate, setCampTemplate] = useState('Hi {{name}}! We are offering a special discount for your next weekend escape at Pinecrest Ridge! Use coupon SUMMER15 for 15% off.');
  const [campaignStatus, setCampaignStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Customer selection state
  const consentedCustomers = customers.filter(c => c.optInPromo);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCustomerIds(customers.filter(c => c.optInPromo).map(c => c.id));
  }, [customers]);

  const toggleCustomerSelection = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const selectAllCustomers = () => {
    setSelectedCustomerIds(consentedCustomers.map(c => c.id));
  };

  const deselectAllCustomers = () => {
    setSelectedCustomerIds([]);
  };

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
          messageTemplate: campTemplate,
          customerIds: selectedCustomerIds
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
        <div className="space-y-6" id="campaigns-tab-panel">
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

                {/* Selective Customer Checkbox List */}
                {optInCount > 0 && (
                  <div className="space-y-2 border-t border-gray-100 pt-4" id="field-camp-recipients-selection">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        CHOOSE RECIPIENTS ({selectedCustomerIds.length} of {consentedCustomers.length} SELECTED)
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={selectAllCustomers}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider"
                          id="btn-select-all-promo"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300 text-[10px]">|</span>
                        <button
                          type="button"
                          onClick={deselectAllCustomers}
                          className="text-[10px] text-gray-500 hover:text-gray-700 font-bold uppercase tracking-wider"
                          id="btn-deselect-all-promo"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-gray-100 bg-gray-50/50 p-2 space-y-1" id="recipients-picker-box">
                      {consentedCustomers.map((c) => {
                        const isSelected = selectedCustomerIds.includes(c.id);
                        return (
                          <div
                            key={c.id}
                            onClick={() => toggleCustomerSelection(c.id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-100' : 'bg-white hover:bg-gray-50 border border-gray-100'
                            }`}
                            id={`recipient-opt-${c.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // event handled by parent click
                                className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                              />
                              <div className="text-left">
                                <p className="text-xs font-bold text-gray-800">{c.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{c.phone}</p>
                              </div>
                            </div>
                            {c.customerCountry && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-600">
                                {c.customerCountry}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {optInCount === 0 ? (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2" id="no-consent-warning">
                    <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                    <span>No customers have checked the "WhatsApp Promotional Opt-In" box in your customer records yet. Head to the Customers register to toggle marketing permissions.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={campaignStatus === 'sending' || campaignStatus === 'success' || selectedCustomerIds.length === 0}
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
                        Bulk Blast Template to {selectedCustomerIds.length} Guests
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

          {/* Detailed Broadcast Campaign History & Metrics Dashboard */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="campaign-history-section">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-50 pb-4 gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">WhatsApp Campaign Audit & Metrics Dashboard</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track delivery rates, customer replies, and direct booking conversions driven by promotional broadcasts.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase tracking-wider self-start md:self-center">
                {campaigns.length} Campaigns Registered
              </span>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center p-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200" id="no-campaigns-state">
                <History className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <h5 className="font-semibold text-gray-700 text-xs">No Campaigns Dispatched Yet</h5>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
                  Once you configure a promotional template and click "Bulk Blast Template" above, it will log recipient statuses and track live statistics here.
                </p>
              </div>
            ) : (
              <div className="space-y-4" id="campaign-history-list">
                {campaigns.slice().reverse().map((campaign) => {
                  const campLogs = logs.filter(l => l.campaignId === campaign.id);
                  const outboundLogs = campLogs.filter(l => l.direction === 'OUTBOUND');
                  const sentCount = outboundLogs.length;

                  // Read metrics
                  const readLogs = outboundLogs.filter(l => l.status === 'READ');
                  const readCount = readLogs.length;
                  const readPercentage = sentCount > 0 ? Math.round((readCount / sentCount) * 100) : 0;

                  // Replies metrics
                  const inboundLogs = campLogs.filter(l => l.direction === 'INBOUND');
                  const replyCount = inboundLogs.length;
                  const replyPercentage = sentCount > 0 ? Math.round((replyCount / sentCount) * 100) : 0;

                  // Booking Conversions / Showed Up
                  const recipientPhones = outboundLogs.map(l => l.phone);
                  const showedUpBookings = bookings.filter(b => 
                    recipientPhones.includes(b.customerPhone) && 
                    (b.status === 'CHECKED_IN' || b.status === 'CHECKED_OUT' || b.status === 'CONFIRMED') &&
                    new Date(b.createdAt) >= new Date(campaign.createdAt)
                  );
                  const showedUpCount = showedUpBookings.length;
                  const showedUpPercentage = sentCount > 0 ? Math.round((showedUpCount / sentCount) * 100) : 0;

                  const isExpanded = selectedCampId === campaign.id;

                  // Compile detailed recipient status mapping
                  const recipientsDetail = outboundLogs.map(ol => {
                    const customer = customers.find(c => c.phone === ol.phone);
                    const replyLog = inboundLogs.find(il => il.phone === ol.phone);
                    const matchingBooking = bookings.find(b => 
                      b.customerPhone === ol.phone && 
                      (b.status === 'CHECKED_IN' || b.status === 'CHECKED_OUT' || b.status === 'CONFIRMED') &&
                      new Date(b.createdAt) >= new Date(campaign.createdAt)
                    );

                    return {
                      phone: ol.phone,
                      name: customer ? customer.name : (matchingBooking ? matchingBooking.customerName : 'Valued Guest'),
                      status: ol.status,
                      reply: replyLog ? replyLog.content : null,
                      booking: matchingBooking || null
                    };
                  });

                  return (
                    <div 
                      key={campaign.id} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isExpanded ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50/10' : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                      id={`campaign-card-${campaign.id}`}
                    >
                      {/* Campaign Summary Accordion Header */}
                      <div 
                        onClick={() => setSelectedCampId(isExpanded ? null : campaign.id)}
                        className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 cursor-pointer"
                        id={`campaign-header-${campaign.id}`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 text-xs truncate max-w-xs">{campaign.name}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700">
                              {campaign.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Sent {new Date(campaign.createdAt).toLocaleDateString()} at {new Date(campaign.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-[11px] text-gray-500 italic truncate max-w-md">
                            "{campaign.messageTemplate}"
                          </p>
                        </div>

                        {/* Interactive Metrics Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full xl:w-auto" id="metrics-bar">
                          <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-center min-w-[85px]">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Sent</span>
                            <span className="text-xs font-extrabold text-gray-900 flex items-center justify-center gap-1 mt-0.5">
                              <Users className="h-3 w-3 text-indigo-500" /> {sentCount || 0}
                            </span>
                          </div>

                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2 text-center min-w-[85px]">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Saw (Read)</span>
                            <span className="text-xs font-extrabold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                              <Eye className="h-3 w-3 text-emerald-500" /> {readCount || 0}
                              <span className="text-[9px] font-normal text-emerald-500">({readPercentage}%)</span>
                            </span>
                          </div>

                          <div className="bg-teal-50/50 border border-teal-100 rounded-xl px-3 py-2 text-center min-w-[85px]">
                            <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider block">Replied</span>
                            <span className="text-xs font-extrabold text-teal-700 flex items-center justify-center gap-1 mt-0.5">
                              <MessageCircle className="h-3 w-3 text-teal-500" /> {replyCount || 0}
                              <span className="text-[9px] font-normal text-teal-500">({replyPercentage}%)</span>
                            </span>
                          </div>

                          <div className="bg-amber-50/50 border border-amber-100 rounded-xl px-3 py-2 text-center min-w-[85px]">
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block">Showed Up</span>
                            <span className="text-xs font-extrabold text-amber-700 flex items-center justify-center gap-1 mt-0.5">
                              <CheckCircle className="h-3 w-3 text-amber-500" /> {showedUpCount || 0}
                              <span className="text-[9px] font-normal text-amber-500">({showedUpPercentage}%)</span>
                            </span>
                          </div>
                        </div>

                        {/* Chevron Trigger */}
                        <div className="flex items-center justify-end">
                          <button className="p-1 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Recipient Logs & Conversions breakdown */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/30 p-5 space-y-4 animate-fade-in" id="campaign-details">
                          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campaign template preview</span>
                            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {campaign.messageTemplate}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="font-bold text-gray-800 text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <CornerDownRight className="h-3 w-3 text-indigo-500" />
                              RECIPIENT-LEVEL AUDIT TRAIL
                            </h5>

                            {recipientsDetail.length === 0 ? (
                              <p className="text-xs text-gray-400 italic p-3">No message logs tracked for this legacy campaign.</p>
                            ) : (
                              <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50 text-[9px] font-bold text-gray-500 uppercase border-b border-gray-100">
                                      <th className="p-3">Customer Name</th>
                                      <th className="p-3">Phone Number</th>
                                      <th className="p-3 text-center">Outbound Status</th>
                                      <th className="p-3">Inbound Customer Reply</th>
                                      <th className="p-3">Showed Up / Conversion Booking</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50 text-gray-700">
                                    {recipientsDetail.map((rec, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-gray-50/50" id={`recipient-row-${rIdx}`}>
                                        <td className="p-3 font-semibold text-gray-900">{rec.name}</td>
                                        <td className="p-3 font-mono text-gray-500 text-[11px]">{rec.phone}</td>
                                        <td className="p-3 text-center">
                                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                            rec.status === 'READ' ? 'bg-green-50 text-green-700 border border-green-200' :
                                            rec.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            rec.status === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' :
                                            'bg-blue-50 text-blue-700 border border-blue-100'
                                          }`}>
                                            {rec.status === 'READ' && <Eye className="h-2.5 w-2.5" />}
                                            {rec.status}
                                          </span>
                                        </td>
                                        <td className="p-3">
                                          {rec.reply ? (
                                            <div className="bg-teal-50 border border-teal-100 text-teal-800 text-[11px] p-2 rounded-xl max-w-xs font-medium leading-relaxed">
                                              <span className="text-[8px] font-bold text-teal-600 block uppercase mb-0.5">Customer Replied</span>
                                              "{rec.reply}"
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 italic text-[11px]">- No response</span>
                                          )}
                                        </td>
                                        <td className="p-3">
                                          {rec.booking ? (
                                            <div className="bg-amber-50/80 border border-amber-100 text-amber-900 text-[11px] p-2 rounded-xl max-w-xs space-y-0.5">
                                              <div className="flex items-center gap-1 font-bold text-amber-700 text-[9px] uppercase tracking-wider">
                                                <CheckCircle className="h-2.5 w-2.5" /> Showed Up ({rec.booking.status})
                                              </div>
                                              <div className="font-semibold text-gray-800">{rec.booking.roomName}</div>
                                              <div className="text-[10px] text-gray-500">
                                                CheckIn: {new Date(rec.booking.checkIn).toLocaleDateString()} | Total: P{rec.booking.totalAmount}
                                              </div>
                                            </div>
                                          ) : (
                                            <span className="text-gray-400 italic text-[11px]">- No booking conversion</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
