'use client';
import Link from 'next/link';
import { MapPin, Navigation, Star, BadgeCheck, Clock, Heart } from 'lucide-react';
import { isOpenNow } from '@/lib/data';
import { useAnalytics } from '@/lib/analytics';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisines: string[];
  features: string[];
  halalStatus: string;
  priceRange: number;
  rating?: number;
  photos: string[];
  hours: Record<string, string>;
  lat: number;
  lng: number;
  distance: number;
}

interface Props {
  restaurant: Restaurant;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function RestaurantCard({ restaurant, selected, onSelect, compact, isFavorite, onToggleFavorite }: Props) {
  const open = isOpenNow(restaurant.hours);
  const { trackRestaurantView, trackConversion } = useAnalytics();

  const handleClick = () => {
    trackRestaurantView(restaurant.id, restaurant.name);
    onSelect?.();
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackConversion('directions_click', restaurant.id, restaurant.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`, '_blank');
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  if (compact) {
    return (
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-neutral-text">{restaurant.name}</h3>
            <p className="text-xs text-neutral-secondary">{restaurant.cuisines.slice(0, 2).join(' • ')}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${open ? 'bg-success/10 text-success' : 'bg-neutral-border text-neutral-secondary'}`}>
            {open ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-secondary">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {restaurant.distance.toFixed(1)} km
          </span>
          {restaurant.rating && (
            <span className="flex items-center gap-1">
              <Star size={12} className="text-accent fill-accent" /> {restaurant.rating}
            </span>
          )}
        </div>
        <Link
          href={`/restaurant/${restaurant.slug}`}
          className="mt-2 block text-center text-sm text-primary font-medium hover:underline"
        >
          View Details
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      onClick={handleClick}
      className={`block bg-neutral-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border-2 ${
        selected ? 'border-primary' : 'border-transparent'
      }`}
    >
      {/* Image */}
      <div className="relative h-40 bg-neutral-border">
        {restaurant.photos[0] && (
          <img src={restaurant.photos[0]} alt={restaurant.name} className="w-full h-full object-cover" />
        )}
        {/* Halal Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          restaurant.halalStatus === 'verified' ? 'bg-success text-white' : 'bg-accent text-neutral-text'
        }`}>
          <BadgeCheck size={14} />
          {restaurant.halalStatus === 'verified' ? 'Halal Verified' : 'Self-Reported'}
        </div>
        {/* Price */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={handleFavorite}
              className={`p-1.5 rounded-full backdrop-blur transition ${isFavorite ? 'bg-primary text-white' : 'bg-white/90 text-neutral-secondary hover:text-primary'}`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
            {'$'.repeat(restaurant.priceRange)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-neutral-text leading-tight">{restaurant.name}</h3>
          {restaurant.rating && (
            <span className="flex items-center gap-1 text-sm font-medium">
              <Star size={16} className="text-accent fill-accent" /> {restaurant.rating}
            </span>
          )}
        </div>

        <p className="text-sm text-neutral-secondary mt-1">{restaurant.cuisines.join(' • ')}</p>

        <div className="flex items-center gap-4 mt-3 text-sm text-neutral-secondary">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {restaurant.distance.toFixed(1)} km
          </span>
          <span className={`flex items-center gap-1 ${open ? 'text-success' : 'text-neutral-secondary'}`}>
            <Clock size={14} /> {open ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {restaurant.features.slice(0, 3).map((f) => (
            <span key={f} className="text-xs px-2 py-1 bg-neutral-bg rounded-full text-neutral-secondary">
              {f}
            </span>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
          >
            <Navigation size={14} /> Directions
          </button>
        </div>
      </div>
    </Link>
  );
}
