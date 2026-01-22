// Static restaurant data for lean POC deployment (no database required)
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisines: string[];
  address: string;
  phone: string;
  website?: string;
  lat: number;
  lng: number;
  halalStatus: string;
  halalNote?: string;
  priceRange: number;
  rating?: number;
  features: string[];
  hours: { days: string; hours: string }[];
  photos: string[];
  menu: { item: string; price: number }[];
  createdAt: string;
}

export const cuisines = [
  'Desi', 'Arabic', 'Moroccan', 'Turkish', 'Afghan', 'Middle Eastern',
  'Fast Food', 'Fusion', 'Somali', 'Lebanese', 'Pakistani', 'African',
  'Mediterranean', 'Greek', 'Persian', 'Indian', 'Portuguese', 'Burgers',
  'Yemeni', 'Egyptian', 'Bangladeshi', 'Malaysian', 'Indonesian', 'Asian',
  'Seafood', 'Dessert', 'Bakery', 'Syrian'
];

export const features = ['Dine-in', 'Takeout', 'Delivery', 'Family-friendly', 'Catering', 'Late Night', 'Breakfast', 'Market'];

// Generate stable IDs from slugs
const makeId = (slug: string) => slug;

export const restaurants: Restaurant[] = [
  {
    id: makeId("shawarma-palace-rideau"),
    name: "Shawarma Palace",
    slug: "shawarma-palace-rideau",
    cuisines: ["Middle Eastern", "Lebanese"],
    address: "464 Rideau St",
    phone: "(613) 789-4747",
    website: "https://shawarmapalace.ca",
    lat: 45.4315, lng: -75.6842,
    halalStatus: "verified",
    halalNote: "All meat is halal certified",
    priceRange: 1, rating: 4.5,
    features: ["Dine-in", "Takeout", "Delivery", "Late Night"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 2:00 AM" }],
    photos: ["https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800"],
    menu: [
      { item: "Chicken Shawarma Wrap", price: 9.99 },
      { item: "Beef Shawarma Plate", price: 15.99 },
      { item: "Falafel Wrap", price: 8.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("pita-bell-kabab"),
    name: "Pita Bell Kabab",
    slug: "pita-bell-kabab",
    cuisines: ["Turkish", "Mediterranean"],
    address: "1696 Carling Ave",
    phone: "(613) 686-1740",
    website: "https://www.pitabellkabab.com",
    lat: 45.3815, lng: -75.7620,
    halalStatus: "verified",
    halalNote: "100% Halal meat",
    priceRange: 2, rating: 4.6,
    features: ["Dine-in", "Takeout", "Family-friendly"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"],
    menu: [
      { item: "Adana Kebab", price: 18.99 },
      { item: "Mixed Grill", price: 24.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("mezbaan-restaurant"),
    name: "Mezbaan Restaurant",
    slug: "mezbaan-restaurant",
    cuisines: ["Afghan", "Middle Eastern"],
    address: "3098 Carling Ave Unit 8, Nepean",
    phone: "(613) 854-3500",
    website: "https://mezbaan.restaurant",
    lat: 45.3520, lng: -75.8015,
    halalStatus: "verified",
    halalNote: "Authentic Afghan halal cuisine",
    priceRange: 2, rating: 4.5,
    features: ["Dine-in", "Takeout", "Delivery", "Family-friendly"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 11:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
    menu: [
      { item: "Kabuli Pulao", price: 16.99 },
      { item: "Lamb Kabab", price: 19.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("les-grillades"),
    name: "Les Grillades",
    slug: "les-grillades",
    cuisines: ["Lebanese", "Middle Eastern"],
    address: "111 Colonnade Rd, Nepean",
    phone: "(613) 723-3224",
    website: "https://lesgrillades.ca",
    lat: 45.3455, lng: -75.7625,
    halalStatus: "verified",
    halalNote: "Premium halal Lebanese cuisine",
    priceRange: 2, rating: 4.8,
    features: ["Dine-in", "Takeout", "Catering", "Family-friendly"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
    menu: [
      { item: "Mixed Grill", price: 26.99 },
      { item: "Chicken Taouk", price: 18.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("aroma-indian-cuisine"),
    name: "Aroma Indian Cuisine",
    slug: "aroma-indian-cuisine",
    cuisines: ["Indian", "Desi"],
    address: "210 Somerset Street West",
    phone: "(613) 567-4634",
    website: "https://www.aromaindiancuisine.ca",
    lat: 45.4165, lng: -75.7025,
    halalStatus: "verified",
    halalNote: "Ottawa's #1 Indian Halal Restaurant",
    priceRange: 2, rating: 4.5,
    features: ["Dine-in", "Takeout", "Delivery", "Catering"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
    menu: [
      { item: "Butter Chicken", price: 17.99 },
      { item: "Lamb Rogan Josh", price: 19.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("sahara-ottawa"),
    name: "Sa'hara",
    slug: "sahara-ottawa",
    cuisines: ["Somali", "African"],
    address: "109A - 2446 Bank St",
    phone: "(613) 422-7272",
    website: "https://www.saharaottawa.com",
    lat: 45.3625, lng: -75.6625,
    halalStatus: "verified",
    halalNote: "Authentic Somali halal cuisine",
    priceRange: 2, rating: 4.4,
    features: ["Dine-in", "Takeout", "Delivery"],
    hours: [{ days: "Mon-Sun", hours: "12:00 PM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800"],
    menu: [
      { item: "Chicken Suqaar Platter", price: 16.99 },
      { item: "Beef Suqaar Platter", price: 18.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("house-of-mandi"),
    name: "House of Mandi",
    slug: "house-of-mandi",
    cuisines: ["Yemeni", "Arabic"],
    address: "1183 Hunt Club Rd Unit 108",
    phone: "(613) 737-3200",
    lat: 45.3565, lng: -75.6485,
    halalStatus: "verified",
    halalNote: "Traditional Yemeni halal - Mandi rice specialty",
    priceRange: 2, rating: 4.4,
    features: ["Dine-in", "Takeout", "Delivery", "Family-friendly"],
    hours: [{ days: "Mon-Sun", hours: "12:00 PM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
    menu: [
      { item: "Lamb Mandi", price: 24.99 },
      { item: "Chicken Mandi", price: 18.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("nandos-elgin"),
    name: "Nando's",
    slug: "nandos-elgin",
    cuisines: ["Portuguese", "Fast Food"],
    address: "90 Elgin St Unit 3",
    phone: "(613) 230-7474",
    website: "https://www.nandos.ca",
    lat: 45.4205, lng: -75.6930,
    halalStatus: "verified",
    halalNote: "Halal chicken certified",
    priceRange: 2, rating: 4.3,
    features: ["Dine-in", "Takeout", "Delivery"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800"],
    menu: [
      { item: "1/2 Chicken", price: 16.99 },
      { item: "Peri-Peri Wings", price: 14.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("chahaya-malaysia"),
    name: "Chahaya Malaysia",
    slug: "chahaya-malaysia",
    cuisines: ["Malaysian", "Indonesian", "Asian"],
    address: "1690 Montreal Rd",
    phone: "(613) 742-0242",
    website: "https://chahayamalaysia.ca",
    lat: 45.4455, lng: -75.6185,
    halalStatus: "verified",
    halalNote: "Halal Malaysian & Indonesian cuisine since 1985",
    priceRange: 2, rating: 4.5,
    features: ["Dine-in", "Takeout"],
    hours: [{ days: "Tue-Sun", hours: "11:30 AM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
    menu: [
      { item: "Nasi Lemak", price: 14.99 },
      { item: "Beef Rendang", price: 18.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("fairouz-somerset"),
    name: "Fairouz",
    slug: "fairouz-somerset",
    cuisines: ["Arabic", "Lebanese", "Middle Eastern"],
    address: "343 Somerset St W",
    phone: "(613) 422-7700",
    website: "https://www.fairouz.ca",
    lat: 45.4165, lng: -75.7015,
    halalStatus: "verified",
    priceRange: 3, rating: 4.7,
    features: ["Dine-in", "Takeout", "Catering"],
    hours: [{ days: "Tue-Sun", hours: "5:00 PM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
    menu: [
      { item: "Mezze Platter", price: 28.99 },
      { item: "Grilled Lamb Chops", price: 34.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("turkish-kebab-house-bank"),
    name: "Turkish Kebab House",
    slug: "turkish-kebab-house-bank",
    cuisines: ["Turkish", "Mediterranean"],
    address: "1910 Bank St",
    phone: "(819) 919-6565",
    website: "https://www.turkishkebabhouses.com",
    lat: 45.3685, lng: -75.6645,
    halalStatus: "verified",
    halalNote: "Authentic Turkish halal",
    priceRange: 2, rating: 4.5,
    features: ["Dine-in", "Takeout", "Family-friendly"],
    hours: [{ days: "Mon-Sun", hours: "12:00 PM - 9:30 PM" }],
    photos: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
    menu: [
      { item: "Adana Kebab", price: 19.99 },
      { item: "Iskender Kebab", price: 22.99 },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: makeId("ariana-kabab-house"),
    name: "Ariana Kabab House",
    slug: "ariana-kabab-house",
    cuisines: ["Afghan", "Middle Eastern"],
    address: "426 Rideau St",
    phone: "(613) 241-7666",
    website: "https://arianakababhouse.com",
    lat: 45.4305, lng: -75.6855,
    halalStatus: "verified",
    halalNote: "Authentic Afghan halal",
    priceRange: 2, rating: 4.3,
    features: ["Dine-in", "Takeout", "Delivery"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 11:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
    menu: [
      { item: "Lamb Tikka", price: 21.99 },
      { item: "Qabili Palau", price: 16.99 },
    ],
    createdAt: "2026-01-01",
  },
];

// Helper functions
export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find(r => r.slug === slug);
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.toLowerCase();
  return restaurants.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.cuisines.some(c => c.toLowerCase().includes(q)) ||
    r.address.toLowerCase().includes(q)
  );
}

export function filterRestaurants(opts: {
  cuisine?: string;
  features?: string[];
  priceRange?: number;
}): Restaurant[] {
  return restaurants.filter(r => {
    if (opts.cuisine && !r.cuisines.includes(opts.cuisine)) return false;
    if (opts.features?.length && !opts.features.every(f => r.features.includes(f))) return false;
    if (opts.priceRange && r.priceRange !== opts.priceRange) return false;
    return true;
  });
}
