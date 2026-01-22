'use client';
import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useAnalytics } from '@/lib/analytics';

interface FilterBarProps {
  filters: {
    cuisines: string[];
    radius: number;
    features: string[];
    openNow: boolean;
    priceRange: number[];
  };
  updateFilter: (key: string, value: any) => void;
  cuisineTypes: string[];
  featureOptions: string[];
  radiusOptions: number[];
}

export default function FilterBar({ filters, updateFilter, cuisineTypes, featureOptions, radiusOptions }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { trackFilter } = useAnalytics();

  const toggleArrayFilter = (key: string, value: string | number) => {
    const arr = filters[key as keyof typeof filters] as (string | number)[];
    const newValue = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    updateFilter(key, newValue);
    trackFilter(key, newValue);
  };

  const handleRadiusChange = (value: number) => {
    updateFilter('radius', value);
    trackFilter('radius', value);
  };

  const handleOpenNowToggle = () => {
    const newValue = !filters.openNow;
    updateFilter('openNow', newValue);
    trackFilter('openNow', newValue);
  };

  const activeCount = filters.cuisines.length + filters.features.length + filters.priceRange.length + (filters.openNow ? 1 : 0);

  return (
    <div className="bg-neutral-card border-b border-neutral-border">
      {/* Mobile Filter Toggle */}
      <div className="px-4 py-3 flex items-center gap-3 overflow-x-auto md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition whitespace-nowrap ${
            activeCount > 0 ? 'bg-primary text-white border-primary' : 'border-neutral-border text-neutral-text'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>

        {/* Quick Radius Selector */}
        <select
          value={filters.radius}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="px-3 py-2 rounded-full text-sm border border-neutral-border bg-white"
        >
          {radiusOptions.map((r) => (
            <option key={r} value={r}>{r} km</option>
          ))}
        </select>

        {/* Open Now Quick Toggle */}
        <button
          onClick={handleOpenNowToggle}
          className={`px-3 py-2 rounded-full text-sm font-medium border transition whitespace-nowrap ${
            filters.openNow ? 'bg-success text-white border-success' : 'border-neutral-border text-neutral-text'
          }`}
        >
          Open Now
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex px-4 py-3 gap-3 items-center flex-wrap">
        {/* Cuisine Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-border text-sm hover:border-primary transition">
            Cuisine {filters.cuisines.length > 0 && <span className="bg-primary text-white text-xs px-1.5 rounded-full">{filters.cuisines.length}</span>}
            <ChevronDown size={16} />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-border p-2 min-w-[200px] hidden group-hover:block z-30">
            {cuisineTypes.map((c) => (
              <label key={c} className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-bg rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.cuisines.includes(c)}
                  onChange={() => toggleArrayFilter('cuisines', c)}
                  className="accent-primary"
                />
                <span className="text-sm">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Radius */}
        <select
          value={filters.radius}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="px-4 py-2 rounded-lg text-sm border border-neutral-border bg-white hover:border-primary transition cursor-pointer"
        >
          {radiusOptions.map((r) => (
            <option key={r} value={r}>Within {r} km</option>
          ))}
        </select>

        {/* Features */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-border text-sm hover:border-primary transition">
            Features {filters.features.length > 0 && <span className="bg-primary text-white text-xs px-1.5 rounded-full">{filters.features.length}</span>}
            <ChevronDown size={16} />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-border p-2 min-w-[180px] hidden group-hover:block z-30">
            {featureOptions.map((f) => (
              <label key={f} className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-bg rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.features.includes(f)}
                  onChange={() => toggleArrayFilter('features', f)}
                  className="accent-primary"
                />
                <span className="text-sm">{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => toggleArrayFilter('priceRange', p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                filters.priceRange.includes(p) ? 'bg-primary text-white border-primary' : 'border-neutral-border hover:border-primary'
              }`}
            >
              {'$'.repeat(p)}
            </button>
          ))}
        </div>

        {/* Open Now */}
        <button
          onClick={handleOpenNowToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            filters.openNow ? 'bg-success text-white border-success' : 'border-neutral-border hover:border-success'
          }`}
        >
          Open Now
        </button>

        {/* Clear Filters */}
        {activeCount > 0 && (
          <button
            onClick={() => {
              updateFilter('cuisines', []);
              updateFilter('features', []);
              updateFilter('priceRange', []);
              updateFilter('openNow', false);
            }}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      {/* Mobile Expanded Filters */}
      {showFilters && (
        <div className="md:hidden px-4 pb-4 space-y-4 border-t border-neutral-border pt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleArrayFilter('cuisines', c)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    filters.cuisines.includes(c) ? 'bg-primary text-white border-primary' : 'border-neutral-border'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleArrayFilter('features', f)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    filters.features.includes(f) ? 'bg-primary text-white border-primary' : 'border-neutral-border'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <div className="flex gap-2">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => toggleArrayFilter('priceRange', p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                    filters.priceRange.includes(p) ? 'bg-primary text-white border-primary' : 'border-neutral-border'
                  }`}
                >
                  {'$'.repeat(p)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
