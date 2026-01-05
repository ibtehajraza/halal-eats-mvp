'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface ChartData {
  daily: { date: string; visitors: number; sessions: number; pageViews: number; conversions: number; filterUses: number; avgDuration: number }[];
  weekly: typeof ChartData.prototype.daily;
  hourly: { hour: number; sessions: number; pageViews: number }[];
  devices: { name: string; value: number }[];
  eventTypes: { name: string; value: number }[];
}

const COLORS = ['#C62828', '#F4B400', '#2E7D32', '#1976D2', '#7B1FA2'];

export default function ChartsPage() {
  const [data, setData] = useState<ChartData | null>(null);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/charts?range=${range}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className="p-8 text-center">Loading charts...</div>;
  if (!data) return <div className="p-8 text-center text-error">Failed to load data</div>;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatHour = (hour: number) => {
    return hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <header className="bg-neutral-card border-b border-neutral-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/manage-2ad72e/analytics" className="p-2 -ml-2 hover:bg-neutral-bg rounded-lg"><ArrowLeft size={20} /></Link>
            <h1 className="font-bold text-lg">Analytics Charts</h1>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${range === r ? 'bg-primary text-white' : 'bg-neutral-bg hover:bg-neutral-border'}`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Visitors & Sessions Over Time */}
        <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-4">Visitors & Sessions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip labelFormatter={formatDate} />
              <Legend />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#C62828" fill="#C62828" fillOpacity={0.2} />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#1976D2" fill="#1976D2" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Page Views & Conversions */}
        <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-4">Page Views & Conversions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip labelFormatter={formatDate} />
              <Legend />
              <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#F4B400" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#2E7D32" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Session Duration */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Avg Session Duration (seconds)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={formatDate} />
                <Bar dataKey="avgDuration" name="Avg Duration" fill="#7B1FA2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Filter Usage */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Filter Usage</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={formatDate} />
                <Bar dataKey="filterUses" name="Filter Uses" fill="#1976D2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Distribution */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Activity by Hour</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" tickFormatter={formatHour} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(h) => formatHour(h as number)} />
                <Legend />
                <Bar dataKey="sessions" name="Sessions" fill="#C62828" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pageViews" name="Page Views" fill="#F4B400" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Device & Event Breakdown */}
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Device Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.devices}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.devices.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Summary */}
        {data.weekly.length > 1 && (
          <div className="bg-neutral-card rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-4">Weekly Summary</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tickFormatter={(d) => `Week of ${formatDate(d)}`} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(d) => `Week of ${formatDate(d)}`} />
                <Legend />
                <Bar dataKey="visitors" name="Visitors" fill="#C62828" />
                <Bar dataKey="pageViews" name="Page Views" fill="#F4B400" />
                <Bar dataKey="conversions" name="Conversions" fill="#2E7D32" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}
