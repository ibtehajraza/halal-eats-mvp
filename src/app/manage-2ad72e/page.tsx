'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft, X, Lock, BarChart3 } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  website?: string;
  lat: number;
  lng: number;
  halalStatus: string;
  halalNote?: string;
  priceRange: number;
  rating?: number;
  photos: string[];
  cuisines: string[];
  features: string[];
  hours: { days: string; hours: string }[] | Record<string, string>;
}

const emptyRestaurant: Partial<Restaurant> = {
  name: '', slug: '', address: '', phone: '', website: '', lat: 45.4215, lng: -75.6972,
  halalStatus: 'self-reported', halalNote: '', priceRange: 2, rating: undefined,
  photos: [], cuisines: [], features: [], hours: [],
};

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    if (res.ok) onSuccess();
    else setError('Invalid credentials');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-neutral-card p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Lock className="text-white" size={24} />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center mb-6">Admin Login</h1>
        {error && <p className="text-error text-sm text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={creds.username}
          onChange={(e) => setCreds({ ...creds, username: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-border rounded-lg mb-3"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={creds.password}
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-border rounded-lg mb-4"
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [options, setOptions] = useState<{ cuisines: string[]; features: string[] }>({ cuisines: [], features: [] });
  const [editing, setEditing] = useState<Partial<Restaurant> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/check').then((r) => r.json()).then((d) => setAuthenticated(d.authenticated));
  }, []);

  const fetchData = async () => {
    const [resRes, optRes] = await Promise.all([fetch('/api/restaurants'), fetch('/api/options')]);
    setRestaurants(await resRes.json());
    setOptions(await optRes.json());
    setLoading(false);
  };

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated]);

  if (authenticated === null) return <div className="min-h-screen bg-neutral-bg flex items-center justify-center">Loading...</div>;
  if (!authenticated) return <LoginForm onSuccess={() => setAuthenticated(true)} />;

  const handleSave = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const hours = Array.isArray(editing.hours) ? editing.hours : Object.entries(editing.hours || {}).map(([days, hours]) => ({ days, hours }));
    
    const res = await fetch(isNew ? '/api/restaurants' : `/api/restaurants/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, hours }),
    });
    
    if (res.ok) {
      setEditing(null);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this restaurant?')) return;
    await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const updateField = (field: string, value: any) => setEditing((e) => e ? { ...e, [field]: value } : null);

  const toggleArray = (field: 'cuisines' | 'features', value: string) => {
    const arr = (editing?.[field] || []) as string[];
    updateField(field, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const updateHours = (index: number, key: 'days' | 'hours', value: string) => {
    const hours = Array.isArray(editing?.hours) ? [...editing.hours] : [];
    hours[index] = { ...hours[index], [key]: value };
    updateField('hours', hours);
  };

  const addHours = () => {
    const hours = Array.isArray(editing?.hours) ? [...editing.hours] : [];
    updateField('hours', [...hours, { days: '', hours: '' }]);
  };

  const removeHours = (index: number) => {
    const hours = Array.isArray(editing?.hours) ? [...editing.hours] : [];
    updateField('hours', hours.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-bg">
      <header className="bg-neutral-card border-b border-neutral-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 hover:bg-neutral-bg rounded-lg"><ArrowLeft size={20} /></Link>
            <h1 className="font-bold text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/manage-2ad72e/analytics" className="flex items-center gap-2 px-4 py-2 border border-neutral-border rounded-lg text-sm font-medium hover:bg-neutral-bg">
              <BarChart3 size={16} /> Analytics
            </Link>
            <button onClick={() => setEditing({ ...emptyRestaurant })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              <Plus size={16} /> Add Restaurant
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="bg-neutral-card rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-bg border-b border-neutral-border">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Address</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Cuisines</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id} className="border-b border-neutral-border hover:bg-neutral-bg/50">
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="p-4 text-neutral-secondary hidden md:table-cell">{r.address}</td>
                  <td className="p-4 text-neutral-secondary hidden sm:table-cell">{r.cuisines.slice(0, 2).join(', ')}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${r.halalStatus === 'verified' ? 'bg-success/10 text-success' : 'bg-accent/20 text-neutral-text'}`}>
                      {r.halalStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setEditing(r)} className="p-2 hover:bg-neutral-bg rounded-lg text-neutral-secondary hover:text-primary"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-neutral-bg rounded-lg text-neutral-secondary hover:text-error"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {restaurants.length === 0 && <div className="p-8 text-center text-neutral-secondary">No restaurants yet. Add one to get started.</div>}
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-card rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-4 border-b border-neutral-border">
              <h2 className="font-bold text-lg">{editing.id ? 'Edit' : 'Add'} Restaurant</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-neutral-bg rounded-lg"><X size={20} /></button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input value={editing.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input value={editing.slug || ''} onChange={(e) => updateField('slug', e.target.value)} placeholder="auto-generated" className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input value={editing.address || ''} onChange={(e) => updateField('address', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input value={editing.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input value={editing.website || ''} onChange={(e) => updateField('website', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude *</label>
                  <input type="number" step="any" value={editing.lat || ''} onChange={(e) => updateField('lat', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude *</label>
                  <input type="number" step="any" value={editing.lng || ''} onChange={(e) => updateField('lng', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Halal Status</label>
                  <select value={editing.halalStatus || 'self-reported'} onChange={(e) => updateField('halalStatus', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg">
                    <option value="verified">Verified</option>
                    <option value="self-reported">Self-Reported</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range</label>
                  <select value={editing.priceRange || 2} onChange={(e) => updateField('priceRange', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg">
                    <option value={1}>$ - Budget</option>
                    <option value={2}>$$ - Moderate</option>
                    <option value={3}>$$$ - Upscale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={editing.rating || ''} onChange={(e) => updateField('rating', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Halal Note</label>
                  <input value={editing.halalNote || ''} onChange={(e) => updateField('halalNote', e.target.value)} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Photo URL</label>
                  <input value={editing.photos?.[0] || ''} onChange={(e) => updateField('photos', e.target.value ? [e.target.value] : [])} className="w-full px-3 py-2 border border-neutral-border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {options.cuisines.map((c) => (
                    <button key={c} type="button" onClick={() => toggleArray('cuisines', c)} className={`px-3 py-1.5 rounded-full text-sm border transition ${editing.cuisines?.includes(c) ? 'bg-primary text-white border-primary' : 'border-neutral-border'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="flex flex-wrap gap-2">
                  {options.features.map((f) => (
                    <button key={f} type="button" onClick={() => toggleArray('features', f)} className={`px-3 py-1.5 rounded-full text-sm border transition ${editing.features?.includes(f) ? 'bg-primary text-white border-primary' : 'border-neutral-border'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Operating Hours</label>
                  <button type="button" onClick={addHours} className="text-sm text-primary hover:underline">+ Add Hours</button>
                </div>
                {(Array.isArray(editing.hours) ? editing.hours : []).map((h, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={h.days} onChange={(e) => updateHours(i, 'days', e.target.value)} placeholder="Mon-Fri" className="flex-1 px-3 py-2 border border-neutral-border rounded-lg text-sm" />
                    <input value={h.hours} onChange={(e) => updateHours(i, 'hours', e.target.value)} placeholder="9:00 AM - 10:00 PM" className="flex-1 px-3 py-2 border border-neutral-border rounded-lg text-sm" />
                    <button type="button" onClick={() => removeHours(i)} className="p-2 text-error hover:bg-error/10 rounded-lg"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-neutral-border">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-neutral-border rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Save Restaurant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
