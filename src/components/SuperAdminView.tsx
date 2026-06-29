import React, { useState, useEffect } from 'react';
import { Guesthouse } from '../types';
import { Shield, PlusCircle, RefreshCw, Trash2, Calendar, DollarSign, Users, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface SuperAdminProps {
  onRefreshGlobalStats: () => Promise<void>;
  onSwitchTenant: (tenantId: string) => void;
}

export interface GlobalStats {
  totalGuesthouses: number;
  activeSubscriptions: number;
  totalGlobalRevenue: number;
  totalUsersCount: number;
  totalBookingsCount: number;
}

export default function SuperAdminView({ onRefreshGlobalStats, onSwitchTenant }: SuperAdminProps) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGhName, setNewGhName] = useState('');
  const [newGhSub, setNewGhSub] = useState('ACTIVE');
  const [subEnds, setSubEnds] = useState('');

  const fetchGlobalStats = async () => {
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
    fetchGlobalStats();
  }, []);

  const handleCreateGuesthouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGhName) return;

    try {
      const response = await fetch('/api/super/guesthouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGhName,
          subscriptionStatus: newGhSub,
          subscriptionEndsAt: subEnds ? new Date(subEnds).toISOString() : undefined,
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewGhName('');
        setNewGhSub('ACTIVE');
        setSubEnds('');
        await fetchGlobalStats();
        await onRefreshGlobalStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Guesthouse>) => {
    try {
      const response = await fetch(`/api/super/guesthouses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        await fetchGlobalStats();
        await onRefreshGlobalStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGuesthouse = async (id: string) => {
    if (!confirm('Are you sure you want to suspend and delete this guesthouse tenant from the network?')) return;
    try {
      const response = await fetch(`/api/super/guesthouses/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchGlobalStats();
        await onRefreshGlobalStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2" id="super-loading">
        <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
        <span className="text-xs text-gray-400 font-semibold">Loading SaaS networks ledger...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="super-admin-view">
      {/* Network stats scorecard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="super-kpis">
          <div className="bg-indigo-950 text-white p-5 rounded-2xl border border-indigo-900 shadow-sm" id="super-kpi-global-revenue">
            <span className="text-[10px] text-indigo-300 font-bold block uppercase tracking-wider">Global SaaS Revenue Pool</span>
            <span className="text-2xl font-black mt-1 block">P{stats.totalGlobalRevenue.toLocaleString()}</span>
            <span className="text-[10px] text-indigo-400 block mt-1">Aggregated platform transactional value</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="super-kpi-total-gh">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total Active Guesthouses</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{stats.totalGuesthouses}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Active platform tenants</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="super-kpi-subs">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider font-sans">Active Subscriptions</span>
            <span className="text-2xl font-black text-teal-600 mt-1 block">{stats.activeSubscriptions}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Paying SaaS nodes</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="super-kpi-bookings">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Platform Bookings Total</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{stats.totalBookingsCount}</span>
            <span className="text-[10px] text-gray-400 block mt-1">Cross-tenant reservations logs</span>
          </div>
        </div>
      )}

      {/* Network management ledger and creation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="super-tenants-panel">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="super-tenants-header">
          <div id="tenants-title-block">
            <h4 className="font-semibold text-gray-900 text-xs">Platform Guesthouses Registry</h4>
            <p className="text-[10px] text-gray-400">Authorize, monitor, assist, or suspend tenants seamlessly.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-center"
            id="super-add-gh-btn"
          >
            <PlusCircle className="h-4 w-4" />
            Provision Guesthouse Node
          </button>
        </div>

        {/* List of guesthouses */}
        <div className="overflow-x-auto" id="super-table-wrapper">
          <table className="w-full text-left text-xs border-collapse" id="super-table">
            <thead>
              <tr className="bg-gray-100/50 text-[10px] font-bold text-gray-500 border-b border-gray-100 uppercase">
                <th className="p-3">Guesthouse Tenant</th>
                <th className="p-3">Meta Phone ID Status</th>
                <th className="p-3">Status</th>
                <th className="p-3">Subscription Ends</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50" id="super-table-body">
              {guesthouses.map((gh) => (
                <tr key={gh.id} className="hover:bg-gray-50/25" id={`gh-node-${gh.id}`}>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800 block text-sm">{gh.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">TENANT_ID: {gh.id}</span>
                  </td>
                  <td className="p-3">
                    {gh.whatsappPhoneId ? (
                      <span className="text-teal-600 font-mono font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Connected ({gh.whatsappPhoneId})
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Pending Settings Setup
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      value={gh.subscriptionStatus}
                      onChange={(e) => updateSubscription(gh.id, { subscriptionStatus: e.target.value })}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border-0 focus:ring-1 focus:ring-gray-900 ${
                        gh.subscriptionStatus === 'ACTIVE' ? 'bg-teal-50 text-teal-700 font-bold' :
                        gh.subscriptionStatus === 'TRIAL' ? 'bg-indigo-50 text-indigo-700 font-bold' :
                        gh.subscriptionStatus === 'PAST_DUE' ? 'bg-amber-50 text-amber-700 font-bold' :
                        'bg-red-50 text-red-700 font-bold'
                      }`}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="TRIAL">TRIAL</option>
                      <option value="PAST_DUE">PAST_DUE</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-3 text-gray-500 font-medium font-mono">
                    {gh.subscriptionEndsAt ? (
                      new Date(gh.subscriptionEndsAt).toLocaleDateString()
                    ) : (
                      'Lifetime License'
                    )}
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <button
                      onClick={() => onSwitchTenant(gh.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1"
                      title="Simulate / Assist Guesthouse"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Assist Tenant
                    </button>
                    <button
                      onClick={() => deleteGuesthouse(gh.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="De-provision Tenant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provisioning Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="provision-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl space-y-6" id="provision-modal-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="provision-modal-header">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2" id="provision-modal-title">
                <Shield className="h-5 w-5 text-indigo-600" />
                Provision Guesthouse Tenant
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateGuesthouse} className="space-y-4" id="provision-form">
              <div className="space-y-1" id="field-prov-name">
                <label className="text-xs font-bold text-gray-500">GUESTHOUSE BRAND NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whispering Pines Villa"
                  value={newGhName}
                  onChange={(e) => setNewGhName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3" id="form-grid-prov">
                <div className="space-y-1" id="field-prov-sub">
                  <label className="text-xs font-bold text-gray-500">INITIAL TIER</label>
                  <select
                    value={newGhSub}
                    onChange={(e) => setNewGhSub(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="TRIAL">TRIAL</option>
                    <option value="PAST_DUE">PAST_DUE</option>
                  </select>
                </div>

                <div className="space-y-1" id="field-prov-date">
                  <label className="text-xs font-bold text-gray-500">EXPIRY DATE</label>
                  <input
                    type="date"
                    value={subEnds}
                    onChange={(e) => setSubEnds(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100" id="provision-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                >
                  Provision Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
