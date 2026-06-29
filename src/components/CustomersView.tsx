import React, { useState } from 'react';
import { Customer } from '../types';
import { Search, Plus, UserPlus, CheckCircle, Shield, Phone, Mail, User } from 'lucide-react';

interface CustomersProps {
  customers: Customer[];
  guesthouseId: string;
  onRefresh: () => Promise<void>;
}

export default function CustomersView({ customers, guesthouseId, onRefresh }: CustomersProps) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    optInPromo: true
  });

  // Filter customers list
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Submit manual Customer onboarding
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Name and Phone are required fields');
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          ...formData
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', optInPromo: true });
        await onRefresh();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to onboard customer profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle GDPR consent
  const togglePromoOptIn = async (customer: Customer) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optInPromo: !customer.optInPromo
        })
      });

      if (response.ok) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" id="customers-view">
      {/* Header tool bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="customers-header">
        <div className="relative flex-1 max-w-md" id="search-container">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customer by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm"
            id="customer-search-input"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          id="onboard-customer-btn"
        >
          <UserPlus className="h-4 w-4" />
          Add Customer Record
        </button>
      </div>

      {/* Customer profiles grid list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="customer-table-panel">
        <div className="overflow-x-auto" id="customer-table-wrapper">
          <table className="w-full text-left border-collapse" id="customers-table">
            <thead>
              <tr className="bg-gray-50/75 text-xs font-bold text-gray-500 border-b border-gray-100">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">GDPR Opt-In Status</th>
                <th className="p-4 text-center">Marketing Actions Allowed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs" id="customers-table-body">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors" id={`customer-row-${c.id}`}>
                    <td className="p-4 flex items-center gap-3">
                      <div className="p-2 bg-gray-100 text-gray-600 rounded-lg shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block text-sm">{c.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {c.id.substring(0, 13)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium text-gray-700">{c.phone}</td>
                    <td className="p-4 text-gray-500 font-mono">{c.email || '—'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePromoOptIn(c)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-[10px] ${
                          c.optInPromo
                            ? 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                        }`}
                        id={`opt-in-toggle-${c.id}`}
                      >
                        <Shield className="h-3.5 w-3.5" />
                        {c.optInPromo ? 'Consented (WhatsApp OK)' : 'Opted-Out (Do Not Blast)'}
                      </button>
                    </td>
                    <td className="p-4 text-center font-medium text-gray-500">
                      {c.optInPromo ? (
                        <span className="text-green-600 font-bold">Eligible for Campaigns</span>
                      ) : (
                        <span className="text-red-500 font-bold">Blocked (Compliance)</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <User className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No customers found</p>
                    <p className="text-xs text-gray-400 mt-1">Try onboarding customer profiles manually or book guests to auto-populate registries.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Customer Register Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="customer-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl space-y-6" id="customer-modal-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="customer-modal-header">
              <h3 className="font-bold text-gray-900 text-base" id="customer-modal-title">Onboard Client Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 font-sans" id="customer-form">
              <div className="space-y-1" id="field-cust-name">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" /> FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Neeson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="field-cust-phone">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> WHATSAPP MOBILE PHONE *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +13105550192"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="field-cust-email">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="e.g. liam@taken.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100" id="field-cust-opt">
                <input
                  type="checkbox"
                  id="optInCheck"
                  checked={formData.optInPromo}
                  onChange={(e) => setFormData({ ...formData, optInPromo: e.target.checked })}
                  className="h-4 w-4 accent-gray-900 rounded"
                />
                <label htmlFor="optInCheck" className="text-xs text-gray-600 font-medium select-none cursor-pointer">
                  WhatsApp Promotional Marketing Opt-In (GDPR Consented)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100" id="customer-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold"
                >
                  Onboard Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
