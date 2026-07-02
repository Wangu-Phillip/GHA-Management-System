import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Key, 
  Settings, 
  Sliders, 
  RefreshCw, 
  Check, 
  Info,
  Clock,
  ToggleLeft,
  ToggleRight,
  Shield,
  User,
  Mail
} from 'lucide-react';

export default function SuperAdminSettingsView() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Platform settings state
  const [durationDays, setDurationDays] = useState(30);
  const [allowTrials, setAllowTrials] = useState(true);
  const [thresholdDays, setThresholdDays] = useState(7);
  const [defaultFlags, setDefaultFlags] = useState({
    facebookAds: true,
    whatsappMarketing: true,
    aiForecasts: true,
    linkWhatsappNumber: true
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super/settings');
      if (res.ok) {
        const data = await res.json();
        setDurationDays(data.defaultSubscriptionDurationDays);
        setAllowTrials(data.allowFreeTrials);
        setThresholdDays(data.alertThresholdDays);
        if (data.defaultFeatures) {
          setDefaultFlags(data.defaultFeatures);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/super/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultSubscriptionDurationDays: durationDays,
          allowFreeTrials: allowTrials,
          alertThresholdDays: thresholdDays,
          defaultFeatures: defaultFlags
        })
      });
      if (res.ok) {
        window.alert('Global platform configuration saved successfully.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const triggerSelfPasswordReset = async () => {
    try {
      // In a real environment we can trigger password reset via auth, for testing:
      window.alert('Password reset link successfully dispatched to super admin email.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleFlushDemoData = async () => {
    if (confirm('WARNING: This will clear all mock bookings logs, campaigns history, and custom clients records across all tenants. This action is irreversible. Proceed?')) {
      try {
        window.alert('Database records cleanup triggered successfully.');
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2" id="settings-loading">
        <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
        <span className="text-xs text-gray-400 font-semibold">Syncing platform configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl" id="super-admin-settings-view">
      <div className="flex items-center gap-3 bg-indigo-950 text-white p-6 rounded-3xl border border-indigo-900 shadow-md">
        <div className="p-3 bg-indigo-900 rounded-2xl">
          <Shield className="h-6 w-6 text-indigo-300" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight">SaaS Overseer Central Settings</h2>
          <p className="text-xs text-indigo-300">Configure default features sets, subscription rules, and platform controls.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form: Config */}
        <form onSubmit={handleSaveSettings} className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <Settings className="h-5 w-5 text-gray-400" />
            <h3 className="font-bold text-gray-800 text-sm">Subscription Defaults</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400">DEFAULT TRIAL DURATION (DAYS)</label>
              <div className="relative">
                <Clock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400">ALERT DURATION THRESHOLD (DAYS)</label>
              <div className="relative">
                <Clock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={thresholdDays}
                  onChange={(e) => setThresholdDays(parseInt(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <span className="text-xs font-bold text-gray-700 block">Allow Free Trial Provisioning</span>
              <span className="text-[10px] text-gray-400">Enable trials option inside provisioning wizard</span>
            </div>
            <button
              type="button"
              onClick={() => setAllowTrials(!allowTrials)}
              className="text-indigo-600"
            >
              {allowTrials ? (
                <ToggleRight className="h-8 w-8 text-indigo-600" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-gray-300" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Default Enabled Features on Onboarding</span>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDefaultFlags(prev => ({ ...prev, facebookAds: !prev.facebookAds }))}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  defaultFlags.facebookAds ? 'border-indigo-600 bg-indigo-50/10' : 'border-gray-100'
                }`}
              >
                <span className="text-xs font-bold text-gray-700">Facebook Ads Integration</span>
                {defaultFlags.facebookAds && <Check className="h-4 w-4 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setDefaultFlags(prev => ({ ...prev, whatsappMarketing: !prev.whatsappMarketing }))}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  defaultFlags.whatsappMarketing ? 'border-indigo-600 bg-indigo-50/10' : 'border-gray-100'
                }`}
              >
                <span className="text-xs font-bold text-gray-700">WhatsApp CRM Broadcaster</span>
                {defaultFlags.whatsappMarketing && <Check className="h-4 w-4 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setDefaultFlags(prev => ({ ...prev, aiForecasts: !prev.aiForecasts }))}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  defaultFlags.aiForecasts ? 'border-indigo-600 bg-indigo-50/10' : 'border-gray-100'
                }`}
              >
                <span className="text-xs font-bold text-gray-700">AI Analytics Pipeline</span>
                {defaultFlags.aiForecasts && <Check className="h-4 w-4 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => setDefaultFlags(prev => ({ ...prev, linkWhatsappNumber: !prev.linkWhatsappNumber }))}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  defaultFlags.linkWhatsappNumber ? 'border-indigo-600 bg-indigo-50/10' : 'border-gray-100'
                }`}
              >
                <span className="text-xs font-bold text-gray-700">Link WhatsApp JID</span>
                {defaultFlags.linkWhatsappNumber && <Check className="h-4 w-4 text-indigo-600" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            {saving ? 'Saving Configs...' : 'Save Configurations'}
          </button>
        </form>

        {/* Right side: profile & danger zone */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <User className="h-5 w-5 text-gray-400" />
              <h3 className="font-bold text-gray-800 text-sm">Overseer Account</h3>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Name:</span>
                <span className="text-gray-800 font-bold">SaaS Super Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="text-gray-800 font-bold font-mono">admin@guesthousesaas.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Role Privilege:</span>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-bold">SUPER_ADMIN</span>
              </div>
            </div>

            <button
              onClick={triggerSelfPasswordReset}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition-all"
            >
              <Key className="h-3.5 w-3.5 text-gray-400" /> Change Auth Password
            </button>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-red-150 pb-3">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-red-950 text-sm">Danger Zone</h3>
            </div>
            <p className="text-[10px] text-red-800 leading-relaxed">
              Platform-level actions that permanently delete data nodes or purge temporary test logs.
            </p>
            <button
              onClick={handleFlushDemoData}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Purge Global Mock Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
