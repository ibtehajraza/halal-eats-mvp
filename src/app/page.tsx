'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDistance, isOpenNow } from '@/lib/data';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import RestaurantCard from '@/components/RestaurantCard';
import MapView from '@/components/MapView';
import LocationSelector from '@/components/LocationSelector';
import { List, Map as MapIcon, Search, X, TrendingUp, Sparkles, Heart } from 'lucide-react';

const OTTAWA_CENTER = { lat: 45.4215, lng: -75.6972 };

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisines: string[];
  features: string[];
  address: string;
  phone: string;
  lat: number;
  lng: number;
  halalStatus: string;
  halalNote?: string;
  priceRange: number;
  rating?: number;
  photos: string[];
  hours: Record<string, string>;
  totalViews?: number;
  createdAt?: string;
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('visitor_id') || '';
}

export default function Home() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState(OTTAWA_CENTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [trending, setTrending] = useState<Restaurant[]>([]);
  const [newThisWeek, setNewThisWeek] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [options, setOptions] = useState({ cuisines: [] as string[], features: [] as string[] });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | 'trending' | 'new' | 'favorites'>('all');
  const [filters, setFilters] = useState({
    cuisines: [] as string[],
    radius: 25,
    features: [] as string[],
    openNow: false,
    priceRange: [] as number[],
  });

  useEffect(() => {
    fetch('/api/restaurants').then((r) => r.json()).then(setRestaurants);
    fetch('/api/restaurants?filter=trending').then((r) => r.json()).then((data) => setTrending(data.slice(0, 6)));
    fetch('/api/restaurants?filter=new').then((r) => r.json()).then(setNewThisWeek);
    fetch('/api/options').then((r) => r.json()).then(setOptions);
    
    const visitorId = getVisitorId();
    if (visitorId) {
      fetch(`/api/favorites?visitorId=${visitorId}`).then((r) => r.json()).then(setFavorites);
    }

    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const toggleFavorite = async (restaurantId: string) => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, restaurantId }),
    });
    const { favorited } = await res.json();
    setFavorites((prev) => favorited ? [...prev, restaurantId] : prev.filter((id) => id !== restaurantId));
  };

  const filtered = useMemo(() => {
    let list = restaurants;

    // Section filter
    if (activeSection === 'trending') list = trending;
    else if (activeSection === 'new') list = newThisWeek;
    else if (activeSection === 'favorites') list = restaurants.filter((r) => favorites.includes(r.id));

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
        r.address.toLowerCase().includes(q)
      );
    }

    return list
      .map((r) => ({ ...r, distance: getDistance(userLocation.lat, userLocation.lng, r.lat, r.lng) }))
      .filter((r) => {
        if (activeSection !== 'all' && activeSection !== 'favorites') return true; // Skip filters for sections
        if (r.distance > filters.radius) return false;
        if (filters.cuisines.length && !filters.cuisines.some((c) => r.cuisines.includes(c))) return false;
        if (filters.features.length && !filters.features.every((f) => r.features.includes(f))) return false;
        if (filters.openNow && !isOpenNow(r.hours)) return false;
        if (filters.priceRange.length && !filters.priceRange.includes(r.priceRange)) return false;
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [filters, userLocation, restaurants, trending, newThisWeek, favorites, searchQuery, activeSection]);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const radiusOptions = [1, 3, 5, 10, 25];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="bg-neutral-card border-b border-neutral-border px-4 py-3">
          <div className="max-w-2xl mx-auto relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish, cuisine, or restaurant name..."
              className="w-full pl-10 pr-10 py-2.5 border border-neutral-border rounded-lg focus:outline-none focus:border-primary"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-text">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-neutral-card border-b border-neutral-border px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 max-w-7xl mx-auto">
            {[
              { id: 'all', label: 'All', icon: null },
              { id: 'trending', label: 'Trending', icon: <TrendingUp size={14} /> },
              { id: 'new', label: 'New This Week', icon: <Sparkles size={14} /> },
              { id: 'favorites', label: 'Favorites', icon: <Heart size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeSection === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-neutral-bg text-neutral-secondary hover:text-neutral-text'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.id === 'favorites' && favorites.length > 0 && (
                  <span className="ml-1 bg-white/20 px-1.5 rounded-full text-xs">{favorites.length}</span>
                )}
                {tab.id === 'new' && newThisWeek.length > 0 && (
                  <span className="ml-1 bg-white/20 px-1.5 rounded-full text-xs">{newThisWeek.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'all' && (
          <FilterBar 
            filters={filters} 
            updateFilter={updateFilter}
            cuisineTypes={options.cuisines}
            featureOptions={options.features}
            radiusOptions={radiusOptions}
          />
        )}

        <div className="sticky top-0 z-20 bg-neutral-bg border-b border-neutral-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-secondary">{filtered.length} restaurants</span>
            <LocationSelector userLocation={userLocation} onLocationChange={setUserLocation} />
          </div>
          <div className="flex bg-neutral-card rounded-lg p-1 shadow-sm">
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${view === 'list' ? 'bg-primary text-white' : 'text-neutral-secondary hover:text-neutral-text'}`}>
              <List size={16} /> List
            </button>
            <button onClick={() => setView('map')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${view === 'map' ? 'bg-primary text-white' : 'text-neutral-secondary hover:text-neutral-text'}`}>
              <MapIcon size={16} /> Map
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {view === 'list' ? (
            <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {filtered.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r as any}
                  selected={selectedId === r.id}
                  onSelect={() => setSelectedId(r.id)}
                  isFavorite={favorites.includes(r.id)}
                  onToggleFavorite={() => toggleFavorite(r.id)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-neutral-secondary">
                  {activeSection === 'favorites' ? 'No favorites yet. Click the heart icon to save restaurants.' :
                   activeSection === 'new' ? 'No new restaurants this week.' :
                   'No restaurants match your search.'}
                </div>
              )}
            </div>
          ) : (
            <MapView restaurants={filtered as any} userLocation={userLocation} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </div>
      </main>
    </div>
  );
}
