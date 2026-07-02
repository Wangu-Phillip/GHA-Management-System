import React, { useState, useEffect } from 'react';
import { Campaign, MessageLog, Guesthouse, Customer, Booking } from '../types';
import {
  Send, Settings, Sparkles, MessageSquare, ShieldAlert, History, Key,
  CheckCircle, RefreshCw, Smartphone, Users, Check, ChevronDown, ChevronUp,
  MessageCircle, AlertCircle, Eye, CornerDownRight, QrCode, Zap, Wifi,
  WifiOff, Copy, CheckCheck, Bell, BellOff
} from 'lucide-react';

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

// ── QR Code SVG (simulated, decorative) ──────────────────────────────────────
function QRCodeSVG({ size = 180 }: { size?: number }) {
  // Deterministic visual QR pattern — purely decorative UI placeholder
  const cells: boolean[][] = [];
  const seed = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0],
    [1,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,0,1,0,1,1],
    [0,0,1,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,0,1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,0,1,0,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,1,0,1,1],
  ];
  const cellSize = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" rx="8" />
      {seed.map((row, ri) =>
        row.map((cell, ci) =>
          cell ? (
            <rect
              key={`${ri}-${ci}`}
              x={ci * cellSize}
              y={ri * cellSize}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#111827"
              rx={cellSize > 6 ? 1 : 0}
            />
          ) : null
        )
      )}
    </svg>
  );
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
  const [subTab, setSubTab] = useState<'campaign' | 'review' | 'qr' | 'logs' | 'settings'>('campaign');
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

  // ── QR Linking State ──────────────────────────────────────────────────────────
  const [qrLinkStatus, setQrLinkStatus] = useState<'idle' | 'scanning' | 'linked'>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const QR_SESSION_URL = 'https://web.whatsapp.com/?session=gha-business-link';

  // Check initial connection status on mount / tab navigation
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`https://us-central1-gha-management.cloudfunctions.net/getSessionStatus?guesthouseId=${guesthouseId}`);
        if (res.ok) {
          const data = await res.json() as any;
          if (data.status === 'LINKED') {
            setQrLinkStatus('linked');
            setQrCodeUrl(null);
          } else if (data.status === 'AWAITING_SCAN') {
            setQrLinkStatus('scanning');
            setQrCodeUrl(data.qrCodeDataUrl);
          } else {
            setQrLinkStatus('idle');
            setQrCodeUrl(null);
          }
        }
      } catch (err) {
        console.error('Error fetching session status:', err);
      }
    };
    checkStatus();
  }, [guesthouseId, subTab]);

  // Poll for connection open status if in scanning mode
  useEffect(() => {
    if (qrLinkStatus !== 'scanning') return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`https://us-central1-gha-management.cloudfunctions.net/getSessionStatus?guesthouseId=${guesthouseId}`);
        if (res.ok) {
          const data = await res.json() as any;
          if (data.status === 'LINKED') {
            setQrLinkStatus('linked');
            setQrCodeUrl(null);
            clearInterval(intervalId);
          } else if (data.status === 'UNLINKED' || data.status === 'FAILED') {
            setQrLinkStatus('idle');
            setQrCodeUrl(null);
            clearInterval(intervalId);
          } else if (data.status === 'AWAITING_SCAN' && data.qrCodeDataUrl) {
            setQrCodeUrl(data.qrCodeDataUrl);
          }
        }
      } catch (err) {
        console.error('Error polling session status:', err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [qrLinkStatus, guesthouseId]);

  const handleQrScan = async () => {
    setQrLinkStatus('scanning');
    setQrCodeUrl(null);
    try {
      const res = await fetch(`https://us-central1-gha-management.cloudfunctions.net/getQrCode?guesthouseId=${guesthouseId}`);
      if (res.ok) {
        const data = await res.json() as any;
        setQrCodeUrl(data.qrCodeDataUrl);
      } else {
        setQrLinkStatus('idle');
        alert('Failed to retrieve QR code session. Try again.');
      }
    } catch (err) {
      console.error(err);
      setQrLinkStatus('idle');
      alert('Connection error initiating QR scan.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(QR_SESSION_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQrReset = () => {
    setQrLinkStatus('idle');
    setQrCodeUrl(null);
  };

  // ── Loadshedding / Utility Alert State ───────────────────────────────────────
  const checkedInGuests = bookings.filter(b => b.status === 'CHECKED_IN' || b.status === 'CONFIRMED');
  const upcomingGuests = bookings.filter(b => {
    if (b.status !== 'CONFIRMED') return false;
    const ci = new Date(b.checkIn);
    const now = new Date();
    const diffMs = ci.getTime() - now.getTime();
    return diffMs >= 0 && diffMs <= 48 * 60 * 60 * 1000; // within 48 hrs
  });
  const alertableGuests = [...new Map(
    [...checkedInGuests, ...upcomingGuests].map(b => [b.customerPhone, b])
  ).values()];

  const [selectedAlertPhones, setSelectedAlertPhones] = useState<string[]>([]);

  useEffect(() => {
    setSelectedAlertPhones(alertableGuests.map(g => g.customerPhone));
  }, [bookings]);

  const toggleAlertPhoneSelection = (phone: string) => {
    setSelectedAlertPhones(prev =>
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    );
  };

  const selectAllAlertGuests = () => {
    setSelectedAlertPhones(alertableGuests.map(g => g.customerPhone));
  };

  const deselectAllAlertGuests = () => {
    setSelectedAlertPhones([]);
  };

  const [alertTemplate, setAlertTemplate] = useState(
    'Dear {{name}}, please note that a power/water utility interruption is scheduled in our area from {{startTime}} to {{endTime}} today. We apologise for any inconvenience and have taken steps to ensure your comfort. Thank you for your understanding.'
  );
  const [alertStartTime, setAlertStartTime] = useState('18:00');
  const [alertEndTime, setAlertEndTime] = useState('20:30');
  const [alertType, setAlertType] = useState<'power' | 'water' | 'both'>('power');
  const [alertSending, setAlertSending] = useState(false);
  const [alertResults, setAlertResults] = useState<{ name: string; phone: string; status: string }[]>([]);
  const [alertDone, setAlertDone] = useState(false);

  const sendUtilityAlerts = async () => {
    const guestsToSend = alertableGuests.filter(g => selectedAlertPhones.includes(g.customerPhone));
    if (guestsToSend.length === 0) return;
    setAlertSending(true);
    setAlertResults([]);
    setAlertDone(false);

    const results: { name: string; phone: string; status: string }[] = [];

    for (const b of guestsToSend) {
      const personalized = alertTemplate
        .replace('{{name}}', b.customerName.split(' ')[0])
        .replace('{{startTime}}', alertStartTime)
        .replace('{{endTime}}', alertEndTime);

      try {
        const res = await fetch('/api/marketing/whatsapp-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guesthouseId,
            phone: b.customerPhone,
            content: personalized,
            messageType: 'GENERAL',
            bookingId: b.id,
          }),
        });
        const data = await res.json() as any;
        results.push({
          name: b.customerName,
          phone: b.customerPhone,
          status: data.status || (res.ok ? 'SENT' : 'FAILED'),
        });
      } catch {
        results.push({ name: b.customerName, phone: b.customerPhone, status: 'FAILED' });
      }
    }

    setAlertResults(results);
    setAlertSending(false);
    setAlertDone(true);
    await onRefresh();
  };

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

  // Trigger checkout review sweep
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
      <div className="flex border-b border-gray-100 gap-1 overflow-x-auto" id="marketing-sub-tabs">
        <button
          onClick={() => setSubTab('campaign')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'campaign' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-campaign"
        >
          <Sparkles className="h-4 w-4" />
          Broadcast Campaigns
        </button>

        <button
          onClick={() => setSubTab('review')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'review' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-review"
        >
          <MessageSquare className="h-4 w-4" />
          Checkout Reviews & Alerts
        </button>

        <button
          onClick={() => setSubTab('qr')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'qr' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-qr"
        >
          <QrCode className="h-4 w-4" />
          Link My WhatsApp Number
        </button>

        <button
          onClick={() => setSubTab('logs')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'logs' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          id="tab-logs"
        >
          <History className="h-4 w-4" />
          WhatsApp Log Audit
        </button>

        <button
          onClick={() => setSubTab('settings')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
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
                                onChange={() => {}}
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
                      onChange={(e) => { const val = e.target.value; if (val) setQuickPhone(val); }}
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

          {/* Campaign History */}
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
                  const readLogs = outboundLogs.filter(l => l.status === 'READ');
                  const readCount = readLogs.length;
                  const readPercentage = sentCount > 0 ? Math.round((readCount / sentCount) * 100) : 0;
                  const inboundLogs = campLogs.filter(l => l.direction === 'INBOUND');
                  const replyCount = inboundLogs.length;
                  const replyPercentage = sentCount > 0 ? Math.round((replyCount / sentCount) * 100) : 0;
                  const recipientPhones = outboundLogs.map(l => l.phone);
                  const showedUpBookings = bookings.filter(b =>
                    recipientPhones.includes(b.customerPhone) &&
                    (b.status === 'CHECKED_IN' || b.status === 'CHECKED_OUT' || b.status === 'CONFIRMED') &&
                    new Date(b.createdAt) >= new Date(campaign.createdAt)
                  );
                  const showedUpCount = showedUpBookings.length;
                  const showedUpPercentage = sentCount > 0 ? Math.round((showedUpCount / sentCount) * 100) : 0;
                  const isExpanded = selectedCampId === campaign.id;
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
                      <div
                        onClick={() => setSelectedCampId(isExpanded ? null : campaign.id)}
                        className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 cursor-pointer"
                        id={`campaign-header-${campaign.id}`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 text-xs truncate max-w-xs">{campaign.name}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700">{campaign.status}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Sent {new Date(campaign.createdAt).toLocaleDateString()} at {new Date(campaign.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-[11px] text-gray-500 italic truncate max-w-md">"{campaign.messageTemplate}"</p>
                        </div>

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

                        <div className="flex items-center justify-end">
                          <button className="p-1 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/30 p-5 space-y-4 animate-fade-in" id="campaign-details">
                          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campaign template preview</span>
                            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{campaign.messageTemplate}</p>
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

      {/* ── REVIEW + LOADSHEDDING TAB ── */}
      {subTab === 'review' && (
        <div className="space-y-6" id="review-tab-container">

          {/* Checkout Review Automation Panel */}
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
                          body: JSON.stringify({ guesthouseId: guesthouse.id, reviewTriggerTime: newTime })
                        });
                        if (response.ok) {
                          const res = await response.json();
                          onUpdateGuesthouse(res.guesthouse);
                        } else {
                          alert('Failed to save trigger time');
                        }
                      } catch (err) { console.error(err); }
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

          {/* ── LOADSHEDDING / UTILITY ALERTS ── */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden" id="utility-alerts-panel">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between" id="utility-header">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-xl shadow-sm shadow-amber-200">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">⚡ Power & Water Utility Alerts</h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">Warn current guests of loadshedding or utility outages via WhatsApp.</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                alertableGuests.length > 0
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}>
                {alertableGuests.length} guest{alertableGuests.length !== 1 ? 's' : ''} in-house
              </span>
            </div>

            <div className="p-6 space-y-6" id="utility-body">
              {/* Alert Type Selector */}
              <div className="space-y-2" id="alert-type-block">
                <label className="text-xs font-bold text-gray-500">OUTAGE TYPE</label>
                <div className="flex gap-2 flex-wrap" id="alert-type-buttons">
                  {(['power', 'water', 'both'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAlertType(type)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        alertType === type
                          ? type === 'power' ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : type === 'water' ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                            : 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                      }`}
                      id={`alert-type-${type}`}
                    >
                      {type === 'power' ? '⚡ Power/Electricity' : type === 'water' ? '💧 Water Supply' : '⚡💧 Both'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4" id="alert-time-grid">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">OUTAGE START TIME</label>
                  <input
                    type="time"
                    value={alertStartTime}
                    onChange={(e) => setAlertStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none font-mono"
                    id="alert-start-time"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">ESTIMATED END TIME</label>
                  <input
                    type="time"
                    value={alertEndTime}
                    onChange={(e) => setAlertEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none font-mono"
                    id="alert-end-time"
                  />
                </div>
              </div>

              {/* Message Template */}
              <div className="space-y-1" id="alert-template-block">
                <label className="text-xs font-bold text-gray-500">ALERT MESSAGE TEMPLATE</label>
                <textarea
                  rows={4}
                  value={alertTemplate}
                  onChange={(e) => setAlertTemplate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  id="alert-template-input"
                />
                <p className="text-[10px] text-gray-400">
                  Use <code className="font-mono bg-gray-100 px-1 rounded">{"{{name}}"}</code>,{' '}
                  <code className="font-mono bg-gray-100 px-1 rounded">{"{{startTime}}"}</code>,{' '}
                  <code className="font-mono bg-gray-100 px-1 rounded">{"{{endTime}}"}</code> placeholders.
                </p>
              </div>

              {/* Live Preview */}
              {alertableGuests.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-1.5" id="alert-preview">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Live Preview (first guest)</span>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {alertTemplate
                      .replace('{{name}}', alertableGuests[0].customerName.split(' ')[0])
                      .replace('{{startTime}}', alertStartTime)
                      .replace('{{endTime}}', alertEndTime)
                    }
                  </p>
                </div>
              )}

              {/* Guest list */}
              {alertableGuests.length > 0 && (
                <div className="space-y-2" id="alertable-guests-list">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Current & Arriving Guests ({selectedAlertPhones.length} of {alertableGuests.length} Selected)
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAllAlertGuests}
                        className="text-[10px] text-amber-600 hover:text-amber-800 font-bold uppercase tracking-wider animate-fade-in"
                        id="btn-select-all-alerts"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300 text-[10px]">|</span>
                      <button
                        type="button"
                        onClick={deselectAllAlertGuests}
                        className="text-[10px] text-gray-500 hover:text-gray-700 font-bold uppercase tracking-wider animate-fade-in"
                        id="btn-deselect-all-alerts"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 max-h-40 overflow-y-auto bg-gray-50/20">
                    {alertableGuests.map((b) => {
                      const isSelected = selectedAlertPhones.includes(b.customerPhone);
                      return (
                        <div
                          key={b.id}
                          onClick={() => toggleAlertPhoneSelection(b.customerPhone)}
                          className={`flex items-center justify-between px-4 py-2.5 text-xs cursor-pointer transition-all ${
                            isSelected ? 'bg-amber-50/40 hover:bg-amber-100/30' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // toggled by parent click
                              className="rounded text-amber-500 focus:ring-amber-400 h-3.5 w-3.5 cursor-pointer"
                            />
                            <div>
                              <span className="font-semibold text-gray-800">{b.customerName}</span>
                              <span className="text-gray-400 font-mono ml-2 text-[10px]">{b.customerPhone}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-[10px]">{b.roomName.split(' ').slice(0, 2).join(' ')}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              b.status === 'CHECKED_IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Send Button */}
              {alertableGuests.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 flex items-center gap-2">
                  <BellOff className="h-4 w-4 text-gray-400" />
                  No guests currently checked in or arriving within 48 hours. Alerts will show eligible guests here automatically.
                </div>
              ) : (
                <button
                  onClick={sendUtilityAlerts}
                  disabled={alertSending || selectedAlertPhones.length === 0}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-amber-200 transition-all"
                  id="send-utility-alert-btn"
                >
                  {alertSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending alerts to {selectedAlertPhones.length} guests...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" />
                      Send Utility Alert to {selectedAlertPhones.length} Selected Guest{selectedAlertPhones.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              )}

              {/* Results */}
              {alertDone && alertResults.length > 0 && (
                <div className="space-y-2 animate-fade-in" id="alert-results">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Dispatch Results</span>
                  <div className="border border-gray-100 rounded-xl divide-y divide-gray-50">
                    {alertResults.map((r, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-xs">
                        <div>
                          <span className="font-semibold text-gray-800">{r.name}</span>
                          <span className="text-gray-400 font-mono ml-2 text-[10px]">{r.phone}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          r.status === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-teal-700 font-semibold">
                    ✓ {alertResults.filter(r => r.status !== 'FAILED').length} of {alertResults.length} alerts dispatched.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── QR LINK NUMBER TAB ── */}
      {subTab === 'qr' && (
        <div className="space-y-6" id="qr-tab-panel">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="qr-panel">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-emerald-100" id="qr-header">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-xl shadow-sm shadow-emerald-200">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Link Your Business WhatsApp Number</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Send messages from your own established business phone number — not a random system number.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8" id="qr-body">
              {/* Left: QR Panel */}
              <div className="flex flex-col items-center gap-6" id="qr-left">
                <div className="relative" id="qr-code-wrapper">
                  {/* Animated ring when scanning */}
                  {qrLinkStatus === 'scanning' && (
                    <div className="absolute -inset-3 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30" />
                  )}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    qrLinkStatus === 'linked'
                      ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100'
                      : qrLinkStatus === 'scanning'
                      ? 'border-emerald-300 bg-white shadow-xl'
                      : 'border-gray-100 bg-white shadow-sm'
                  }`} id="qr-display-box">
                    {qrLinkStatus === 'linked' ? (
                      <div className="w-44 h-44 flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-emerald-100 rounded-full">
                          <CheckCheck className="h-10 w-10 text-emerald-600" />
                        </div>
                        <p className="text-sm font-bold text-emerald-700">Device Linked!</p>
                        <p className="text-[10px] text-emerald-600 text-center">Your WhatsApp Business number is now active.</p>
                      </div>
                    ) : (
                      <div className={`w-44 h-44 flex items-center justify-center transition-all ${qrLinkStatus === 'scanning' ? 'opacity-60' : 'opacity-100'}`}>
                        {qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="WhatsApp Web QR Code" className="w-40 h-40 animate-fade-in" />
                        ) : (
                          <QRCodeSVG size={176} />
                        )}
                      </div>
                    )}
                  </div>

                  {qrLinkStatus === 'scanning' && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-bold text-emerald-700">Scanning...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${
                  qrLinkStatus === 'linked'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : qrLinkStatus === 'scanning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`} id="qr-status-badge">
                  {qrLinkStatus === 'linked' ? (
                    <><Wifi className="h-3.5 w-3.5" /> Business Number Active</>
                  ) : qrLinkStatus === 'scanning' ? (
                    <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Awaiting scan on your phone...</>
                  ) : (
                    <><WifiOff className="h-3.5 w-3.5" /> Not Linked Yet</>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full max-w-xs" id="qr-actions">
                  {qrLinkStatus === 'idle' && (
                    <button
                      onClick={handleQrScan}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all"
                      id="btn-connect-qr"
                    >
                      <QrCode className="h-4 w-4" />
                      Connect via QR Code
                    </button>
                  )}

                  {qrLinkStatus === 'scanning' && (
                    <button
                      onClick={handleQrReset}
                      className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-all"
                      id="btn-cancel-qr"
                    >
                      Cancel
                    </button>
                  )}

                  {qrLinkStatus === 'linked' && (
                    <button
                      onClick={handleQrReset}
                      className="w-full py-2.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold transition-all"
                      id="btn-unlink-qr"
                    >
                      Unlink Device
                    </button>
                  )}

                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2.5 border border-gray-100 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    id="btn-copy-qr-link"
                  >
                    {copied ? <><CheckCheck className="h-4 w-4 text-emerald-500" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Session Link</>}
                  </button>
                </div>
              </div>

              {/* Right: Instructions */}
              <div className="space-y-6" id="qr-right">
                <div>
                  <h5 className="font-bold text-gray-900 text-sm mb-3">How to Link Your Number</h5>
                  <ol className="space-y-4" id="qr-steps">
                    {[
                      { step: '1', icon: '📱', title: 'Open WhatsApp on your phone', desc: 'Use the business number you want guests to receive messages from.' },
                      { step: '2', icon: '⚙️', title: 'Go to Linked Devices', desc: 'Tap the three dots menu (Android) or Settings (iPhone) → Linked Devices.' },
                      { step: '3', icon: '🔗', title: 'Tap "Link a Device"', desc: 'Point your phone camera at the QR code displayed on the left.' },
                      { step: '4', icon: '✅', title: 'You\'re connected!', desc: 'Once linked, all WhatsApp campaigns and alerts will send from your business number.' },
                    ].map(({ step, icon, title, desc }) => (
                      <li key={step} className="flex gap-4 items-start" id={`qr-step-${step}`}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">
                          {step}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{icon} {title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Info Box */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-2" id="qr-info-box">
                  <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Why use QR linking?</p>
                  <ul className="text-[11px] text-indigo-800 space-y-1 leading-relaxed">
                    <li>• Messages come from your real, trusted business phone number</li>
                    <li>• Guests recognise your number — higher open rates</li>
                    <li>• No technical Meta developer account setup required</li>
                    <li>• Works with any existing WhatsApp Business account</li>
                  </ul>
                </div>

                {/* Technical note */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4" id="qr-tech-note">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Developer Note</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Full QR session bridging requires a Node.js server running <code className="font-mono bg-amber-100 px-1 rounded">whatsapp-web.js</code> (Baileys library). 
                    This UI is fully wired and ready — contact support to activate the live session server for your subscription plan.
                  </p>
                </div>
              </div>
            </div>
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
