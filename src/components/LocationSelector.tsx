'use client';
import { useState } from 'react';
import { MapPin, X, Search, Locate } from 'lucide-react';

interface Props {
  userLocation: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

const OTTAWA_CENTER = { lat: 45.4215, lng: -75.6972 };

export default function LocationSelector({ userLocation, onLocationChange }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestGeolocation = () => {
    setLoading(true);
    setError('');
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        onLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setShowModal(false);
        setLoading(false);
      },
      () => {
        setError('Location access denied. Please enter an address.');
        setLoading(false);
      }
    );
  };

  const searchAddress = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError('');

    try {
      // Using OpenStreetMap Nominatim (free, no API key)
      const query = encodeURIComponent(`${address}, Ottawa, ON, Canada`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();

      if (data.length > 0) {
        onLocationChange({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setShowModal(false);
        setAddress('');
      } else {
        setError('Address not found. Try a different address.');
      }
    } catch {
      setError('Failed to search address. Please try again.');
    }
    setLoading(false);
  };

  const isDefaultLocation = userLocation.lat === OTTAWA_CENTER.lat && userLocation.lng === OTTAWA_CENTER.lng;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm border border-neutral-border bg-white hover:border-primary transition"
      >
        <MapPin size={16} className={isDefaultLocation ? 'text-neutral-secondary' : 'text-primary'} />
        <span className="hidden sm:inline">{isDefaultLocation ? 'Set Location' : 'Change Location'}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-neutral-border">
              <h2 className="font-semibold">Set Your Location</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-bg rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Use Current Location */}
              <button
                onClick={requestGeolocation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
              >
                <Locate size={18} />
                {loading ? 'Getting location...' : 'Use My Current Location'}
              </button>

              <div className="flex items-center gap-3 text-neutral-secondary text-sm">
                <div className="flex-1 h-px bg-neutral-border" />
                <span>or enter an address</span>
                <div className="flex-1 h-px bg-neutral-border" />
              </div>

              {/* Address Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                  placeholder="Enter address or intersection"
                  className="flex-1 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:border-primary"
                />
                <button
                  onClick={searchAddress}
                  disabled={loading || !address.trim()}
                  className="px-4 py-3 bg-neutral-bg rounded-lg hover:bg-neutral-border transition disabled:opacity-50"
                >
                  <Search size={20} />
                </button>
              </div>

              {error && <p className="text-error text-sm">{error}</p>}

              <p className="text-xs text-neutral-secondary">
                Examples: "Rideau Centre", "Bank St & Somerset", "123 Main Street"
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
