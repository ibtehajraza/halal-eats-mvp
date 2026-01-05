'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Restaurant } from '@/lib/data';
import RestaurantCard from './RestaurantCard';

const customIcon = (active: boolean) => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:${active ? '#8E0000' : '#C62828'};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg) ${active ? 'scale(1.2)' : ''};box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapController({ center, selectedId, restaurants }: { center: [number, number]; selectedId: string | null; restaurants: (Restaurant & { distance: number })[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedId) {
      const r = restaurants.find((r) => r.id === selectedId);
      if (r) map.flyTo([r.lat, r.lng], 14);
    }
  }, [selectedId, map, restaurants]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const bounds = L.latLngBounds(restaurants.map((r) => [r.lat, r.lng]));
      bounds.extend(center);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [restaurants, center, map]);

  return null;
}

interface Props {
  restaurants: (Restaurant & { distance: number })[];
  userLocation: { lat: number; lng: number };
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function MapView({ restaurants, userLocation, selectedId, onSelect }: Props) {
  const center: [number, number] = [userLocation.lat, userLocation.lng];

  return (
    <div className="relative h-[calc(100vh-200px)] min-h-[400px]">
      <MapContainer center={center} zoom={12} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} selectedId={selectedId} restaurants={restaurants} />
        
        {restaurants.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={customIcon(r.id === selectedId)}
            eventHandlers={{ click: () => onSelect(r.id) }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <RestaurantCard restaurant={r} compact />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedId && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-lg z-[1000]">
          <button
            onClick={() => onSelect(null)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-neutral-bg rounded-full text-neutral-secondary hover:text-neutral-text z-10"
          >
            ×
          </button>
          <RestaurantCard restaurant={restaurants.find((r) => r.id === selectedId)!} compact />
        </div>
      )}
    </div>
  );
}
