import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PlusCircle, 
  RefreshCw, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  UserPlus, 
  Key, 
  History, 
  ToggleLeft, 
  ToggleRight, 
  Layout, 
  FileText, 
  Check, 
  Lock, 
  Unlock, 
  Pause, 
  Sliders, 
  ChevronRight, 
  Building,
  Mail,
  User,
  Settings
} from 'lucide-react';
import { Guesthouse, User as UserType, SubscriptionHistoryEntry } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface SuperAdminProps {
  onRefreshGlobalStats: () => Promise<void>;
  onSwitchTenant: (tenantId: string) => void;
}

export default function SuperAdminView({ onRefreshGlobalStats, onSwitchTenant }: SuperAdminProps) {
  const [loading, setLoading] = useState(true);
  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Guesthouse | null>(null);
  
  // Drawer/Modal views
  const [activeDrawerTab, setActiveDrawerTab] = useState<'info' | 'admins' | 'subscription' | 'features'>('info');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Global KPIs
  const [stats, setStats] = useState<{
    totalGuesthouses: number;
    activeSubscriptions: number;
    totalGlobalRevenue: number;
    totalUsersCount: number;
    totalBookingsCount: number;
  } | null>(null);

  // Wizard state
  const [wizardName, setWizardName] = useState('');
  const [wizardLogo, setWizardLogo] = useState('');
  const [wizardSubStatus, setWizardSubStatus] = useState('ACTIVE');
  const [wizardSubEnds, setWizardSubEnds] = useState('');
  const [wizardFeatures, setWizardFeatures] = useState({
    facebookAds: true,
    whatsappMarketing: true,
    aiForecasts: true,
    linkWhatsappNumber: true
  });
  const [wizardAdminName, setWizardAdminName] = useState('');
  const [wizardAdminEmail, setWizardAdminEmail] = useState('');
  const [wizardAdminPassword, setWizardAdminPassword] = useState('');
  const [provisioning, setProvisioning] = useState(false);

  // Detail drawer states
  const [tenantAdmins, setTenantAdmins] = useState<UserType[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [subHistory, setSubHistory] = useState<SubscriptionHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // New admin form state
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'TENANT_ADMIN' | 'TENANT_SALES'>('TENANT_ADMIN');

  // Edit tenant states
  const [editName, setEditName] = useState('');
  const [editLogo, setEditLogo] = useState('');

  // Confirmation Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Reset Link Modal state
  const [resetLinkModal, setResetLinkModal] = useState<{
    open: boolean;
    email: string;
    link: string;
  }>({ open: false, email: '', link: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/super/stats');
      const ghRes = await fetch('/api/super/guesthouses');
      if (statsRes.ok && ghRes.ok) {
        setStats(await statsRes.json());
        setGuesthouses(await ghRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadTenantAdmins = async (tenantId: string) => {
    setLoadingAdmins(true);
    try {
      const res = await fetch(`/api/super/guesthouses/${tenantId}/admins`);
      if (res.ok) {
        setTenantAdmins(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const loadSubscriptionHistory = async (tenantId: string) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/super/guesthouses/${tenantId}/subscription-history`);
      if (res.ok) {
        setSubHistory(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenDrawer = (tenant: Guesthouse) => {
    setSelectedTenant(tenant);
    setEditName(tenant.name);
    setEditLogo(tenant.logoUrl || '');
    setActiveDrawerTab('info');
    loadTenantAdmins(tenant.id);
    loadSubscriptionHistory(tenant.id);
  };

  const handleUpdateTenantDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, logoUrl: editLogo })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTenant(prev => prev ? { ...prev, name: updated.name, logoUrl: updated.logoUrl } : null);
        window.alert('Tenant profile updated successfully');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeature = async (featureKey: keyof typeof wizardFeatures) => {
    if (!selectedTenant) return;
    const updatedFlags = {
      ...selectedTenant.featureFlags,
      [featureKey]: !selectedTenant.featureFlags[featureKey]
    };
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureFlags: updatedFlags })
      });
      if (res.ok) {
        const data = await res.json() as any;
        // Use featureFlags from server response (already parsed as object)
        const serverFlags = data.featureFlags && typeof data.featureFlags === 'object'
          ? data.featureFlags
          : updatedFlags;
        setSelectedTenant(prev => prev ? { ...prev, featureFlags: serverFlags } : null);
        await fetchData();
        onRefreshGlobalStats?.();
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleUpdateSubscriptionStatus = async (status: string) => {
    if (!selectedTenant) return;
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionStatus: status,
          historyNotes: `Tier status set to ${status}`
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTenant(prev => prev ? { ...prev, subscriptionStatus: updated.subscriptionStatus } : null);
        loadSubscriptionHistory(selectedTenant.id);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlock = async () => {
    if (!selectedTenant) return;
    const targetBlocked = !selectedTenant.isBlocked;
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isBlocked: targetBlocked,
          historyNotes: targetBlocked ? 'Tenant blocked by Overseer' : 'Tenant unblocked by Overseer'
        })
      });
      if (res.ok) {
        setSelectedTenant(prev => prev ? { ...prev, isBlocked: targetBlocked } : null);
        loadSubscriptionHistory(selectedTenant.id);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePause = async () => {
    if (!selectedTenant) return;
    const targetPaused = !selectedTenant.isPaused;
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isPaused: targetPaused,
          historyNotes: targetPaused ? 'Tenant subscription paused' : 'Tenant subscription resumed'
        })
      });
      if (res.ok) {
        setSelectedTenant(prev => prev ? { ...prev, isPaused: targetPaused } : null);
        loadSubscriptionHistory(selectedTenant.id);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEndsAt = async (dateStr: string) => {
    if (!selectedTenant) return;
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionEndsAt: dateStr ? new Date(dateStr).toISOString() : null,
          historyNotes: `Subscription ends date modified to ${dateStr || 'Lifetime'}`
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTenant(prev => prev ? { ...prev, subscriptionEndsAt: updated.subscriptionEndsAt } : null);
        loadSubscriptionHistory(selectedTenant.id);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin user management inside detail drawer
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    try {
      const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPassword,
          role: newAdminRole
        })
      });
      if (res.ok) {
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
        setNewAdminRole('TENANT_ADMIN');
        loadTenantAdmins(selectedTenant.id);
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAdmin = (adminId: string, name: string) => {
    if (!selectedTenant) return;
    setConfirmConfig({
      isOpen: true,
      title: 'Remove User Account',
      message: `Are you sure you want to permanently delete user account "${name}"? This action will sync with Firebase Auth.`,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`/api/super/guesthouses/${selectedTenant.id}/admins/${adminId}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            loadTenantAdmins(selectedTenant.id);
            await fetchData();
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const handleResetPassword = async (adminId: string) => {
    try {
      const res = await fetch(`/api/super/users/${adminId}/reset-password`, {
        method: 'POST'
      });
      const data = await res.json() as any;
      if (res.ok) {
        if (data.resetLink) {
          setResetLinkModal({ open: true, email: data.email || '', link: data.resetLink });
        } else {
          alert(data.message || 'Password reset email sent successfully.');
        }
      } else {
        alert(`Error: ${data.error || 'Failed to generate reset link. Please try again.'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Network error: Could not connect to the server.');
    }
  };

  // Onboarding Wizard submission
  const handleProvisionTenant = async () => {
    setProvisioning(true);
    try {
      // 1. Create Guesthouse
      const ghRes = await fetch('/api/super/guesthouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wizardName,
          subscriptionStatus: wizardSubStatus,
          subscriptionEndsAt: wizardSubEnds ? new Date(wizardSubEnds).toISOString() : undefined,
          featureFlags: wizardFeatures
        })
      });

      if (!ghRes.ok) {
        const err = await ghRes.json();
        window.alert(`Failed to create guesthouse: ${err.error}`);
        setProvisioning(false);
        return;
      }

      const newGh = await ghRes.json();

      // 2. Create tenant admin
      const adminRes = await fetch(`/api/super/guesthouses/${newGh.id}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wizardAdminName,
          email: wizardAdminEmail,
          password: wizardAdminPassword,
          role: 'TENANT_ADMIN'
        })
      });

      if (adminRes.ok) {
        window.alert('Tenant guesthouse node successfully provisioned with tenant admin credentials!');
        // Reset states
        setWizardName('');
        setWizardLogo('');
        setWizardSubStatus('ACTIVE');
        setWizardSubEnds('');
        setWizardFeatures({
          facebookAds: true,
          whatsappMarketing: true,
          aiForecasts: true,
          linkWhatsappNumber: true
        });
        setWizardAdminName('');
        setWizardAdminEmail('');
        setWizardAdminPassword('');
        setShowWizard(false);
        setWizardStep(1);
        await fetchData();
        await onRefreshGlobalStats();
      } else {
        const err = await adminRes.json();
        window.alert(`Guesthouse created, but failed to provision admin: ${err.error}. You can add the admin manually from registry.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProvisioning(false);
    }
  };

  const deleteGuesthouse = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'De-provision Tenant Guesthouse',
      message: `Warning: This will suspend and completely delete "${name}". This removes all metadata, local SQLite bookings logs, campaigns history, and custom client records.`,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`/api/super/guesthouses/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            setSelectedTenant(null);
            await fetchData();
            await onRefreshGlobalStats();
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2" id="super-loading">
        <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
        <span className="text-xs text-gray-400 font-semibold">Syncing platform ledger metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-12" id="super-admin-view">

      {/* Reset Link Modal */}
      {resetLinkModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-950/60 rounded-xl text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Password Reset Link Generated</h3>
                {resetLinkModal.email && <p className="text-gray-400 text-xs mt-0.5">For: {resetLinkModal.email}</p>}
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">Copy this link and share it securely with the user. It is single-use and expires after 1 hour.</p>
            <div className="bg-gray-950 border border-gray-700 rounded-xl p-3 mb-4">
              <p className="text-amber-400 text-[10px] font-mono break-all select-all">{resetLinkModal.link}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(resetLinkModal.link); }}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
              >Copy Link</button>
              <button
                onClick={() => setResetLinkModal({ open: false, email: '', link: '' })}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl transition-colors"
              >Close</button>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="super-kpis">
          <div className="bg-indigo-950 text-white p-5 rounded-2xl border border-indigo-900 shadow-sm flex flex-col justify-between" id="kpi-pool">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Global Revenue Pool</span>
            <span className="text-2xl font-black mt-2 block">P{stats.totalGlobalRevenue.toLocaleString()}</span>
            <span className="text-[10px] text-indigo-400 block mt-1">Aggregated platform transactions value</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between" id="kpi-tenants">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Guesthouses</span>
            <span className="text-2xl font-black text-gray-900 mt-2 block">{stats.totalGuesthouses}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Total provisioned nodes</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between" id="kpi-subs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Active Licenses</span>
            <span className="text-2xl font-black text-emerald-600 mt-2 block">{stats.activeSubscriptions}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Active, non-suspended tenants</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between" id="kpi-bookings">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Global Bookings</span>
            <span className="text-2xl font-black text-gray-900 mt-2 block">{stats.totalBookingsCount}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Cross-tenant reservations logs</span>
          </div>
        </div>
      )}

      {/* Main Ledger panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="super-tenants-panel">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="super-tenants-header">
          <div>
            <h4 className="font-semibold text-gray-900 text-xs">Provisioned Tenants Registry</h4>
            <p className="text-[10px] text-gray-400">Manage lifecycle status, toggle premium plugins, and assist admins.</p>
          </div>

          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.01]"
            id="super-add-gh-btn"
          >
            <PlusCircle className="h-4 w-4" />
            Provision Guesthouse Wizard
          </button>
        </div>

        {/* Table Ledger */}
        <div className="overflow-x-auto" id="super-table-wrapper">
          <table className="w-full text-left text-xs border-collapse" id="super-table">
            <thead>
              <tr className="bg-gray-100/50 text-[10px] font-bold text-gray-500 border-b border-gray-100 uppercase">
                <th className="p-3">Guesthouse Brand</th>
                <th className="p-3">Status</th>
                <th className="p-3">Plugin Modules</th>
                <th className="p-3">Expiration Date</th>
                <th className="p-3">Accounts</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50" id="super-table-body">
              {guesthouses.map((gh) => (
                <tr key={gh.id} className="hover:bg-gray-50/25 transition-colors" id={`gh-node-${gh.id}`}>
                  <td className="p-3">
                    <span className="font-bold text-gray-800 block text-sm">{gh.name}</span>
                    <span className="text-[9px] text-gray-400 font-mono">ID: {gh.id}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        gh.subscriptionStatus === 'ACTIVE' ? 'bg-teal-50 text-teal-700' :
                        gh.subscriptionStatus === 'TRIAL' ? 'bg-indigo-50 text-indigo-700' :
                        gh.subscriptionStatus === 'PAST_DUE' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {gh.subscriptionStatus}
                      </span>
                      {gh.isBlocked && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-950 text-red-200 flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5" /> BLOCKED
                        </span>
                      )}
                      {gh.isPaused && !gh.isBlocked && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-800 text-gray-200 flex items-center gap-1">
                          <Pause className="h-2.5 w-2.5" /> PAUSED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {gh.featureFlags?.facebookAds && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-medium">Facebook Ads</span>
                      )}
                      {gh.featureFlags?.whatsappMarketing && (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[9px] font-medium">WhatsApp Promo</span>
                      )}
                      {gh.featureFlags?.aiForecasts && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-medium">AI Insights</span>
                      )}
                      {gh.featureFlags?.linkWhatsappNumber && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded text-[9px] font-medium">Link Phone JID</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-gray-500 font-medium font-mono">
                    {gh.subscriptionEndsAt ? new Date(gh.subscriptionEndsAt).toLocaleDateString() : 'Lifetime License'}
                  </td>
                  <td className="p-3 text-gray-600 font-medium">
                    {gh.adminCount} Active
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDrawer(gh)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold transition-all"
                    >
                      <Sliders className="h-3 w-3" /> Manage Node
                    </button>
                    <button
                      onClick={() => onSwitchTenant(gh.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold transition-all"
                    >
                      <Play className="h-3 w-3" /> Assist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Detail Drawer */}
      {selectedTenant && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-160 bg-white shadow-2xl border-l border-gray-150 z-50 flex flex-col animate-slide-in">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Tenant Settings Drawer</span>
              <h3 className="text-base font-black text-gray-900">{selectedTenant.name}</h3>
            </div>
            <button 
              onClick={() => setSelectedTenant(null)}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
            >
              ✕ Close
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-100 text-xs font-bold text-gray-500 bg-white">
            <button 
              onClick={() => setActiveDrawerTab('info')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeDrawerTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-gray-800'
              }`}
            >
              <Building className="h-3.5 w-3.5 inline mr-1" /> Profile Info
            </button>
            <button 
              onClick={() => setActiveDrawerTab('admins')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeDrawerTab === 'admins' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-gray-800'
              }`}
            >
              <Users className="h-3.5 w-3.5 inline mr-1" /> Admins & Roles
            </button>
            <button 
              onClick={() => setActiveDrawerTab('subscription')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeDrawerTab === 'subscription' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-gray-800'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 inline mr-1" /> Subscription
            </button>
            <button 
              onClick={() => setActiveDrawerTab('features')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeDrawerTab === 'features' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-gray-800'
              }`}
            >
              <Sliders className="h-3.5 w-3.5 inline mr-1" /> Feature Flags
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {activeDrawerTab === 'info' && (
              <form onSubmit={handleUpdateTenantDetails} className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Modify Tenant Identity</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400">GUESTHOUSE BRAND NAME</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400">LOGO BRAND URL (IMAGE LINK)</label>
                  <input
                    type="text"
                    value={editLogo}
                    onChange={(e) => setEditLogo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save Profile Details
                </button>
              </form>
            )}

            {activeDrawerTab === 'admins' && (
              <div className="space-y-6">
                {/* List Admins */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Active Workspace Users</h4>
                  {loadingAdmins ? (
                    <div className="text-center py-4 text-xs text-gray-400">Syncing user lists...</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {tenantAdmins.map((adm) => (
                        <div key={adm.id} className="py-3 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-800 text-xs block">{adm.name}</span>
                            <span className="text-[10px] text-gray-400 block">{adm.email}</span>
                            <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 text-gray-600 text-[8px] font-bold rounded uppercase mt-0.5 inline-block">{adm.role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleResetPassword(adm.id)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[9px] font-bold rounded-lg transition-colors flex items-center gap-1"
                              title="Sync password reset link"
                            >
                              <Key className="h-3 w-3" /> Reset Pass
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {tenantAdmins.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400">No admins linked to this workspace node. Add one below.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Add Admin Form */}
                <form onSubmit={handleAddAdmin} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Provision Admin Account</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">FULL NAME</label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="e.g. Eric M."
                        className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">ROLE TIER</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white"
                      >
                        <option value="TENANT_ADMIN">TENANT_ADMIN (Full Edit)</option>
                        <option value="TENANT_SALES">TENANT_SALES (Booking logs only)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="e.g. eric@gmail.com"
                      className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">INITIAL PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  >
                    Add User Node
                  </button>
                </form>
              </div>
            )}

            {activeDrawerTab === 'subscription' && (
              <div className="space-y-6">
                {/* Subscription Action Panel */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Subscription Actions</h4>
                  
                  {/* Status Badge + Change */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">CURRENT LICENSE TIER</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-block mt-1 ${
                        selectedTenant.subscriptionStatus === 'ACTIVE' ? 'bg-teal-50 text-teal-700' :
                        selectedTenant.subscriptionStatus === 'TRIAL' ? 'bg-indigo-50 text-indigo-700' :
                        selectedTenant.subscriptionStatus === 'PAST_DUE' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {selectedTenant.subscriptionStatus}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block">SET NEW TIER</label>
                      <select
                        value={selectedTenant.subscriptionStatus}
                        onChange={(e) => handleUpdateSubscriptionStatus(e.target.value)}
                        className="px-2.5 py-1 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="TRIAL">TRIAL</option>
                        <option value="PAST_DUE">PAST_DUE</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Expiration date picker */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">EXPIRATION DATE</span>
                      <span className="text-xs font-mono text-gray-600 block mt-1">
                        {selectedTenant.subscriptionEndsAt ? new Date(selectedTenant.subscriptionEndsAt).toLocaleDateString() : 'Lifetime License'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block">MODIFY DATE</label>
                      <input
                        type="date"
                        value={selectedTenant.subscriptionEndsAt ? selectedTenant.subscriptionEndsAt.substring(0, 10) : ''}
                        onChange={(e) => handleEndsAtChanged(e.target.value)}
                        className="px-2 py-1 border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Lockout Restriction Toggles */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-gray-400 block font-bold">EMERGENCY ACCESS CONTROLS</span>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">Block Tenant Portal</span>
                        <span className="text-[10px] text-gray-400 block">Block all workspace logins & workflows</span>
                      </div>
                      <button
                        onClick={handleToggleBlock}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          selectedTenant.isBlocked 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {selectedTenant.isBlocked ? (
                          <>
                            <Lock className="h-3.5 w-3.5" /> Blocked
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5 text-gray-400" /> Active
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">Pause Subscription</span>
                        <span className="text-[10px] text-gray-400 block">Temporarily stop automated workflows</span>
                      </div>
                      <button
                        onClick={handleTogglePause}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          selectedTenant.isPaused 
                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {selectedTenant.isPaused ? (
                          <>
                            <Pause className="h-3.5 w-3.5" /> Paused
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 text-gray-400" /> Running
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subscription Audit History */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <History className="h-4 w-4 text-gray-400" /> Subscription Audit Logs
                  </h4>
                  {loadingHistory ? (
                    <div className="text-center py-4 text-xs text-gray-400">Syncing audit records...</div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {subHistory.map((hist) => (
                        <div key={hist.id} className="pl-6 relative">
                          <div className="absolute left-[3px] top-[5px] h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600 shadow-sm" />
                          <div className="text-[11px] font-semibold text-gray-800">
                            Tier Status: {hist.previousStatus} → <span className="text-indigo-600 font-bold">{hist.newStatus}</span>
                          </div>
                          {hist.notes && (
                            <p className="text-[10px] text-gray-400 italic mt-0.5">"{hist.notes}"</p>
                          )}
                          <div className="text-[9px] text-gray-400 mt-0.5 font-mono">
                            By {hist.changedBy} on {new Date(hist.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                      {subHistory.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400 pl-0 before:hidden">No subscription changes logged yet.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeDrawerTab === 'features' && (
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Premium Feature Toggle Panel</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Enable or disable premium modules separately. Disabled plugins will disappear from the workspace portal.
                </p>

                <div className="divide-y divide-gray-100">
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Facebook Ads Integration</span>
                      <span className="text-[10px] text-gray-400">Configure Facebook campaigns & budget suggestions</span>
                    </div>
                    <button onClick={() => handleToggleFeature('facebookAds')} className="text-indigo-600">
                      {selectedTenant.featureFlags?.facebookAds ? (
                        <ToggleRight className="h-7 w-7 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">WhatsApp Promo Campaigns</span>
                      <span className="text-[10px] text-gray-400">Launch marketing broadcasts & review automations</span>
                    </div>
                    <button onClick={() => handleToggleFeature('whatsappMarketing')} className="text-indigo-600">
                      {selectedTenant.featureFlags?.whatsappMarketing ? (
                        <ToggleRight className="h-7 w-7 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">AI Forecast Insights</span>
                      <span className="text-[10px] text-gray-400">Predictive analysis of bookings logs & seasonal adjustments</span>
                    </div>
                    <button onClick={() => handleToggleFeature('aiForecasts')} className="text-indigo-600">
                      {selectedTenant.featureFlags?.aiForecasts ? (
                        <ToggleRight className="h-7 w-7 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Link WhatsApp Phone ID</span>
                      <span className="text-[10px] text-gray-400">Expose raw credentials linkage inside Settings panel</span>
                    </div>
                    <button onClick={() => handleToggleFeature('linkWhatsappNumber')} className="text-indigo-600">
                      {selectedTenant.featureFlags?.linkWhatsappNumber ? (
                        <ToggleRight className="h-7 w-7 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-red-50/50 border-t border-red-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-950 block">De-provision Node</span>
              <span className="text-[9px] text-red-500 block">This will permanently delete the tenant</span>
            </div>
            <button
              onClick={() => deleteGuesthouse(selectedTenant.id, selectedTenant.name)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition-all"
            >
              Destroy Node
            </button>
          </div>
        </div>
      )}

      {/* Provisioning Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="wizard-modal">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col min-h-[480px]" id="wizard-body">
            {/* Header */}
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm">Tenant Provisioning Wizard</h3>
              </div>
              <button 
                onClick={() => setShowWizard(false)}
                className="text-gray-400 hover:text-gray-600 font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex border-b border-gray-50 text-[10px] font-bold text-gray-400">
              <div className={`flex-1 py-3 text-center transition-all ${wizardStep >= 1 ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>1. Tenant Profile</div>
              <div className={`flex-1 py-3 text-center transition-all ${wizardStep >= 2 ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>2. Plugins</div>
              <div className={`flex-1 py-3 text-center transition-all ${wizardStep >= 3 ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>3. Admin User</div>
              <div className={`flex-1 py-3 text-center transition-all ${wizardStep >= 4 ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>4. Launch Node</div>
            </div>

            {/* Wizard Panels */}
            <div className="flex-1 p-6 space-y-4">
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">GUESTHOUSE BRAND NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pinecrest Ridge Resort"
                      value={wizardName}
                      onChange={(e) => setWizardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">LOGO IMAGE LINK (OPTIONAL)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={wizardLogo}
                      onChange={(e) => setWizardLogo(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">SUBSCRIPTION STATUS</label>
                      <select
                        value={wizardSubStatus}
                        onChange={(e) => setWizardSubStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="TRIAL">TRIAL</option>
                        <option value="PAST_DUE">PAST_DUE</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">EXPIRATION DATE</label>
                      <input
                        type="date"
                        value={wizardSubEnds}
                        onChange={(e) => setWizardSubEnds(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Select Premium Plugin Suites</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setWizardFeatures(prev => ({ ...prev, facebookAds: !prev.facebookAds }))}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all flex flex-col justify-between ${
                        wizardFeatures.facebookAds 
                          ? 'border-indigo-600 bg-indigo-50/20' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">Ads Suite</span>
                        {wizardFeatures.facebookAds && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Facebook Ads</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">Campaigns control & budget advisor</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardFeatures(prev => ({ ...prev, whatsappMarketing: !prev.whatsappMarketing }))}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all flex flex-col justify-between ${
                        wizardFeatures.whatsappMarketing 
                          ? 'border-indigo-600 bg-indigo-50/20' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold">CRM Suite</span>
                        {wizardFeatures.whatsappMarketing && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">WhatsApp Promo</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">Templates campaign & customer reviews</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardFeatures(prev => ({ ...prev, aiForecasts: !prev.aiForecasts }))}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all flex flex-col justify-between ${
                        wizardFeatures.aiForecasts 
                          ? 'border-indigo-600 bg-indigo-50/20' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold">AI Analytics</span>
                        {wizardFeatures.aiForecasts && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">AI Booking Models</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">Predictive occupancy rate analyzer</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardFeatures(prev => ({ ...prev, linkWhatsappNumber: !prev.linkWhatsappNumber }))}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all flex flex-col justify-between ${
                        wizardFeatures.linkWhatsappNumber 
                          ? 'border-indigo-600 bg-indigo-50/20' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[9px] font-bold">JID Config</span>
                        {wizardFeatures.linkWhatsappNumber && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">WhatsApp Credentials</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">Allow JID configuration inside portal</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Tenant Primary Admin User</span>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">ADMIN FULL NAME *</label>
                    <div className="relative">
                      <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eric M."
                        value={wizardAdminName}
                        onChange={(e) => setWizardAdminName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">EMAIL ADDRESS *</label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. eric@guesthousename.com"
                        value={wizardAdminEmail}
                        onChange={(e) => setWizardAdminEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">TEMPORARY PASSWORD *</label>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={wizardAdminPassword}
                        onChange={(e) => setWizardAdminPassword(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Review Configuration</span>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Brand Name:</span>
                      <span>{wizardName || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Tier Tier:</span>
                      <span>{wizardSubStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Ends At:</span>
                      <span>{wizardSubEnds || 'Lifetime License'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">First Admin:</span>
                      <span>{wizardAdminName || '—'} ({wizardAdminEmail || '—'})</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-2 border-t border-gray-200/50">
                      <span className="font-bold text-gray-800">Plugins Selected:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {wizardFeatures.facebookAds && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-semibold">Facebook Ads</span>}
                        {wizardFeatures.whatsappMarketing && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-semibold">WhatsApp Promo</span>}
                        {wizardFeatures.aiForecasts && <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-semibold">AI Insights</span>}
                        {wizardFeatures.linkWhatsappNumber && <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[9px] font-semibold">JID credentials</span>}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    By clicking Launch Node, the platform ledger will provision a new SQLite database context, initialize credentials schema mappings, and register the admin account in Firebase Auth.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Previous Step
                </button>
              ) : (
                <div />
              )}

              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWizard(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !wizardName) {
                        window.alert('Guesthouse brand name is required.');
                        return;
                      }
                      if (wizardStep === 3 && (!wizardAdminName || !wizardAdminEmail || !wizardAdminPassword)) {
                        window.alert('First admin details and password are required.');
                        return;
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={provisioning}
                    onClick={handleProvisionTenant}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5"
                  >
                    {provisioning ? 'Launching Node...' : 'Provision and Launch'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );

  // Helper inside Subscription history view for handling dates
  async function handleEndsAtChanged(val: string) {
    if (!selectedTenant) return;
    await handleUpdateEndsAt(val);
  }
}
