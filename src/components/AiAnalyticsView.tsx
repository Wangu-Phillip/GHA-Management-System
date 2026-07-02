import React, { useState, useEffect } from 'react';
import { AiInsights, PredictionDay } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Sparkles, RefreshCw, AlertTriangle, Calendar, Send, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';

interface AiAnalyticsProps {
  guesthouseId: string;
  onNavigateToCampaign: (initialTemplate: string) => void;
}

export default function AiAnalyticsView({ guesthouseId, onNavigateToCampaign }: AiAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [chartMetric, setChartMetric] = useState<'occupancy' | 'revenue'>('occupancy');

  const fetchAiForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/ai-forecast?guesthouseId=${guesthouseId}`);
      if (response.ok) {
        const data = (await response.json()) as any;
        setInsights(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiForecast();
  }, [guesthouseId]);

  if (loading) {
    return (
      <div className="h-80 flex flex-col items-center justify-center gap-4" id="ai-loading">
        <div className="relative" id="ai-loading-container">
          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" id="ai-spinner" />
          <Sparkles className="h-4 w-4 text-amber-500 absolute -top-1 -right-1 animate-bounce" id="ai-sparkles" />
        </div>
        <div className="text-center space-y-1" id="ai-loading-desc">
          <p className="text-sm font-bold text-gray-700">Gemini Hospitality Intelligence is analyzing booking patterns...</p>
          <p className="text-xs text-gray-400">Synthesizing season factors, historical checkout rates and marketing opt-ins.</p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  // Identify low occupancy dates in the predictions (e.g. occupancy < 50%)
  const lowOccupancyDays = insights.predictions.filter((p) => p.predictedOccupancyRate < 50);

  return (
    <div className="space-y-6" id="ai-analytics-view">
      {/* Executive headers */}
      <div className="bg-gradient-to-r from-gray-950 to-indigo-950 p-6 rounded-2xl border border-gray-800 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-6" id="ai-header-card">
        <div className="space-y-2" id="ai-header-meta">
          <div className="flex items-center gap-2" id="ai-badge-block">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Gemini Pro Analytics
            </span>
          </div>
          <h3 className="text-lg font-bold tracking-tight">AI Booking & Revenue Forecast</h3>
          <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
            Our predictive engine parses previous customer pipelines and seasons to generate day-by-day occupancies and average guest value forecasts.
          </p>
        </div>

        <button
          onClick={fetchAiForecast}
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors self-start md:self-center shrink-0"
          id="re-forecast-btn"
        >
          <RefreshCw className="h-4 w-4" />
          Re-Analyze Ledger
        </button>
      </div>

      {/* Main interactive chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="ai-chart-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="ai-chart-header">
          <div id="ai-chart-title-block">
            <h4 className="font-semibold text-gray-900 text-sm">30-Day Forward Projection Timeline</h4>
            <p className="text-xs text-gray-400 mt-1">Starting today through upcoming 30 days</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-100 rounded-xl" id="ai-chart-toggles">
            <button
              onClick={() => setChartMetric('occupancy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartMetric === 'occupancy' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              id="toggle-occupancy"
            >
              Occupancy Rate (%)
            </button>
            <button
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartMetric === 'revenue' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              id="toggle-revenue"
            >
              Projected Revenue (BWP)
            </button>
          </div>
        </div>

        <div className="h-72 w-full" id="ai-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={insights.predictions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartMetric === 'occupancy' ? '#4F46E5' : '#10B981'} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={chartMetric === 'occupancy' ? '#4F46E5' : '#10B981'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(value) => [
                  chartMetric === 'occupancy' ? `${value}%` : `P${value}`,
                  chartMetric === 'occupancy' ? 'Occupancy Forecast' : 'Predicted Daily Revenue'
                ]}
              />
              <Area
                type="monotone"
                dataKey={chartMetric === 'occupancy' ? 'predictedOccupancyRate' : 'predictedRevenue'}
                stroke={chartMetric === 'occupancy' ? '#4F46E5' : '#10B981'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Narrative and Promotions Bento grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="ai-insights-grids">
        {/* Narratives card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4" id="ai-narrative-card">
          <div className="flex items-center gap-2 text-indigo-600" id="narrative-header">
            <Sparkles className="h-5 w-5" />
            <h4 className="font-semibold text-gray-900 text-sm">Gemini Executive Strategic Digest</h4>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100" id="digest-narrative">
            {insights.summaryText}
          </p>

          {/* Alerts panel */}
          {lowOccupancyDays.length > 0 && (
            <div className="border border-amber-100 bg-amber-50 rounded-2xl p-4 flex items-start gap-3" id="low-occupancy-alert">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-800" id="low-occupancy-alert-meta">
                <span className="font-bold">Low occupancy warnings identified</span>
                <p className="text-[11px] leading-relaxed text-amber-700/90">
                  Occupancy dips below 50% on these dates: {lowOccupancyDays.slice(0, 4).map((d) => d.date).join(', ')}. Action is advised.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actionable promotional suggestions card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between" id="ai-proposals-card">
          <div className="space-y-4" id="proposals-inner">
            <div className="flex items-center gap-1.5 text-indigo-600" id="proposals-header">
              <Lightbulb className="h-5 w-5" />
              <h4 className="font-semibold text-gray-900 text-sm">Low-Occupancy Campaigns</h4>
            </div>

            <p className="text-[11px] text-gray-400">Launch targeted WhatsApp promotions curated for low occupancy season blocks:</p>

            <div className="space-y-3" id="proposals-list">
              {insights.recommendedPromotions.map((p, idx) => {
                const title = p.split(':')[0] || 'Promo Offer';
                const body = p.substring(title.length + 1).trim();

                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-[11px] space-y-2 flex flex-col justify-between" id={`proposal-${idx}`}>
                    <div id={`proposal-text-${idx}`}>
                      <span className="font-bold text-gray-800 block">{title}</span>
                      <p className="text-gray-500 mt-1 leading-relaxed">{body}</p>
                    </div>
                    <button
                      onClick={() => onNavigateToCampaign(`Hi {{name}}! ${body}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1 mt-2 text-left shrink-0 cursor-pointer self-start"
                      id={`schedule-promo-btn-${idx}`}
                    >
                      <Send className="h-3 w-3" />
                      Draft WhatsApp Campaign
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
