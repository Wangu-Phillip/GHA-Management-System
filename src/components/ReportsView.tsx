import React, { useState, useEffect } from 'react';
import { CompiledReport } from '../types';
import { Download, RefreshCw, BarChart3, TrendingUp, HelpCircle, FileSpreadsheet } from 'lucide-react';

interface ReportsProps {
  guesthouseId: string;
}

export default function ReportsView({ guesthouseId }: ReportsProps) {
  const [days, setDays] = useState('30');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<CompiledReport | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/compiled?guesthouseId=${guesthouseId}&days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [guesthouseId, days]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3" id="reports-loading">
        <RefreshCw className="h-6 w-6 text-gray-500 animate-spin" />
        <span className="text-xs text-gray-400 font-semibold">Compiling statistical ledger report...</span>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6" id="reports-view">
      {/* Selector header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="reports-header">
        <div className="flex items-center gap-3" id="reports-selectors">
          <label className="text-xs font-bold text-gray-400">ANALYSIS SCOPE:</label>
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 shadow-sm focus:outline-none"
            id="report-days-select"
          >
            <option value="7">Past 7 Days</option>
            <option value="30">Past 30 Days</option>
            <option value="90">Past 90 Days</option>
          </select>
        </div>

        <a
          href={`/api/reports/download-csv?guesthouseId=${guesthouseId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          id="export-csv-btn"
        >
          <Download className="h-4 w-4" />
          Export All Bookings (.CSV)
        </a>
      </div>

      {/* Hospitality metrics scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="report-scorecard">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="rep-kpi-rev">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Total Revenue</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">${report.summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Nights sold x occupancy rates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="rep-kpi-occ">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Occupancy Rate</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{report.summary.occupancyRate}%</span>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Rooms occupied vs capacity</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="rep-kpi-adr">
          <div className="flex items-center gap-1" id="rep-adr-meta">
            <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Average Daily Rate (ADR)</span>
            <HelpCircle className="h-3 w-3 text-gray-400" title="Average Revenue collected per occupied room per day" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-1 block">${report.summary.averageDailyRate.toFixed(2)}</span>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Average nightly rate paid</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" id="rep-kpi-revpar">
          <div className="flex items-center gap-1" id="rep-revpar-meta">
            <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">RevPAR</span>
            <HelpCircle className="h-3 w-3 text-gray-400" title="Revenue Per Available Room" />
          </div>
          <span className="text-2xl font-black text-teal-600 mt-1 block">${report.summary.revenuePerAvailableRoom.toFixed(2)}</span>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Total revenue / total available rooms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="report-grids">
        {/* Room Performance Table */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4" id="room-performance-panel">
          <div className="flex items-center justify-between" id="room-performance-header">
            <h4 className="font-semibold text-gray-900 text-sm">Room / Cabin Revenue Breakdown</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Performance matrices</span>
          </div>

          <div className="overflow-x-auto" id="room-table-wrapper">
            <table className="w-full text-left text-xs border-collapse" id="room-breakdown-table">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                  <th className="p-3">Room Type</th>
                  <th className="p-3">Bookings Count</th>
                  <th className="p-3">Nights Sold</th>
                  <th className="p-3">Average Night Price</th>
                  <th className="p-3 text-right">Revenue Collected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50" id="room-breakdown-table-body">
                {report.revenueByRoomTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-800">{row.room}</td>
                    <td className="p-3 text-gray-600 font-mono font-medium">{row.bookingsCount}</td>
                    <td className="p-3 text-gray-500 font-mono font-medium">{row.nightsSold} nights</td>
                    <td className="p-3 text-gray-500 font-semibold">${row.averageRatePerNight.toFixed(2)}</td>
                    <td className="p-3 text-right font-black text-gray-950">${row.revenueCollected.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WhatsApp automation ledger report */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="whatsapp-reports-panel">
          <div id="whatsapp-reports-headers">
            <h4 className="font-semibold text-gray-900 text-sm">WhatsApp Communication Conversion</h4>
            <p className="text-xs text-gray-400 mt-1">Stats of templates delivered to customer devices</p>
          </div>

          <div className="divide-y divide-gray-50 text-xs" id="whatsapp-metrics-list">
            <div className="py-3 flex justify-between" id="rep-optins">
              <span className="text-gray-500">Subscribers Opted In</span>
              <span className="font-bold text-gray-900">{report.summary.whatsappOptInCount} users</span>
            </div>
            <div className="py-3 flex justify-between" id="rep-campaigns">
              <span className="text-gray-500">Active Campaign Dispatches</span>
              <span className="font-bold text-gray-900">{report.summary.whatsappCampaignCount}</span>
            </div>
            <div className="py-3 flex justify-between" id="rep-checkout-rem">
              <span className="text-gray-500">Checkout Reviews Sent</span>
              <span className="font-bold text-gray-900">{report.summary.whatsappReviewRequestsSent}</span>
            </div>
            <div className="py-3 flex justify-between" id="rep-resp-rate">
              <span className="text-gray-500">Customer Response Conversion</span>
              <span className="font-bold text-teal-600">{report.summary.whatsappResponseRate}%</span>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50 border border-teal-100 rounded-xl flex items-center gap-2 text-[10px] text-teal-800" id="whatsapp-report-notice">
            <TrendingUp className="h-4 w-4 text-teal-600 shrink-0" />
            <span>GDPR compliance is maintained automatically. Subscribing customers can trigger opt-out instantly.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
