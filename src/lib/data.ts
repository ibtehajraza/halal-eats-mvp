export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisines: string[];
  address: string;
  city: string;
  phone: string;
  website?: string;
  lat: number;
  lng: number;
  halalStatus: 'verified' | 'self-reported';
  halalNote?: string;
  priceRange: 1 | 2 | 3;
  rating?: number;
  features: string[];
  hours: { [key: string]: string };
  photos: string[];
}

export const cuisineTypes = [
  'Desi', 'Arabic', 'Moroccan', 'Turkish', 'Afghan', 
  'Middle Eastern', 'Fast Food', 'Fusion', 'Somali', 'Lebanese'
] as const;

export const featureOptions = [
  'Dine-in', 'Takeout', 'Delivery', 'Family-friendly', 'Catering'
] as const;

export const radiusOptions = [1, 3, 5, 10, 25] as const;

// Sample Ottawa restaurants data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Shawarma Palace',
    slug: 'shawarma-palace-rideau',
    cuisines: ['Middle Eastern', 'Lebanese'],
    address: '464 Rideau St',
    city: 'ottawa',
    phone: '(613) 789-4747',
    lat: 45.4315,
    lng: -75.6842,
    halalStatus: 'verified',
    halalNote: 'All meat is halal certified',
    priceRange: 1,
    rating: 4.5,
    features: ['Dine-in', 'Takeout', 'Delivery'],
    hours: { 'Mon-Sun': '11:00 AM - 12:00 AM' },
    photos: ['https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800'],
  },
  {
    id: '2',
    name: 'Mango Lassi',
    slug: 'mango-lassi-bank',
    cuisines: ['Desi', 'Pakistani'],
    address: '1000 Bank St',
    city: 'ottawa',
    phone: '(613) 234-5678',
    lat: 45.3975,
    lng: -75.6775,
    halalStatus: 'verified',
    halalNote: 'Halal certified meat supplier',
    priceRange: 2,
    rating: 4.3,
    features: ['Dine-in', 'Takeout', 'Family-friendly'],
    hours: { 'Mon-Thu': '11:00 AM - 10:00 PM', 'Fri-Sun': '11:00 AM - 11:00 PM' },
    photos: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
  },
  {
    id: '3',
    name: 'Fairouz Cafe',
    slug: 'fairouz-cafe-somerset',
    cuisines: ['Arabic', 'Lebanese', 'Middle Eastern'],
    address: '343 Somerset St W',
    city: 'ottawa',
    phone: '(613) 232-1111',
    lat: 45.4165,
    lng: -75.7015,
    halalStatus: 'verified',
    priceRange: 3,
    rating: 4.7,
    features: ['Dine-in', 'Takeout', 'Catering'],
    hours: { 'Tue-Sun': '5:00 PM - 10:00 PM', 'Mon': 'Closed' },
    photos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800'],
  },
  {
    id: '4',
    name: 'Burgers n Fries Forever',
    slug: 'bnff-elgin',
    cuisines: ['Fast Food', 'Fusion'],
    address: '331 Elgin St',
    city: 'ottawa',
    phone: '(613) 695-2633',
    lat: 45.4175,
    lng: -75.6885,
    halalStatus: 'verified',
    halalNote: 'Halal beef and chicken',
    priceRange: 2,
    rating: 4.2,
    features: ['Dine-in', 'Takeout', 'Delivery'],
    hours: { 'Mon-Sun': '11:00 AM - 10:00 PM' },
    photos: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'],
  },
  {
    id: '5',
    name: 'Kabab Village',
    slug: 'kabab-village-carling',
    cuisines: ['Afghan', 'Middle Eastern'],
    address: '1450 Carling Ave',
    city: 'ottawa',
    phone: '(613) 722-5555',
    lat: 45.3835,
    lng: -75.7365,
    halalStatus: 'verified',
    priceRange: 2,
    rating: 4.4,
    features: ['Dine-in', 'Takeout', 'Family-friendly', 'Catering'],
    hours: { 'Mon-Sun': '11:30 AM - 10:00 PM' },
    photos: ['https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800'],
  },
  {
    id: '6',
    name: 'Turkish Kitchen',
    slug: 'turkish-kitchen-preston',
    cuisines: ['Turkish', 'Middle Eastern'],
    address: '350 Preston St',
    city: 'ottawa',
    phone: '(613) 565-1234',
    lat: 45.4025,
    lng: -75.7125,
    halalStatus: 'self-reported',
    halalNote: 'Owner states all meat is halal',
    priceRange: 2,
    rating: 4.1,
    features: ['Dine-in', 'Takeout'],
    hours: { 'Tue-Sun': '12:00 PM - 9:00 PM', 'Mon': 'Closed' },
    photos: ['https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800'],
  },
  {
    id: '7',
    name: 'Marrakech Restaurant',
    slug: 'marrakech-dalhousie',
    cuisines: ['Moroccan', 'Arabic'],
    address: '45 Dalhousie St',
    city: 'ottawa',
    phone: '(613) 241-8888',
    lat: 45.4285,
    lng: -75.6925,
    halalStatus: 'verified',
    priceRange: 3,
    rating: 4.6,
    features: ['Dine-in', 'Catering', 'Family-friendly'],
    hours: { 'Wed-Mon': '5:00 PM - 10:00 PM', 'Tue': 'Closed' },
    photos: ['https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800'],
  },
  {
    id: '8',
    name: 'Somali Kitchen',
    slug: 'somali-kitchen-gladstone',
    cuisines: ['Somali', 'African'],
    address: '890 Gladstone Ave',
    city: 'ottawa',
    phone: '(613) 555-0123',
    lat: 45.4055,
    lng: -75.7245,
    halalStatus: 'verified',
    halalNote: 'All meat halal certified',
    priceRange: 1,
    rating: 4.3,
    features: ['Dine-in', 'Takeout', 'Family-friendly'],
    hours: { 'Mon-Sat': '10:00 AM - 9:00 PM', 'Sun': '12:00 PM - 8:00 PM' },
    photos: ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800'],
  },
];

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function isOpenNow(hours: Record<string, string>): boolean {
  const day = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  return !Object.entries(hours).some(([k, v]) => k.includes(day) && v === 'Closed');
}
