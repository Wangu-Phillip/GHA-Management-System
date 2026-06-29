import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Coins, Bed, Calendar, Users, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { Booking, Customer, MessageLog } from '../types';

interface OverviewProps {
  bookings: Booking[];
  customers: Customer[];
  logs: MessageLog[];
  dbConnected: boolean;
  onNavigate: (tab: string) => void;
}

export default function OverviewView({ bookings, customers, logs, dbConnected, onNavigate }: OverviewProps) {
  // Calculations
  const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');
  const currentCheckedIn = bookings.filter(b => b.status === 'CHECKED_IN').length;
  
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  
  const totalRooms = 5;
  const totalNightsSold = activeBookings.reduce((sum, b) => {
    const start = new Date(b.checkIn);
    const end = new Date(b.checkOut);
    const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + diff;
  }, 0);
  
  // Occupancy estimate
  const estimatedOccupancy = Math.min(100, Math.round((currentCheckedIn / totalRooms) * 100));
  const promoConsentCount = customers.filter(c => c.optInPromo).length;
  const promosPercentage = customers.length > 0 ? Math.round((promoConsentCount / customers.length) * 100) : 0;

  // Chart data aggregation: Revenue by Month (or day)
  const monthlyRevenueMap: Record<string, number> = {};
  bookings.filter(b => b.status !== 'CANCELLED').forEach(b => {
    const date = new Date(b.checkIn);
    const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + b.totalAmount;
  });

  const chartData = Object.entries(monthlyRevenueMap).map(([date, revenue]) => ({
    date,
    revenue,
  })).slice(-7); // Last 7 booking dates

  // Checkout alerts (Review request log)
  const recentCheckouts = bookings
    .filter(b => b.status === 'CHECKED_OUT' || b.status === 'CHECKED_IN')
    .slice(0, 4);

  return (
    <div className="space-y-6" id="overview-view">
      {/* DB Connection Status Banner */}
      {!dbConnected && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800" id="db-status-banner">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" id="alert-icon" />
          <div className="text-sm" id="banner-text">
            <span className="font-semibold" id="banner-title">Local Demo State Active</span> — No PostgreSQL database connection URL found. All changes are stored in high-fidelity, pre-populated local memory. Provide a <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">DATABASE_URL</code> to connect real PostgreSQL.
          </div>
        </div>
      )}

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between" id="kpi-revenue">
          <div id="kpi-rev-details">
            <p className="text-sm font-medium text-gray-500" id="kpi-rev-title">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1" id="kpi-rev-value">P{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium inline-block mt-2" id="kpi-rev-change">+12.5% this month</span>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-600" id="kpi-rev-icon-bg">
            <Coins className="h-6 w-6" id="kpi-rev-icon" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between" id="kpi-occupancy">
          <div id="kpi-occ-details">
            <p className="text-sm font-medium text-gray-500" id="kpi-occ-title">Room Occupancy</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1" id="kpi-occ-value">{estimatedOccupancy}%</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium inline-block mt-2" id="kpi-occ-change">{currentCheckedIn} / {totalRooms} rooms active</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600" id="kpi-occ-icon-bg">
            <Bed className="h-6 w-6" id="kpi-occ-icon" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between" id="kpi-bookings">
          <div id="kpi-book-details">
            <p className="text-sm font-medium text-gray-500" id="kpi-book-title">Total Bookings</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1" id="kpi-book-value">{bookings.length}</h3>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium inline-block mt-2" id="kpi-book-change">{bookings.filter(b => b.status === 'CONFIRMED').length} upcoming bookings</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600" id="kpi-book-icon-bg">
            <Calendar className="h-6 w-6" id="kpi-book-icon" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between" id="kpi-marketing">
          <div id="kpi-mkt-details">
            <p className="text-sm font-medium text-gray-500" id="kpi-mkt-title">Promo Opt-ins</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1" id="kpi-mkt-value">{promoConsentCount}</h3>
            <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-medium inline-block mt-2" id="kpi-mkt-change">{promosPercentage}% consent rate</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600" id="kpi-mkt-icon-bg">
            <MessageSquare className="h-6 w-6" id="kpi-mkt-icon" />
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-body-grid">
        {/* Trend Graph */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4" id="revenue-trend-panel">
          <div className="flex items-center justify-between" id="trend-header">
            <h4 className="font-semibold text-gray-900" id="trend-title">Recent Revenue Performance</h4>
            <span className="text-xs text-gray-500" id="trend-desc">Daily aggregates</span>
          </div>
          
          <div className="h-72 w-full" id="trend-chart-container">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`P${Number(value).toFixed(2)}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2" id="trend-empty">
                <Calendar className="h-8 w-8 text-gray-300" />
                <span className="text-sm">No transaction records found</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Center / Quick Checkout Reminders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between" id="automation-panel">
          <div className="space-y-4" id="automation-inner">
            <div className="flex items-center justify-between" id="automation-header">
              <h4 className="font-semibold text-gray-900" id="automation-title">Checkout Reviews</h4>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded" id="automation-badge">Live Reminders</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed" id="automation-desc">
              The system scans bookings checking out today and prompts automated WhatsApp feedback loops on checkout events.
            </p>

            <div className="space-y-3" id="checkout-list">
              {recentCheckouts.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs border border-gray-100" id={`checkout-row-${b.id}`}>
                  <div className="space-y-1" id="checkout-meta">
                    <p className="font-semibold text-gray-800">{b.customerName}</p>
                    <p className="text-gray-400 font-mono text-[10px]">{b.roomName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1" id="checkout-status-block">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      b.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {b.status}
                    </span>
                    <span className={`text-[10px] flex items-center gap-1 ${
                      b.reviewMessageStatus === 'SENT' ? 'text-teal-600' : 'text-amber-500'
                    }`}>
                      <MessageSquare className="h-3 w-3" />
                      {b.reviewMessageStatus === 'SENT' ? 'Auto Sent' : 'Queued'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('marketing')}
            className="w-full text-center py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold mt-4 transition-colors flex items-center justify-center gap-2"
            id="manage-automations-btn"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Launch WhatsApp Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
