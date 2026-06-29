import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldAlert, 
  Image as ImageIcon, 
  CreditCard, 
  User, 
  Mail, 
  Key, 
  Lock, 
  Edit2, 
  Check, 
  X, 
  DollarSign, 
  AlertTriangle 
} from 'lucide-react';
import { Guesthouse, User as UserType, Role } from '../types';

interface SettingsViewProps {
  guesthouse: Guesthouse;
  currentUser: UserType;
  onUpdateGuesthouse: (gh: Guesthouse) => void;
  onLogout: () => void;
}

export default function SettingsView({ 
  guesthouse, 
  currentUser, 
  onUpdateGuesthouse, 
  onLogout 
}: SettingsViewProps) {
  // Guesthouse Details State
  const [ghName, setGhName] = useState(guesthouse.name);
  const [ghLogo, setGhLogo] = useState(guesthouse.logoUrl || '');
  const [updatingGh, setUpdatingGh] = useState(false);
  const [ghMessage, setGhMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Employees Management State
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  
  // New Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<Role>('TENANT_SALES');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [creatingEmployee, setCreatingEmployee] = useState(false);
  const [empMessage, setEmpMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Editing Employee State
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpEmail, setEditEmpEmail] = useState('');
  const [editEmpRole, setEditEmpRole] = useState<Role>('TENANT_SALES');

  // Cancel Subscription State
  const [cancellingSubscription, setCancellingSubscription] = useState(false);

  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Load Employees
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await fetch(`/api/employees?guesthouseId=${guesthouse.id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [guesthouse.id]);

  // Update Guesthouse Details
  const handleUpdateGuesthouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ghName.trim()) {
      setGhMessage({ type: 'error', text: 'Guesthouse Name cannot be empty' });
      return;
    }
    setUpdatingGh(true);
    setGhMessage(null);
    try {
      const response = await fetch(`/api/guesthouse/${guesthouse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ghName.trim(),
          logoUrl: ghLogo.trim() || undefined
        })
      });
      if (response.ok) {
        const data = await response.json();
        onUpdateGuesthouse(data.guesthouse);
        setGhMessage({ type: 'success', text: 'Guesthouse details updated successfully!' });
      } else {
        const err = await response.json();
        setGhMessage({ type: 'error', text: err.error || 'Failed to update details' });
      }
    } catch (err) {
      console.error(err);
      setGhMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setUpdatingGh(false);
    }
  };

  // Add Employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim() || !newEmpPassword.trim()) {
      setEmpMessage({ type: 'error', text: 'All employee fields are required' });
      return;
    }
    setCreatingEmployee(true);
    setEmpMessage(null);
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newEmpName.trim(),
          email: newEmpEmail.trim(),
          role: newEmpRole,
          password: newEmpPassword,
          guesthouseId: guesthouse.id
        })
      });

      if (response.ok) {
        setNewEmpName('');
        setNewEmpEmail('');
        setNewEmpPassword('');
        setNewEmpRole('TENANT_SALES');
        setEmpMessage({ type: 'success', text: 'Team member added successfully!' });
        await fetchEmployees();
      } else {
        const err = await response.json();
        setEmpMessage({ type: 'error', text: err.error || 'Failed to add team member' });
      }
    } catch (err) {
      console.error(err);
      setEmpMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setCreatingEmployee(false);
    }
  };

  // Start Editing Employee
  const handleStartEdit = (emp: UserType) => {
    setEditingEmpId(emp.id);
    setEditEmpName(emp.name);
    setEditEmpEmail(emp.email);
    setEditEmpRole(emp.role);
  };

  // Save Employee Changes
  const handleSaveEmployeeEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editEmpName.trim(),
          email: editEmpEmail.trim(),
          role: editEmpRole
        })
      });

      if (response.ok) {
        setEditingEmpId(null);
        await fetchEmployees();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update employee details');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id: string, name: string) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own admin account. Please contact support if you need to transfer ownership.');
      return;
    }
    if (!confirm(`Are you sure you want to remove ${name} from your team?`)) return;
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchEmployees();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to delete team member');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel Subscription
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your Premium Guesthouse Subscription? You will lose access to automated checkout review collection and AI insights once your billing cycle ends.')) {
      return;
    }
    setCancellingSubscription(true);
    try {
      const response = await fetch(`/api/guesthouse/${guesthouse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionStatus: 'CANCELLED'
        })
      });
      if (response.ok) {
        const data = await response.json();
        onUpdateGuesthouse(data.guesthouse);
        alert('Your premium subscription has been cancelled. You will continue to have premium benefits until the end of your cycle.');
      } else {
        alert('Failed to cancel subscription.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingSubscription(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (confirmDeleteName.trim().toLowerCase() !== guesthouse.name.toLowerCase()) {
      alert('Guesthouse name does not match. Please type the exact guesthouse name to authorize account deletion.');
      return;
    }
    setDeletingAccount(true);
    try {
      const response = await fetch(`/api/guesthouse/${guesthouse.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert(`Account for ${guesthouse.name} has been permanently deleted. Logging you out.`);
        setShowDeleteModal(false);
        onLogout();
      } else {
        alert('Failed to delete account.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in font-sans" id="settings-view-root">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5" id="settings-header">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight" id="settings-title">Administration settings</h2>
          <p className="text-xs text-gray-500 mt-1">Manage team permissions, lodging brand information, and subscription settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="settings-grid">
        {/* Left Columns - Form Configurations */}
        <div className="lg:col-span-2 space-y-8" id="settings-left-pane">
          
          {/* Section 1: Guesthouse Details */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="gh-details-card">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Guesthouse Profile</h3>
                <p className="text-[10px] text-gray-500">Public details used on checkout messaging and reports.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateGuesthouse} className="p-6 space-y-4" id="gh-details-form">
              {ghMessage && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold ${
                  ghMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {ghMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5" id="field-gh-name">
                  <label className="text-[10px] font-bold text-gray-400 block uppercase">Guesthouse Name</label>
                  <input
                    type="text"
                    required
                    value={ghName}
                    onChange={(e) => setGhName(e.target.value)}
                    placeholder="e.g. Pinecrest Ridge Guesthouse"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                </div>

                <div className="space-y-1.5" id="field-gh-logo">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 block uppercase">Brand Logo URL</label>
                    <span className="text-[9px] font-bold text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => setGhLogo('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=200&fit=crop&q=80')}>
                      Use Default
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      value={ghLogo}
                      onChange={(e) => setGhLogo(e.target.value)}
                      placeholder="e.g. https://domain.com/logo.png"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    />
                    <ImageIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Logo Preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100/50" id="logo-preview-box">
                <div className="h-16 w-16 bg-white border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  {ghLogo ? (
                    <img src={ghLogo} alt="Logo" className="object-cover h-full w-full" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  ) : (
                    <Building className="h-6 w-6 text-gray-300" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-gray-800 block">Brand Identity Preview</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">This logo or name will represent your brand on all compiled PDF/CSV reports and client touchpoints.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingGh}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  id="save-gh-profile-btn"
                >
                  {updatingGh ? 'Saving Details...' : 'Save Guesthouse Details'}
                </button>
              </div>
            </form>
          </section>

          {/* Section 2: Team Members Management */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="team-mgmt-card">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Manage Team Members</h3>
                <p className="text-[10px] text-gray-500">Provide staff, receptionists, or sales agents secure portal access.</p>
              </div>
            </div>

            <div className="p-6 space-y-6" id="team-mgmt-body">
              {/* Add New Team Member Form */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100" id="add-team-block">
                <span className="text-[11px] font-bold text-gray-700 block mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5 text-indigo-600" /> Invite New Staff / Sales Agent
                </span>

                <form onSubmit={handleAddEmployee} className="space-y-4" id="add-employee-form">
                  {empMessage && (
                    <div className={`p-3 rounded-xl text-xs font-semibold ${
                      empMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {empMessage.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 block uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kabelo Phiri"
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 block uppercase">Work Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. phiri@lodge.com"
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 block uppercase">Assign System Role</label>
                      <select
                        value={newEmpRole}
                        onChange={(e) => setNewEmpRole(e.target.value as Role)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold text-gray-800"
                      >
                        <option value="TENANT_SALES">Sales Person (Client Registry & Bookings Log)</option>
                        <option value="TENANT_ADMIN">Guesthouse Administrator (Full System Control)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 block uppercase">Portal Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Choose staff login key"
                        value={newEmpPassword}
                        onChange={(e) => setNewEmpPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={creatingEmployee}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      id="submit-new-emp-btn"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      {creatingEmployee ? 'Creating Account...' : 'Provision Staff Account'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Employees List */}
              <div className="space-y-3" id="active-employees-container">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Authorized Team Members ({employees.length})</span>
                {loadingEmployees ? (
                  <p className="text-center text-xs text-gray-400 py-4 font-medium">Loading active team permissions...</p>
                ) : employees.length > 0 ? (
                  <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden" id="employees-grid">
                    {employees.map((emp) => {
                      const isEditing = editingEmpId === emp.id;
                      return (
                        <div key={emp.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/20 transition-colors" id={`emp-card-${emp.id}`}>
                          {isEditing ? (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2" id={`editing-box-${emp.id}`}>
                              <input
                                type="text"
                                value={editEmpName}
                                onChange={(e) => setEditEmpName(e.target.value)}
                                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                              />
                              <input
                                type="email"
                                value={editEmpEmail}
                                onChange={(e) => setEditEmpEmail(e.target.value)}
                                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                              />
                              <select
                                value={editEmpRole}
                                onChange={(e) => setEditEmpRole(e.target.value as Role)}
                                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-800"
                              >
                                <option value="TENANT_SALES">TENANT_SALES</option>
                                <option value="TENANT_ADMIN">TENANT_ADMIN</option>
                              </select>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs rounded-lg uppercase border border-gray-200">
                                {emp.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-gray-800">{emp.name}</span>
                                  {emp.id === currentUser.id && (
                                    <span className="px-1.5 py-0.5 bg-gray-900 text-white rounded text-[8px] font-black uppercase">You</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono font-medium block">{emp.email}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 md:self-center" id="emp-actions">
                            {!isEditing && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                emp.role === 'TENANT_ADMIN' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {emp.role === 'TENANT_ADMIN' ? 'Administrator' : 'Sales Person'}
                              </span>
                            )}

                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleSaveEmployeeEdit(emp.id)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 rounded-lg"
                                  title="Save Changes"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingEmpId(null)}
                                  className="p-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg"
                                  title="Cancel Edit"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStartEdit(emp)}
                                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                  title="Edit Team Member"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                  disabled={emp.id === currentUser.id}
                                  className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 disabled:text-red-200 disabled:bg-transparent rounded-lg"
                                  title="Remove Member"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-400 py-6">No custom team roles defined.</p>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Status & Billing */}
        <div className="space-y-8" id="settings-right-pane">
          
          {/* Subscription Card */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="billing-card">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Subscription & Plan</h3>
                <p className="text-[10px] text-gray-500">Manage billing and tier details.</p>
              </div>
            </div>

            <div className="p-6 space-y-6" id="billing-body">
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wider">CURRENT ACTIVE TIER</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-indigo-600">Enterprise Pro Plan</span>
                  <span className="text-xs text-gray-400 font-semibold">P499/mo</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold">Subscription Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    guesthouse.subscriptionStatus === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {guesthouse.subscriptionStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold">Billing Cycle Ends</span>
                  <span className="font-bold text-gray-700">
                    {guesthouse.subscriptionEndsAt 
                      ? new Date(guesthouse.subscriptionEndsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {guesthouse.subscriptionStatus === 'ACTIVE' ? (
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  id="cancel-sub-btn"
                >
                  <DollarSign className="h-4 w-4" />
                  {cancellingSubscription ? 'Cancelling Plan...' : 'Cancel Premium Subscription'}
                </button>
              ) : (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-[10px] font-medium text-red-700" id="cancelled-sub-alert">
                  Your premium subscription has been scheduled for cancellation. Features will remain active until your billing cycle concludes.
                </div>
              )}
            </div>
          </section>

          {/* Danger Zone Account Deletion */}
          <section className="bg-red-50/30 rounded-2xl border border-red-100 shadow-sm overflow-hidden" id="danger-card">
            <div className="p-6 border-b border-red-100 bg-red-50/50 flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-red-900">System Danger Zone</h3>
                <p className="text-[10px] text-red-500">Irreversible lodging administration tasks.</p>
              </div>
            </div>

            <div className="p-6 space-y-4" id="danger-body">
              <p className="text-xs text-gray-500 leading-relaxed">
                Deleting your guesthouse account is permanent. It will instantly remove all booking ledgers, client opt-in registries, WhatsApp log records, and disable all team members' portal accounts permanently.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-red-600/10 flex items-center justify-center gap-1.5"
                id="delete-account-btn"
              >
                <Trash2 className="h-4 w-4" />
                Delete Guesthouse Account
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="delete-modal">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl space-y-6" id="delete-modal-body">
            <div className="flex items-center gap-3 text-red-600 border-b border-gray-100 pb-3" id="delete-modal-header">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-black text-gray-950 text-base" id="delete-modal-title">Confirm Account Deletion</h3>
            </div>

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed" id="delete-modal-desc">
              <p>This action is **irreversible**. You are about to permanently delete **{guesthouse.name}** and remove all active and historical booking archives.</p>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 block uppercase">
                  Type <span className="font-black text-red-600">"{guesthouse.name}"</span> below to confirm:
                </label>
                <input
                  type="text"
                  required
                  value={confirmDeleteName}
                  onChange={(e) => setConfirmDeleteName(e.target.value)}
                  placeholder="Enter exact guesthouse name"
                  className="w-full px-3 py-2 border border-red-200 rounded-xl text-xs font-bold text-red-700 bg-red-50/20 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100" id="delete-modal-footer">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmDeleteName('');
                }}
                disabled={deletingAccount}
                className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount || confirmDeleteName.trim().toLowerCase() !== guesthouse.name.toLowerCase()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/10 transition-colors"
              >
                {deletingAccount ? 'Deleting Account...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
