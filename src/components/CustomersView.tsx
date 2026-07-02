import React, { useState } from 'react';
import { Customer } from '../types';
import { Search, Plus, UserPlus, CheckCircle, Shield, Phone, Mail, User } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface CustomersProps {
  customers: Customer[];
  guesthouseId: string;
  onRefresh: () => Promise<void>;
}

export default function CustomersView({ customers, guesthouseId, onRefresh }: CustomersProps) {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Custom confirmation modal state
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customerCountry: 'Botswana (local)',
    optInPromo: true,
    gender: '' as any,
    ageGroup: '' as any,
    groupStyle: '' as any
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customerCountry: 'Botswana (local)',
    optInPromo: true,
    gender: '' as any,
    ageGroup: '' as any,
    groupStyle: '' as any
  });

  // Filter customers list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

    let matchesDate = true;
    if (dateFilter !== 'ALL' && c.createdAt) {
      const created = new Date(c.createdAt);
      const now = new Date();
      const diffTime = now.getTime() - created.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (dateFilter === 'TODAY') {
        matchesDate = created.getFullYear() === now.getFullYear() &&
                      created.getMonth() === now.getMonth() &&
                      created.getDate() === now.getDate();
      } else if (dateFilter === 'WEEK') {
        matchesDate = diffDays >= 0 && diffDays <= 7;
      } else if (dateFilter === 'MONTH') {
        matchesDate = diffDays >= 0 && diffDays <= 30;
      } else if (dateFilter === '90DAYS') {
        matchesDate = diffDays >= 0 && diffDays <= 90;
      } else if (dateFilter === 'YEAR') {
        matchesDate = diffDays >= 0 && diffDays <= 365;
      }
    }

    return matchesSearch && matchesDate;
  });

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
        setFormData({ name: '', email: '', phone: '', customerCountry: 'Botswana (local)', optInPromo: true, gender: '', ageGroup: '', groupStyle: '' });
        await onRefresh();
      } else {
        const err = (await response.json()) as any;
        alert(err.error || 'Failed to onboard customer profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      customerCountry: customer.customerCountry || 'Botswana (local)',
      optInPromo: customer.optInPromo,
      gender: customer.gender || '',
      ageGroup: customer.ageGroup || '',
      groupStyle: customer.groupStyle || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!editFormData.name || !editFormData.phone) {
      alert('Name and Phone are required fields');
      return;
    }

    try {
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingCustomer(null);
        await onRefresh();
      } else {
        const err = (await response.json()) as any;
        alert(err.error || 'Failed to update customer profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Customer Profile',
      message: `Are you sure you want to delete ${customer.name}? This will remove their guest records from the registry.`,
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const response = await fetch(`/api/customers/${customer.id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await onRefresh();
          } else {
            const err = (await response.json()) as any;
            alert(err.error || 'Failed to delete customer registry entry');
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
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

        <div className="flex flex-wrap items-center gap-3" id="customers-actions">
          {/* Date range filter selection */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 shadow-sm focus:outline-none bg-white"
            id="customer-date-filter-select"
          >
            <option value="ALL">All Registrations</option>
            <option value="TODAY">Current Day</option>
            <option value="WEEK">Current Week (7d)</option>
            <option value="MONTH">Current Month (30d)</option>
            <option value="90DAYS">Last 90 Days</option>
            <option value="YEAR">Current Year (365d)</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            id="onboard-customer-btn"
          >
            <UserPlus className="h-4 w-4" />
            Add Customer Record
          </button>
        </div>
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
                <th className="p-4">Botswana DPA Opt-In Status</th>
                <th className="p-4 text-center">Marketing Actions Allowed</th>
                <th className="p-4 text-center">Actions</th>
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                          {c.customerCountry && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                              {c.customerCountry}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] text-gray-400 font-mono mr-1">ID: {c.id.substring(0, 13)}</span>
                          {c.gender && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase">{c.gender}</span>
                          )}
                          {c.ageGroup && (
                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-bold uppercase">{c.ageGroup} Yrs</span>
                          )}
                          {c.groupStyle && (
                            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase">{c.groupStyle}</span>
                          )}
                        </div>
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
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[10px] transition-colors"
                        id={`edit-customer-${c.id}`}
                      >
                        Edit / View
                      </button>
                      <button
                        onClick={() => handleDeleteClick(c)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[10px] transition-colors"
                        id={`delete-customer-${c.id}`}
                      >
                        Delete
                      </button>
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
                  placeholder="e.g. +267 71234567"
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

              <div className="space-y-1" id="field-cust-country">
                <label className="text-xs font-bold text-gray-500 block">COUNTRY OF ORIGIN</label>
                <select
                  value={formData.customerCountry}
                  onChange={(e) => setFormData({ ...formData, customerCountry: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white text-gray-700"
                >
                  <option value="Botswana (local)">Botswana (local)</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Zambia">Zambia</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States of America">United States of America</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3" id="field-cust-demographics">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">GENDER</label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-100 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">AGE GROUP</label>
                  <select
                    value={formData.ageGroup || ''}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-100 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    <option value="">Select Age Group</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-50">36-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1" id="field-cust-style">
                <label className="text-[10px] font-bold text-gray-400 block">BOOKING STYLE (GROUP TYPE)</label>
                <select
                  value={formData.groupStyle || ''}
                  onChange={(e) => setFormData({ ...formData, groupStyle: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-100 rounded-xl text-xs bg-white focus:outline-none"
                >
                  <option value="">Select Booking Style</option>
                  <option value="COUPLE">Booking as a couple</option>
                  <option value="SINGLE">Booking as a single person</option>
                  <option value="FAMILY">Booking as a family</option>
                </select>
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
                  WhatsApp Promotional Marketing Opt-In (Botswana DPA Consented)
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

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="edit-customer-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl space-y-6" id="edit-customer-modal-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3" id="edit-customer-modal-header">
              <h3 className="font-bold text-gray-900 text-base" id="edit-customer-modal-title">Update Client Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 font-sans" id="edit-customer-form">
              <div className="space-y-1" id="edit-field-cust-name">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" /> FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Neeson"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="edit-field-cust-phone">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> WHATSAPP MOBILE PHONE *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +267 71234567"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="edit-field-cust-email">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="e.g. liam@taken.com"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="edit-field-cust-country">
                <label className="text-xs font-bold text-gray-500 block">COUNTRY OF ORIGIN</label>
                <select
                  value={editFormData.customerCountry}
                  onChange={(e) => setEditFormData({ ...editFormData, customerCountry: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none bg-white text-gray-700"
                >
                  <option value="Botswana (local)">Botswana (local)</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Zambia">Zambia</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States of America">United States of America</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3" id="edit-field-cust-demographics">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">GENDER</label>
                  <select
                    value={editFormData.gender || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-100 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 block">AGE GROUP</label>
                  <select
                    value={editFormData.ageGroup || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, ageGroup: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-100 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    <option value="">Select Age Group</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-50">36-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1" id="edit-field-cust-style">
                <label className="text-[10px] font-bold text-gray-400 block">BOOKING STYLE (GROUP TYPE)</label>
                <select
                  value={editFormData.groupStyle || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, groupStyle: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-100 rounded-xl text-xs bg-white focus:outline-none"
                >
                  <option value="">Select Booking Style</option>
                  <option value="COUPLE">Booking as a couple</option>
                  <option value="SINGLE">Booking as a single person</option>
                  <option value="FAMILY">Booking as a family</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100" id="edit-field-cust-opt">
                <input
                  type="checkbox"
                  id="editOptInCheck"
                  checked={editFormData.optInPromo}
                  onChange={(e) => setEditFormData({ ...editFormData, optInPromo: e.target.checked })}
                  className="h-4 w-4 accent-gray-900 rounded"
                />
                <label htmlFor="editOptInCheck" className="text-xs text-gray-600 font-medium select-none cursor-pointer">
                  WhatsApp Promotional Marketing Opt-In (Botswana DPA Consented)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100" id="edit-customer-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
