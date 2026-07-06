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
  Info,
  Menu,
  TrendingUp,
  Zap,
  Check,
  ArrowRight,
  DollarSign
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
import SuperAdminSettingsView from './components/SuperAdminSettingsView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [guesthouse, setGuesthouse] = useState<Guesthouse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  // Login page toggling state
  const [showLogin, setShowLogin] = useState(false);
  // Forgot Password flow states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // ROI Calculator state for landing page
  const [monthlyRevenue, setMonthlyRevenue] = useState(30000);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

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

    // Override window.fetch to automatically trigger success toasts for mutations and inject auth token!
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = sessionStorage.getItem('gha_auth_token');
      const updatedInit = { ...init };
      if (token) {
        const headers = new Headers(init?.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        updatedInit.headers = headers;
      }
      
      const response = await originalFetch(input, updatedInit);
      
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
      const gRes = await fetch(`/api/guesthouse?guesthouseId=${targetGuesthouseId}`);
      
      if (bRes.ok && cRes.ok && lRes.ok && campRes.ok) {
        setBookings(await bRes.json());
        setCustomers(await cRes.json());
        setLogs(await lRes.json());
        setCampaigns(await campRes.json());
      }
      if (gRes.ok) {
        setGuesthouse(await gRes.json());
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

  // Auto-poll every 1 minute to pick up live webhook updates (read, reply, conversions)
  useEffect(() => {
    if (!user?.guesthouseId) return;
    const interval = setInterval(() => {
      fetchTenantMetrics(user.guesthouseId);
    }, 60000);
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
        if (data.token) {
          sessionStorage.setItem('gha_auth_token', data.token);
        }
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

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotError('');
    setForgotLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json() as any;
      if (response.ok) {
        setForgotMsg(data.message || 'Password reset email triggered successfully.');
        setForgotEmail('');
      } else {
        setForgotError(data.error || 'Failed to trigger password reset.');
      }
    } catch (err) {
      setForgotError('Error connecting to backend API');
    } finally {
      setForgotLoading(false);
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
        if (data.token) {
          sessionStorage.setItem('gha_auth_token', data.token);
        }
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
    sessionStorage.removeItem('gha_auth_token');
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

  const renderLandingPage = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900 scroll-smooth" id="marketing-landing-page">
        {/* Navbar */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-wider text-gray-900">Oidaq</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <a href="#challenges" className="hover:text-indigo-600 transition-colors">Challenges</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setShowLogin(true);
              }}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden max-w-5xl mx-auto space-y-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200/30 blur-[120px] rounded-full -z-10" />
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none max-w-4xl">
            Put Your Client Chats <br className="hidden md:inline" /> & Bookings on Autopilot.
          </h1>

          <p className="text-sm md:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
            Automatically dispatch reminders, request customer reviews on WhatsApp, and optimize social media ads with zero middle-man commissions. Fully localized for guesthouses, spas, salons, and clinics.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full justify-center">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setShowLogin(true);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Sign In to Workspace
            </button>
          </div>
        </section>

        {/* Challenges Section */}
        <section id="challenges" className="px-6 py-20 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight leading-none">
                SOLVE TODAY. <span className="text-indigo-600">GROW TOMORROW.</span>
              </h2>
              <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto font-medium">
                We turn your biggest business challenges into growth opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Struggling With */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-black uppercase tracking-wider">
                  Struggling With:
                </div>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Losing Customers?</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Poor engagement and experience make customers go elsewhere.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold">
                      <Info className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Late Replies?</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Slow responses mean lost trust and missed sales.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Spending More on Ads?</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">High ad costs with low results? You're not alone.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Lack of Reviews?</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">No reviews, no trust. It's time to build your reputation.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Fewer Customers?</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Low visibility and weak strategy limit your growth.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* We Help You */}
              <div className="bg-indigo-950 text-white rounded-3xl p-8 md:p-10 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-indigo-800/30 rounded-full blur-[60px]" />
                
                <h3 className="text-lg font-black tracking-tight uppercase border-b border-indigo-900 pb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                  We Help You:
                </h3>

                <ul className="space-y-4 text-xs font-semibold">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-400">
                      <Check className="h-4 w-4" />
                    </div>
                    Keep customers coming back
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-400">
                      <Check className="h-4 w-4" />
                    </div>
                    Reply faster & close more deals
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-400">
                      <Check className="h-4 w-4" />
                    </div>
                    Run ads that actually convert
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-400">
                      <Check className="h-4 w-4" />
                    </div>
                    Get more reviews & build trust
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-400">
                      <Check className="h-4 w-4" />
                    </div>
                    Attract more customers
                  </li>
                </ul>

                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider text-center border-t border-indigo-900 pt-4">
                  Smart strategies. Real results. Lasting growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Simple, Predictable Plans</h2>
              <p className="text-xs md:text-sm text-gray-400 font-medium">All plans run on isolated cloud worker instances with zero shared resource limits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tier 1 */}
              <div className="border border-gray-100 bg-white rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Starter</h3>
                    <p className="text-xs text-gray-400 mt-1">Perfect for small boutique setups or salons.</p>
                  </div>
                  <div className="text-2xl font-black text-gray-900 font-mono">
                    R 499 <span className="text-xs text-gray-400 font-sans font-normal">/ month</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg text-amber-700 text-[10px] font-bold uppercase w-fit">
                    Self-Managed (You run campaigns yourself)
                  </div>
                  <ul className="text-xs text-gray-500 space-y-2.5 font-medium pt-2">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Unlimited monthly bookings</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> WhatsApp reminder templates</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Bulk WhatsApp campaign blasts</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Smart Facebook Ads advisor</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowLogin(true);
                  }}
                  className="w-full py-3 bg-gray-950 hover:bg-gray-900 text-white font-bold rounded-xl text-xs transition-all mt-6"
                >
                  Get Started
                </button>
              </div>

              {/* Tier 2 */}
              <div className="border-2 border-indigo-600 bg-white rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:shadow-lg transition-all relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Professional</h3>
                    <p className="text-xs text-gray-400 mt-1">For scaling guesthouses, car rents, and clinics.</p>
                  </div>
                  <div className="text-3xl font-black text-gray-900 font-mono">
                    R 1,499 <span className="text-xs text-gray-400 font-sans font-normal">/ month</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-lg text-indigo-700 text-[10px] font-bold uppercase w-fit">
                    Fully Managed (We manage your campaigns)
                  </div>
                  <ul className="text-xs text-gray-500 space-y-2.5 font-medium pt-2">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Unlimited monthly bookings</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> WhatsApp reminder templates</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Bulk WhatsApp campaign blasts</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Smart Facebook Ads advisor</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowLogin(true);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all mt-6 shadow-md shadow-indigo-600/10"
                >
                  Get Started
                </button>
              </div>

              {/* Tier 3 */}
              <div className="border border-gray-100 bg-white rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Enterprise</h3>
                    <p className="text-xs text-gray-400 mt-1">For multi-location brands and hotels.</p>
                  </div>
                  <div className="text-2xl font-black text-gray-900">
                    Custom <span className="text-xs text-gray-400 font-sans font-normal">Pricing</span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-2.5 font-medium pt-4">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Multi-location dashboards</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Custom domain configuration</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Dedicated onboarding support</li>
                  </ul>
                </div>
                <a
                  href="mailto:support@oidaq.online"
                  className="w-full py-3 bg-gray-950 hover:bg-gray-900 text-white text-center font-bold rounded-xl text-xs transition-all mt-6 block"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-6 py-20 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Let's Grow Together</h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Get in touch with our team to request a setup, custom feature, or consultation.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs font-bold">
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span>Call / WhatsApp</span>
                <a href="https://wa.me/26771504283" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors font-mono">
                  +267 71504283
                </a>
              </div>
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Info className="h-5 w-5" />
                </div>
                <span>Email Support</span>
                <a href="mailto:support@oidaq.online" className="text-indigo-600 hover:text-indigo-800 transition-colors font-mono">
                  support@oidaq.online
                </a>
              </div>
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Bed className="h-5 w-5" />
                </div>
                <span>Website Platform</span>
                <a href="https://www.oidaq.online" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors font-mono">
                  www.oidaq.online
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-500 text-center py-10 px-6 border-t border-gray-900 text-xs">
          <p>© {new Date().getFullYear()} Oidaq. All rights reserved.</p>
        </footer>
      </div>
    );
  };

  // Render Login state first
  if (!user) {
    if (!showLogin) {
      return (
        <>
          {renderLandingPage()}
          {renderToast()}
        </>
      );
    }

    return (
      <>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased" id="login-layout">
          {/* Back to Home Button */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-left px-2 mb-4">
            <button 
              onClick={() => {
                setShowForgotPassword(false);
                setShowLogin(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center" id="login-header-block">
          <div className="inline-flex p-3 bg-gray-900 rounded-2xl text-white shadow-md mx-auto" id="logo-icon-bg">
            <Bed className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight" id="login-brand-title">Oidaq Workspace</h2>
          <p className="text-xs text-gray-400">Powerful dashboard with AI analytical pipelines, Facebook, and WhatsApp integrations.</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" id="login-form-card">
          <div className="bg-white py-8 px-6 border border-gray-100 rounded-3xl shadow-xl space-y-6">
            {showForgotPassword ? (
              <form className="space-y-4" onSubmit={handleForgotPasswordSubmit} id="forgot-password-form">
                <h3 className="text-sm font-bold text-gray-900">Reset Your Password</h3>
                <p className="text-xs text-gray-400">Enter your registered email address below, and we will send a password reset link to your inbox.</p>
                
                <div className="space-y-1" id="forgot-email-field">
                  <label htmlFor="forgot-email" className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="e.g. sarah@pinecrest.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>

                {forgotMsg && (
                  <div className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100" id="forgot-success-alert">
                    {forgotMsg}
                  </div>
                )}

                {forgotError && (
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100" id="forgot-error-alert">
                    {forgotError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-2"
                  id="forgot-btn"
                >
                  {forgotLoading ? 'Sending Email...' : 'Send Reset Link'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotMsg('');
                      setForgotError('');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
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
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
            )}


          </div>
        </div>
      </div>
      {renderToast()}
      </>
    );
  }

  const isTenantLockout = user && user.role !== 'SUPER_ADMIN' && guesthouse && (guesthouse.isBlocked || guesthouse.isPaused);

  if (isTenantLockout) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-white text-center">
        <div className="max-w-md w-full space-y-6 bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="inline-flex p-4 bg-red-950/50 rounded-2xl text-red-500 border border-red-900/50 mx-auto">
            <Lock className="h-10 w-10 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-red-400">Portal Access Restricted</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your guesthouse portal subscription is currently {guesthouse.isBlocked ? 'Blocked' : 'Paused'}. 
            All automated integrations, bookings workflows, and AI engines have been halted.
          </p>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-left text-[11px] space-y-2 text-gray-400">
            <div><span className="font-bold text-gray-300">Guesthouse:</span> {guesthouse.name}</div>
            <div><span className="font-bold text-gray-300">Tenant ID:</span> {guesthouse.id}</div>
            <div><span className="font-bold text-gray-300">Status:</span> {guesthouse.isBlocked ? 'SUSPENDED' : 'PAUSED'}</div>
            <div><span className="font-bold text-gray-300">Reason:</span> Subscription expired or suspended by SaaS Overseer.</div>
          </div>
          <p className="text-[10px] text-gray-500">Please contact the platform administrator to restore your account status.</p>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            Log Out of Workspace
          </button>
        </div>
        {renderToast()}
      </div>
    );
  }

  const renderNavigationLinks = (closeMobileMenu?: () => void) => {
    const handleNavClick = (tab: string) => {
      setActiveTab(tab);
      if (closeMobileMenu) closeMobileMenu();
    };

    return (
      <div className="space-y-1">
        {user.role !== 'SUPER_ADMIN' && (
          <>
            <button
              onClick={() => handleNavClick('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              id="nav-overview"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview Dashboard
            </button>

            <button
              onClick={() => handleNavClick('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              id="nav-bookings"
            >
              <Calendar className="h-4 w-4" />
              Bookings Log
            </button>

            {guesthouse?.featureFlags?.facebookAds === true && guesthouse?.subscriptionStatus === 'ACTIVE' && (
              <button
                onClick={() => handleNavClick('facebook-ads')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'facebook-ads' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
                id="nav-facebook-ads"
              >
                <Megaphone className="h-4 w-4 text-blue-400" />
                Facebook Ads
              </button>
            )}

            {guesthouse?.featureFlags?.whatsappMarketing === true && guesthouse?.subscriptionStatus === 'ACTIVE' && (
              <button
                onClick={() => handleNavClick('marketing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'marketing' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
                id="nav-marketing"
              >
                <Smartphone className="h-4 w-4" />
                WhatsApp Marketing
              </button>
            )}

            <button
              onClick={() => handleNavClick('customers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'customers' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              id="nav-customers"
            >
              <Users className="h-4 w-4" />
              Clients Registry
            </button>

            <button
              onClick={() => handleNavClick('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              id="nav-reports"
            >
              <BarChart className="h-4 w-4" />
              Stat Reports
            </button>

            {guesthouse?.featureFlags?.aiForecasts === true && guesthouse?.subscriptionStatus === 'ACTIVE' && (
              <button
                onClick={() => handleNavClick('ai-analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'ai-analytics' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
                id="nav-ai-analytics"
              >
                <Brain className="h-4 w-4 text-amber-400" />
                AI Booking Forecast
              </button>
            )}

            {user.role === 'TENANT_ADMIN' && (
              <button
                onClick={() => handleNavClick('settings')}
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

        {user.role === 'SUPER_ADMIN' && (
          <>
            <button
              onClick={() => handleNavClick('super-admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'super-admin' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              id="nav-super-admin"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Global SaaS Overseer
            </button>

            <button
              onClick={() => handleNavClick('super-settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'super-settings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              id="nav-super-settings"
            >
              <Settings className="h-4 w-4 text-indigo-400" />
              SaaS Overseer Settings
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-gray-950 text-white z-50 flex flex-col justify-between overflow-hidden shadow-2xl md:hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white">
                      <Bed className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-black text-xl tracking-wider block">Oidaq</span>
                      <span className="text-[9px] text-gray-400 font-mono tracking-tight uppercase">V1.0.0</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="border-t border-gray-800" />
                <nav className="space-y-1">
                  {renderNavigationLinks(() => setIsMobileMenuOpen(false))}
                </nav>
              </div>
              <div className="p-6 border-t border-gray-900 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-800 text-white flex items-center justify-center font-bold text-xs rounded-xl border border-gray-700">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-gray-200 block truncate">{user.name}</span>
                    <span className="text-[10px] text-gray-500 block truncate">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 hover:border-red-900/40 text-red-400 rounded-xl text-xs font-semibold transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-screen bg-gray-50 flex font-sans text-gray-800 antialiased overflow-hidden" id="dashboard-container">
      {/* 1. Permanent Left Sidebar (desktop only) */}
      <aside className="hidden md:flex w-64 bg-gray-950 text-white flex flex-col justify-between shrink-0 overflow-hidden" id="main-sidebar">
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
            {renderNavigationLinks()}
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
        {/* Desktop Metric Header Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8 shrink-0 shadow-sm" id="main-header">
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

        {/* Mobile Header Bar */}
        <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm" id="mobile-header">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xs font-bold text-gray-900 truncate max-w-[150px]">
              {guesthouse ? guesthouse.name : 'Platform Overseer'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Database indicator */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg">
              <Database className={`h-3 w-3 ${dbConnected ? 'text-green-500' : 'text-amber-500 animate-pulse'}`} />
              <span className="text-[8px] font-bold text-gray-500 font-mono">
                {dbMode === 'D1_SQLITE_CLOUDFLARE' ? 'D1' : 'Demo'}
              </span>
            </div>
            {/* User Avatar */}
            <div className="h-8 w-8 bg-gray-900 text-white flex items-center justify-center font-bold text-xs rounded-xl border border-gray-800">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Canvas Area */}
        <div className="p-4 md:p-8 flex-1" id="page-body">
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

              {activeTab === 'super-settings' && (
                <SuperAdminSettingsView />
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
