'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Eye, Clock, MousePointer, TrendingUp, Phone, Navigation, Globe, BarChart2 } from 'lucide-react';

interface DashboardData {
  overview: {
    totalVisitors: number;
    totalSessions: number;
    todayVisitors: number;
    weekVisitors: number;
    totalPageViews: number;
    avgSessionDuration: number;
  };
  topRestaurants: { id: string; name: string; totalViews: number; totalDirections: number; totalCalls: number; totalWebsiteClicks: number }[];
  conversions: { name: string; count: number }[];
  filterUsage: { name: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  recentEvents: { id: string; visitorId: string; type: string; name: string; page: string; restaurant?: string; timestamp: string }[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-center text-error">Failed to load analytics</div>;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <header className="bg-neutral-card border-b border-neutral-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/manage-2ad72e" className="p-2 -ml-2 hover:bg-neutral-bg rounded-lg"><ArrowLeft size={20} /></Link>
            <h1 className="font-bold text-lg">Analytics Dashboard</h1>
          </div>
          <Link href="/manage-2ad72e/analytics/charts" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
            <BarChart2 size={16} /> View Charts
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={<Users size={20} />} label="Total Visitors" value={data.overview.totalVisitors} />
          <StatCard icon={<Eye size={20} />} label="Page Views" value={data.overview.totalPageViews} />
          <StatCard icon={<TrendingUp size={20} />} label="Today" value={data.overview.todayVisitors} />
          <StatCard icon={<TrendingUp size={20} />} label="This Week" value={data.overview.weekVisitors} />
          <StatCard icon={<MousePointer size={20} />} label="Sessions" value={data.overview.totalSessions} />
          <StatCard icon={<Clock size={20} />} label="Avg Duration" value={formatDuration(data.overview.avgSessionDuration)} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Restaurants */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Top Restaurants (by views)</h2>
            <div className="space-y-3">
              {data.topRestaurants.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-secondary w-6">{i + 1}.</span>
                    <span className="font-medium">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-secondary">
                    <span className="flex items-center gap-1"><Eye size={14} /> {r.totalViews}</span>
                    <span className="flex items-center gap-1"><Navigation size={14} /> {r.totalDirections}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {r.totalCalls}</span>
                    <span className="flex items-center gap-1"><Globe size={14} /> {r.totalWebsiteClicks}</span>
                  </div>
                </div>
              ))}
              {data.topRestaurants.length === 0 && <p className="text-neutral-secondary text-sm">No data yet</p>}
            </div>
          </div>

          {/* Conversions */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Conversions (Actions Taken)</h2>
            <div className="space-y-3">
              {data.conversions.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="capitalize">{c.name.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-primary">{c.count}</span>
                </div>
              ))}
              {data.conversions.length === 0 && <p className="text-neutral-secondary text-sm">No conversions yet</p>}
            </div>
          </div>

          {/* Filter Usage */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Filter Usage (Last 7 Days)</h2>
            <div className="space-y-3">
              {data.filterUsage.map((f) => (
                <div key={f.name} className="flex items-center justify-between">
                  <span className="capitalize">{f.name}</span>
                  <span className="font-semibold">{f.count}</span>
                </div>
              ))}
              {data.filterUsage.length === 0 && <p className="text-neutral-secondary text-sm">No filter usage yet</p>}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Device Breakdown</h2>
            <div className="space-y-3">
              {data.deviceBreakdown.map((d) => (
                <div key={d.device} className="flex items-center justify-between">
                  <span className="capitalize">{d.device}</span>
                  <span className="font-semibold">{d.count}</span>
                </div>
              ))}
              {data.deviceBreakdown.length === 0 && <p className="text-neutral-secondary text-sm">No data yet</p>}
            </div>
          </div>
        </div>

        {/* Recent Events - Grouped by User */}
        <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-4">Recent Activity (by User)</h2>
          <div className="space-y-4">
            {Object.entries(
              data.recentEvents.reduce((acc, e) => {
                const key = e.visitorId;
                if (!acc[key]) acc[key] = [];
                acc[key].push(e);
                return acc;
              }, {} as Record<string, typeof data.recentEvents>)
            ).slice(0, 10).map(([visitorId, events]) => {
              const isExpanded = expandedUser === visitorId;
              const displayEvents = isExpanded ? events : events.slice(0, 4);
              
              return (
                <div 
                  key={visitorId} 
                  className={`border rounded-lg p-3 cursor-pointer transition ${isExpanded ? 'border-primary bg-primary/5' : 'border-neutral-border hover:border-primary/50'}`}
                  onClick={() => setExpandedUser(isExpanded ? null : visitorId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">User {visitorId.slice(-6)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-secondary">{events.length} actions</span>
                      <span className="text-xs text-neutral-secondary">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {displayEvents.map((e) => (
                      <div key={e.id} className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-secondary text-xs w-16">{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${e.type === 'conversion' ? 'bg-success/10 text-success' : e.type === 'page_view' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-bg'}`}>
                          {e.type === 'page_view' ? 'view' : e.type === 'conversion' ? 'convert' : 'filter'}
                        </span>
                        <span className="truncate flex-1">{e.name.replace(/_/g, ' ')}</span>
                        {e.restaurant && <span className="text-xs text-neutral-secondary truncate max-w-[120px]">{e.restaurant}</span>}
                      </div>
                    ))}
                  </div>
                  {!isExpanded && events.length > 4 && (
                    <p className="text-xs text-primary mt-2">Click to see {events.length - 4} more actions</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 text-neutral-secondary mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
