import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, Phone, Globe, Clock, Navigation, BadgeCheck, ArrowLeft, Star } from 'lucide-react';
import { TrackRestaurantView, ConversionButton } from '@/components/TrackingComponents';

export async function generateStaticParams() {
  const restaurants = await prisma.restaurant.findMany({ select: { slug: true } });
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: { cuisines: { include: { cuisine: true } } },
  });
  if (!restaurant) return { title: 'Not Found' };
  return {
    title: `${restaurant.name} | Halal Eats Ottawa`,
    description: `${restaurant.name} - ${restaurant.cuisines.map((c) => c.cuisine.name).join(', ')} halal restaurant in Ottawa. ${restaurant.address}`,
  };
}

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      cuisines: { include: { cuisine: true } },
      features: { include: { feature: true } },
      hours: true,
    },
  }) as any;
  
  if (!restaurant) notFound();

  const cuisines = restaurant.cuisines.map((c) => c.cuisine.name);
  const features = restaurant.features.map((f) => f.feature.name);
  const hours = restaurant.hours;

  return (
    <div className="min-h-screen bg-neutral-bg">
      <TrackRestaurantView restaurantId={restaurant.id} restaurantName={restaurant.name} />
      
      {/* Header */}
      <header className="bg-neutral-card border-b border-neutral-border sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 hover:bg-neutral-bg rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-lg truncate">{restaurant.name}</h1>
        </div>
      </header>

      {/* Hero Image */}
      <div className="h-56 md:h-72 bg-neutral-border relative">
        {restaurant.photos[0] && (
          <img src={restaurant.photos[0]} alt={restaurant.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 pb-8">
        <div className="bg-neutral-card rounded-xl shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="p-6 border-b border-neutral-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-text">{restaurant.name}</h1>
                <p className="text-neutral-secondary mt-1">{cuisines.join(' • ')}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {restaurant.rating && (
                  <span className="flex items-center gap-1 text-lg font-semibold">
                    <Star size={20} className="text-accent fill-accent" /> {restaurant.rating}
                  </span>
                )}
                <span className="text-sm font-medium">{'$'.repeat(restaurant.priceRange)}</span>
              </div>
            </div>

            {/* Halal Badge */}
            <div className={`inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg ${
              restaurant.halalStatus === 'verified' ? 'bg-success/10 text-success' : 'bg-accent/20 text-neutral-text'
            }`}>
              <BadgeCheck size={18} />
              <div>
                <span className="font-medium">
                  {restaurant.halalStatus === 'verified' ? 'Halal Verified' : 'Self-Reported Halal'}
                </span>
                {restaurant.halalNote && (
                  <p className="text-sm opacity-80">{restaurant.halalNote}</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-4">
              {features.map((f) => (
                <span key={f} className="text-sm px-3 py-1 bg-neutral-bg rounded-full text-neutral-secondary">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-neutral-secondary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{restaurant.address}</p>
                <p className="text-sm text-neutral-secondary">Ottawa, ON</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={20} className="text-neutral-secondary shrink-0" />
              <a href={`tel:${restaurant.phone}`} className="text-primary hover:underline">
                {restaurant.phone}
              </a>
            </div>

            {restaurant.website && (
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-neutral-secondary shrink-0" />
                <a href={restaurant.website} target="_blank" rel="noopener" className="text-primary hover:underline">
                  Visit Website
                </a>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-neutral-secondary mt-0.5 shrink-0" />
              <div className="space-y-1">
                {hours.map((h) => (
                  <div key={h.id} className="flex gap-4">
                    <span className="text-neutral-secondary w-24">{h.days}</span>
                    <span className={h.hours === 'Closed' ? 'text-error' : ''}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Menu */}
          {Array.isArray(restaurant.menu) && restaurant.menu.length > 0 && (
            <div className="p-6 border-t border-neutral-border">
              <h2 className="font-semibold text-lg mb-4">Menu Highlights</h2>
              <div className="space-y-2">
                {(restaurant.menu as { item: string; price: number }[]).map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-border last:border-0">
                    <span>{m.item}</span>
                    <span className="font-medium text-primary">${m.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="h-48 bg-neutral-border">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'YOUR_KEY'}&q=${encodeURIComponent(restaurant.name + ' ' + restaurant.address + ' Ottawa')}`}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* CTAs */}
          <div className="p-6 flex flex-col sm:flex-row gap-3">
            <ConversionButton
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              action="directions_click"
              href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
            >
              <Navigation size={18} /> Get Directions
            </ConversionButton>
            <ConversionButton
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              action="call_click"
              href={`tel:${restaurant.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
            >
              <Phone size={18} /> Call Restaurant
            </ConversionButton>
          </div>
        </div>
      </main>
    </div>
  );
}
