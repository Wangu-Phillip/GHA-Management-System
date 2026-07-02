import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart,
  Brain,
  ShieldCheck,
  LogOut,
  Sparkles,
  Smartphone,
  Bed,
  CheckCircle2,
  Lock,
  ChevronRight,
  Database,
  Building,
  Settings,
  Megaphone,
  AlertCircle,
  X,
  Info
} from 'lucide-react';

import { User, Guesthouse, Booking, Customer, MessageLog, Campaign } from './types';
import OverviewView from './components/OverviewView';
import BookingsView from './components/BookingsView';
import MarketingView from './components/MarketingView';
import CustomersView from './components/CustomersView';
import ReportsView from './components/ReportsView';
import AiAnalyticsView from './components/AiAnalyticsView';
import SuperAdminView from './components/SuperAdminView';
import SettingsView from './components/SettingsView';
import FacebookAdsView from './components/FacebookAdsView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [guesthouse, setGuesthouse] = useState<Guesthouse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Real-time states synced from Express API
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbMode, setDbMode] = useState('LOCAL_DEMO_STATE');
  const [loading, setLoading] = useState(false);

  // Cross-view state transfer (e.g., from AI insights to campaign dispatch)
  const [initialCampaignTemplate, setInitialCampaignTemplate] = useState<string>('');

  // Login Form input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Global Toast / popup notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    // Expose globally so child views can call window.showToast("Msg", "success") directly
    (window as any).showToast = showToast;

    // Override window.alert to automatically convert all ugly browser alerts to premium toasts
    const originalAlert = window.alert;
    window.alert = (message: string) => {
      if (!message) return;
      const lower = message.toLowerCase();
      const isSuccess = lower.includes('success') || 
                        lower.includes('successfully') || 
                        lower.includes('saved') || 
                        lower.includes('updated') || 
                        lower.includes('created') || 
                        lower.includes('completed') || 
                        lower.includes('deleted') || 
                        lower.includes('sent');
      showToast(message, isSuccess ? 'success' : 'error');
    };

    // Override window.fetch to automatically trigger success toasts for mutations!
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      
      const method = (init?.method || 'GET').toUpperCase();
      const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      // Only show success toasts for successful POST, PUT, DELETE operations on the REST API
      if (response.ok && ['POST', 'PUT', 'DELETE'].includes(method) && urlStr.includes('/api/')) {
        const isExcluded = urlStr.includes('/api/webhooks/') || urlStr.includes('/api/super/') || urlStr.includes('/api/auth/login');
        
        if (!isExcluded) {
          let actionWord = 'updated';
          if (method === 'POST') actionWord = 'created';
          if (method === 'DELETE') actionWord = 'deleted';

          let entity = 'Record';
          if (urlStr.includes('/api/customers')) entity = 'Customer registry profile';
          else if (urlStr.includes('/api/bookings')) entity = 'Booking record';
          else if (urlStr.includes('/api/marketing/whatsapp-settings') || urlStr.includes('/api/guesthouse')) entity = 'Guesthouse settings';
          else if (urlStr.includes('/api/employees')) entity = 'Employee profile';
          else if (urlStr.includes('/api/marketing/whatsapp-send')) entity = 'WhatsApp message';
          else if (urlStr.includes('/api/marketing/campaigns')) entity = 'Campaign broadcast';

          showToast(`${entity} ${actionWord} successfully!`, 'success');
        }
      }

      return response;
    };

    return () => {
      window.alert = originalAlert;
      window.fetch = originalFetch;
    };
  }, []);

  // Auto-dismiss notification toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Sync core tenant metrics from full-stack server
  const fetchTenantMetrics = async (targetGuesthouseId: string) => {
    try {
      const bRes = await fetch(`/api/bookings?guesthouseId=${targetGuesthouseId}`);
      const cRes = await fetch(`/api/customers?guesthouseId=${targetGuesthouseId}`);
      const lRes = await fetch(`/api/marketing/whatsapp-logs?guesthouseId=${targetGuesthouseId}`);
      const campRes = await fetch(`/api/marketing/campaigns?guesthouseId=${targetGuesthouseId}`);
      
      if (bRes.ok && cRes.ok && lRes.ok && campRes.ok) {
        setBookings(await bRes.json());
        setCustomers(await cRes.json());
        setLogs(await lRes.json());
        setCampaigns(await campRes.json());
      }
    } catch (err) {
      console.error('Network synchronization error', err);
    }
  };

  // Callable refresh used by child views (MarketingView, CustomersView, etc.) — defined below near logout handler

  // Sync health endpoint to identify database connection state
  const checkPlatformHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = (await res.json()) as any;
        setDbConnected(data.dbConnected);
        setDbMode(data.mode);
      }
    } catch (err) {
      console.error('System health check failed', err);
    }
  };

  useEffect(() => {
    checkPlatformHealth();
  }, []);

  useEffect(() => {
    if (user && user.guesthouseId) {
      fetchTenantMetrics(user.guesthouseId);
    }
  }, [user]);

  // Auto-poll every 10 seconds to pick up live webhook updates (read, reply, conversions)
  useEffect(() => {
    if (!user?.guesthouseId) return;
    const interval = setInterval(() => {
      fetchTenantMetrics(user.guesthouseId);
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        setUser(data.user);
        setGuesthouse(data.guesthouse);
        setActiveTab(data.user.role === 'SUPER_ADMIN' ? 'super-admin' : 'overview');
      } else {
        const data = (await response.json()) as any;
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Login tool
  const triggerQuickLogin = async (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setLoginError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: presetEmail, password: presetPass }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        setUser(data.user);
        setGuesthouse(data.guesthouse);
        setActiveTab(data.user.role === 'SUPER_ADMIN' ? 'super-admin' : 'overview');
      } else {
        const data = (await response.json()) as any;
        setLoginError(data.error || 'Preset login failed');
      }
    } catch (err) {
      setLoginError('Server offline');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setGuesthouse(null);
    setBookings([]);
    setCustomers([]);
    setLogs([]);
    setEmail('');
    setPassword('');
  };

  // Callback to refresh data after mutations
  const handleDataRefresh = async () => {
    if (user && user.guesthouseId) {
      await fetchTenantMetrics(user.guesthouseId);
    }
  };

  // Helper when Super Admin switches simulated tenant
  const handleSwitchSimulatedTenant = async (tenantId: string) => {
    try {
      const res = await fetch('/api/super/guesthouses');
      if (res.ok) {
        const list: Guesthouse[] = await res.json();
        const selected = list.find((g) => g.id === tenantId) || null;
        setGuesthouse(selected);
        // Retain super-admin user, but switch metrics viewport context!
        if (user) {
          const fakeUserContext: User = {
            ...user,
            guesthouseId: tenantId,
          };
          setUser(fakeUserContext);
          setActiveTab('overview');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Insights Campaign deep linking
  const handleNavigateToCampaign = (template: string) => {
    setInitialCampaignTemplate(template);
    setActiveTab('marketing');
  };

  const renderToast = () => (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 flex gap-3 pointer-events-auto"
          id="toast-notification"
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' ? (
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            ) : toast.type === 'error' ? (
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
                <AlertCircle className="h-5 w-5" />
              </div>
            ) : (
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                <Info className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0 pt-0.5">
            <p className="text-xs font-bold text-gray-900 uppercase">
              {toast.type === 'success' ? 'Action Completed' : toast.type === 'error' ? 'Something Went Wrong' : 'Notification'}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="flex-shrink-0 self-start p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            id="toast-close"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render Login state first
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased" id="login-layout">
        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center" id="login-header-block">
          <div className="inline-flex p-3 bg-gray-900 rounded-2xl text-white shadow-md mx-auto" id="logo-icon-bg">
            <Bed className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight" id="login-brand-title">Oidaq Workspace</h2>
          <p className="text-xs text-gray-400">Powerful dashboard with AI analytical pipelines, Facebook, and WhatsApp integrations.</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" id="login-form-card">
          <div className="bg-white py-8 px-6 border border-gray-100 rounded-3xl shadow-xl space-y-6">
            <form className="space-y-4" onSubmit={handleLoginSubmit} id="login-form">
              <div className="space-y-1" id="login-email-field">
                <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. sarah@pinecrest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1" id="login-pass-field">
                <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              {loginError && (
                <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100" id="login-error-alert">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-2"
                id="login-btn"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex py-2 items-center" id="divider">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase">One-Click Testing Roles</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Quick Presets Grid */}
            <div className="grid grid-cols-1 gap-2.5" id="preset-grid">
              <button
                onClick={() => triggerQuickLogin('sarah@pinecrest.com', 'pine123')}
                className="w-full p-3 bg-gray-50 hover:bg-gray-100/75 rounded-xl border border-gray-100 text-left transition-all flex items-center justify-between"
                id="preset-pine-admin"
              >
                <div className="space-y-0.5" id="preset-meta-1">
                  <span className="text-[11px] font-bold text-gray-800 block">Pinecrest Ridge (Admin)</span>
                  <span className="text-[9px] text-gray-400 block font-mono">sarah@pinecrest.com (pine123)</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button
                onClick={() => triggerQuickLogin('john@pinecrest.com', 'pine123')}
                className="w-full p-3 bg-gray-50 hover:bg-gray-100/75 rounded-xl border border-gray-100 text-left transition-all flex items-center justify-between"
                id="preset-pine-sales"
              >
                <div className="space-y-0.5" id="preset-meta-2">
                  <span className="text-[11px] font-bold text-gray-800 block">Pinecrest Ridge (Sales Rep)</span>
                  <span className="text-[9px] text-gray-400 block font-mono">john@pinecrest.com (pine123)</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button
                onClick={() => triggerQuickLogin('admin@guesthousesaas.com', 'admin123')}
                className="w-full p-3 bg-indigo-50 hover:bg-indigo-100/75 rounded-xl border border-indigo-100 text-left transition-all flex items-center justify-between"
                id="preset-saas-super"
              >
                <div className="space-y-0.5" id="preset-meta-3">
                  <span className="text-[11px] font-bold text-indigo-950 block flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                    SaaS Super Overseer (Dev Admin)
                  </span>
                  <span className="text-[9px] text-indigo-500/80 block font-mono">admin@guesthousesaas.com (admin123)</span>
                </div>
                <ChevronRight className="h-4 w-4 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {renderToast()}
      </>
    );
  }

  return (
    <>
      <div className="h-screen bg-gray-50 flex font-sans text-gray-800 antialiased overflow-hidden" id="dashboard-container">
      {/* 1. Permanent Left Sidebar */}
      <aside className="w-64 bg-gray-950 text-white flex flex-col justify-between shrink-0 overflow-hidden" id="main-sidebar">
        <div className="p-6 space-y-6" id="sidebar-top">
          {/* Logo Brand */}
          <div className="flex items-center gap-3" id="sidebar-brand">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10" id="sidebar-logo">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-wider block">Oidaq</span>
              <span className="text-[9px] text-gray-400 font-mono tracking-tight uppercase">V1.0.0</span>
            </div>
          </div>

          <div className="border-t border-gray-800" id="sidebar-divider" />

          {/* Navigation Links */}
          <nav className="space-y-1" id="sidebar-nav">
            {user.role !== 'SUPER_ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-overview"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-bookings"
                >
                  <Calendar className="h-4 w-4" />
                  Bookings Log
                </button>

                <button
                  onClick={() => setActiveTab('facebook-ads')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'facebook-ads' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-facebook-ads"
                >
                  <Megaphone className="h-4 w-4 text-blue-400" />
                  Facebook Ads
                </button>

                <button
                  onClick={() => setActiveTab('marketing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'marketing' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-marketing"
                >
                  <Smartphone className="h-4 w-4" />
                  WhatsApp Marketing
                </button>

                <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'customers' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-customers"
                >
                  <Users className="h-4 w-4" />
                  Clients Registry
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-reports"
                >
                  <BarChart className="h-4 w-4" />
                  Stat Reports
                </button>

                <button
                  onClick={() => setActiveTab('ai-analytics')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'ai-analytics' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                  id="nav-ai-analytics"
                >
                  <Brain className="h-4 w-4 text-amber-400" />
                  AI Booking Forecast
                </button>

                {user.role === 'TENANT_ADMIN' && (
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                    id="nav-settings"
                  >
                    <Settings className="h-4 w-4" />
                    Guesthouse Settings
                  </button>
                )}
              </>
            )}

            {/* SUPER ADMIN ROUTE OVERSEER */}
            {user.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => setActiveTab('super-admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'super-admin' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
                id="nav-super-admin"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Global SaaS Overseer
              </button>
            )}
          </nav>
        </div>

        {/* User logout section */}
        <div className="p-6 border-t border-gray-900 space-y-4" id="sidebar-bottom">
          <div className="flex items-center gap-3" id="user-pill">
            <div className="h-9 w-9 bg-gray-800 text-white flex items-center justify-center font-bold text-xs rounded-xl border border-gray-700" id="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden" id="user-pill-meta">
              <span className="font-semibold text-xs text-gray-200 block truncate">{user.name}</span>
              <span className="text-[10px] text-gray-500 block truncate">{user.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 hover:border-red-900/40 text-red-400 rounded-xl text-xs font-semibold transition-all"
            id="logout-btn"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto" id="main-canvas">
        {/* Top Metric Header Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 shadow-sm" id="main-header">
          <div className="flex items-center gap-3" id="header-left">
            <Building className="h-5 w-5 text-gray-400" />
            <h1 className="text-sm font-bold text-gray-900" id="guesthouse-heading">
              {guesthouse ? guesthouse.name : 'Platform Overseer Context'}
            </h1>
            {guesthouse && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider ${
                guesthouse.subscriptionStatus === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`} id="subscription-badge">
                SUB: {guesthouse.subscriptionStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4" id="header-right">
            {/* Database mode indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl" id="db-indicator">
              <Database className={`h-3.5 w-3.5 ${dbConnected ? 'text-green-500' : 'text-amber-500 animate-pulse'}`} />
              <span className="text-[10px] font-bold text-gray-600 font-mono">
                {dbMode}
              </span>
            </div>

            {/* Super Admin tenant context switcher (visible only to super admins to test guesthouses) */}
            {user.role === 'SUPER_ADMIN' && guesthouse && (
              <button
                onClick={() => {
                  setGuesthouse(null);
                  setActiveTab('super-admin');
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold transition-all"
                id="switch-back-btn"
              >
                Back to SaaS Admin
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Canvas Area */}
        <div className="p-8 flex-1" id="page-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'overview' && (
                <OverviewView
                  bookings={bookings}
                  customers={customers}
                  logs={logs}
                  dbConnected={dbConnected}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'bookings' && guesthouse && (
                <BookingsView
                  bookings={bookings}
                  guesthouseId={guesthouse.id}
                  guesthouse={guesthouse}
                  onRefresh={handleDataRefresh}
                  onUpdateGuesthouse={(updatedGh) => setGuesthouse(updatedGh)}
                />
              )}

              {activeTab === 'marketing' && guesthouse && (
                <MarketingView
                  campaigns={campaigns}
                  logs={logs}
                  guesthouse={guesthouse}
                  guesthouseId={guesthouse.id}
                  optInCount={customers.filter((c) => c.optInPromo).length}
                  customers={customers}
                  bookings={bookings}
                  onRefresh={handleDataRefresh}
                  onUpdateGuesthouse={(updatedGh) => setGuesthouse(updatedGh)}
                />
              )}

              {activeTab === 'customers' && guesthouse && (
                <CustomersView
                  customers={customers}
                  guesthouseId={guesthouse.id}
                  onRefresh={handleDataRefresh}
                />
              )}

              {activeTab === 'reports' && guesthouse && (
                <ReportsView guesthouseId={guesthouse.id} />
              )}

              {activeTab === 'facebook-ads' && guesthouse && (
                <FacebookAdsView
                  guesthouseId={guesthouse.id}
                />
              )}

              {activeTab === 'ai-analytics' && guesthouse && (
                <AiAnalyticsView
                  guesthouseId={guesthouse.id}
                  onNavigateToCampaign={handleNavigateToCampaign}
                />
              )}

              {activeTab === 'settings' && guesthouse && (
                <SettingsView
                  guesthouse={guesthouse}
                  currentUser={user}
                  onUpdateGuesthouse={(updatedGh) => setGuesthouse(updatedGh)}
                  onLogout={handleLogout}
                />
              )}

              {activeTab === 'super-admin' && (
                <SuperAdminView
                  onRefreshGlobalStats={handleDataRefresh}
                  onSwitchTenant={handleSwitchSimulatedTenant}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>
      {renderToast()}
    </>
  );
}
