import { PrismaClient } from '@prisma/client';
import { restaurantsPart2 } from './data/restaurants-part2';
import { restaurantsPart3 } from './data/restaurants-part3';
import { restaurantsPart4 } from './data/restaurants-part4';

const prisma = new PrismaClient();

const cuisines = [
  'Desi', 'Arabic', 'Moroccan', 'Turkish', 'Afghan', 'Middle Eastern', 
  'Fast Food', 'Fusion', 'Somali', 'Lebanese', 'Pakistani', 'African',
  'Mediterranean', 'Greek', 'Persian', 'Indian', 'Portuguese', 'Burgers',
  'Yemeni', 'Egyptian', 'Bangladeshi', 'Malaysian', 'Indonesian', 'Asian',
  'Uyghur', 'Chinese', 'Central Asian', 'Seafood', 'Dessert', 'Bakery', 'Syrian'
];

const features = ['Dine-in', 'Takeout', 'Delivery', 'Family-friendly', 'Catering', 'Late Night', 'Breakfast', 'Market'];

// Original restaurants (Part 1)
const restaurantsPart1 = [
  {
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
      { item: "Hummus", price: 6.99 },
      { item: "Fattoush Salad", price: 7.99 },
    ],
  },
  {
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
    hours: [
      { days: "Mon-Tue", hours: "11:00 AM - 10:00 PM" },
      { days: "Wed", hours: "Closed" },
      { days: "Thu-Sat", hours: "11:00 AM - 10:00 PM" },
      { days: "Sun", hours: "11:30 AM - 10:00 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"],
    menu: [
      { item: "Adana Kebab", price: 18.99 },
      { item: "Mixed Grill", price: 24.99 },
      { item: "Chicken Shish", price: 16.99 },
      { item: "Lahmacun", price: 7.99 },
    ],
  },
  {
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
      { item: "Mantu", price: 12.99 },
      { item: "Bolani", price: 7.99 },
    ],
  },
  {
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
    hours: [
      { days: "Mon", hours: "Closed" },
      { days: "Tue-Fri", hours: "11:00 AM - 9:30 PM" },
      { days: "Sat", hours: "10:30 AM - 9:30 PM" },
      { days: "Sun", hours: "10:00 AM - 8:30 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800"],
    menu: [
      { item: "Mixed Grill Platter", price: 28.99 },
      { item: "Chicken Taouk", price: 18.99 },
      { item: "Kafta Kabab", price: 17.99 },
      { item: "Fattoush", price: 9.99 },
    ],
  },
  {
    name: "Laheeb Grill",
    slug: "laheeb-grill",
    cuisines: ["Middle Eastern", "Lebanese"],
    address: "947 Somerset St W",
    phone: "(613) 750-0707",
    website: "https://www.laheebrestaurants.com",
    lat: 45.4015, lng: -75.7185,
    halalStatus: "verified",
    halalNote: "Famous for halal shawarma",
    priceRange: 1, rating: 4.4,
    features: ["Dine-in", "Takeout", "Delivery"],
    hours: [
      { days: "Mon-Thu", hours: "11:00 AM - 9:30 PM" },
      { days: "Fri-Sun", hours: "11:00 AM - 10:00 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800"],
    menu: [
      { item: "Chicken Shawarma", price: 10.99 },
      { item: "Beef Shawarma", price: 12.99 },
      { item: "Mixed Shawarma Plate", price: 16.99 },
    ],
  },
  {
    name: "Tava Turkish Cuisine",
    slug: "tava-turkish-cuisine",
    cuisines: ["Turkish", "Mediterranean"],
    address: "7B Kakulu Rd, Kanata",
    phone: "(613) 435-7888",
    website: "https://www.tava.kitchen",
    lat: 45.3025, lng: -75.8965,
    halalStatus: "verified",
    halalNote: "Authentic Turkish halal",
    priceRange: 2, rating: 4.6,
    features: ["Dine-in", "Takeout", "Family-friendly"],
    hours: [
      { days: "Mon", hours: "12:00 PM - 9:00 PM" },
      { days: "Tue", hours: "Closed" },
      { days: "Wed-Sun", hours: "12:00 PM - 9:00 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"],
    menu: [
      { item: "Iskender Kebab", price: 22.99 },
      { item: "Lamb Shish", price: 24.99 },
      { item: "Pide", price: 14.99 },
    ],
  },
  {
    name: "Samar Kabab House",
    slug: "samar-kabab-house",
    cuisines: ["Afghan", "Pakistani", "Desi"],
    address: "1729 Walkley Rd #1",
    phone: "(613) 523-7171",
    website: "https://www.samarkabab.com",
    lat: 45.3745, lng: -75.6285,
    halalStatus: "verified",
    halalNote: "Traditional Afghan halal",
    priceRange: 2, rating: 4.4,
    features: ["Dine-in", "Takeout", "Delivery", "Family-friendly"],
    hours: [
      { days: "Mon", hours: "12:00 PM - 10:00 PM" },
      { days: "Tue-Sun", hours: "11:00 AM - 10:00 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
    menu: [
      { item: "Lamb Kabab", price: 20.99 },
      { item: "Chicken Kabab", price: 16.99 },
      { item: "Qabili Palau", price: 15.99 },
    ],
  },
  {
    name: "Salang Kabob House",
    slug: "salang-kabob-house",
    cuisines: ["Afghan", "Pakistani"],
    address: "2934 Carling Ave",
    phone: "(613) 820-0007",
    website: "https://salangkabobhouse.ca",
    lat: 45.3565, lng: -75.7885,
    halalStatus: "verified",
    halalNote: "Afghan & Pakistani halal",
    priceRange: 2, rating: 4.3,
    features: ["Dine-in", "Takeout", "Family-friendly"],
    hours: [
      { days: "Mon", hours: "Closed" },
      { days: "Tue-Thu", hours: "12:00 PM - 9:00 PM" },
      { days: "Fri-Sat", hours: "12:00 PM - 10:00 PM" },
      { days: "Sun", hours: "12:00 PM - 9:00 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"],
    menu: [
      { item: "Chapli Kabab", price: 15.99 },
      { item: "Seekh Kabab", price: 14.99 },
      { item: "Biryani", price: 13.99 },
    ],
  },
  {
    name: "Kabab Village",
    slug: "kabab-village-carling",
    cuisines: ["Afghan", "Middle Eastern"],
    address: "1450 Carling Ave",
    phone: "(613) 722-5555",
    lat: 45.3835, lng: -75.7365,
    halalStatus: "verified",
    priceRange: 2, rating: 4.4,
    features: ["Dine-in", "Takeout", "Family-friendly", "Catering"],
    hours: [{ days: "Mon-Sun", hours: "11:30 AM - 10:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"],
    menu: [
      { item: "Mixed Kabab Platter", price: 22.99 },
      { item: "Lamb Tikka", price: 19.99 },
      { item: "Chicken Boti", price: 16.99 },
    ],
  },
  {
    name: "Ottawa Kabab",
    slug: "ottawa-kabab",
    cuisines: ["Afghan", "Middle Eastern"],
    address: "1154 Bank St",
    phone: "(613) 730-5555",
    lat: 45.3915, lng: -75.6745,
    halalStatus: "verified",
    priceRange: 2, rating: 4.3,
    features: ["Dine-in", "Takeout", "Delivery"],
    hours: [{ days: "Mon-Sun", hours: "11:00 AM - 11:00 PM" }],
    photos: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"],
    menu: [
      { item: "Lamb Kabab", price: 18.99 },
      { item: "Chicken Kabab", price: 15.99 },
      { item: "Vegetable Kabab", price: 12.99 },
    ],
  },
  {
    name: "Shawarma Station",
    slug: "shawarma-station-rideau",
    cuisines: ["Middle Eastern", "Lebanese"],
    address: "570 Rideau St",
    phone: "(613) 241-2229",
    lat: 45.4335, lng: -75.6795,
    halalStatus: "verified",
    priceRange: 1, rating: 4.2,
    features: ["Dine-in", "Takeout", "Delivery", "Late Night"],
    hours: [{ days: "Mon-Sun", hours: "10:00 AM - 3:00 AM" }],
    photos: ["https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800"],
    menu: [
      { item: "Chicken Shawarma", price: 8.99 },
      { item: "Beef Shawarma", price: 10.99 },
      { item: "Falafel Plate", price: 11.99 },
    ],
  },
  {
    name: "Khokha Eatery",
    slug: "khokha-eatery",
    cuisines: ["Middle Eastern", "Mediterranean"],
    address: "35 William St",
    phone: "(613) 695-1111",
    lat: 45.4295, lng: -75.6915,
    halalStatus: "verified",
    halalNote: "Modern halal Middle Eastern",
    priceRange: 2, rating: 4.5,
    features: ["Dine-in", "Takeout"],
    hours: [
      { days: "Mon", hours: "Closed" },
      { days: "Tue-Sun", hours: "11:00 AM - 9:00 PM" }
    ],
    photos: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
    menu: [
      { item: "Lamb Kofta", price: 18.99 },
      { item: "Chicken Shawarma Bowl", price: 16.99 },
      { item: "Mezze Platter", price: 22.99 },
    ],
  },
];

// Combine all restaurants
const allRestaurants = [...restaurantsPart1, ...restaurantsPart2, ...restaurantsPart3, ...restaurantsPart4];

async function main() {
  console.log('Seeding database with Ottawa halal restaurants...\n');

  // Create cuisines
  console.log('Creating cuisines...');
  for (const name of cuisines) {
    await prisma.cuisine.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Create features
  console.log('Creating features...');
  for (const name of features) {
    await prisma.feature.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Create restaurants
  console.log('Creating restaurants...');
  let added = 0;
  for (const r of allRestaurants) {
    const cuisineRecords = await prisma.cuisine.findMany({ where: { name: { in: r.cuisines } } });
    const featureRecords = await prisma.feature.findMany({ where: { name: { in: r.features } } });

    const existing = await prisma.restaurant.findUnique({ where: { slug: r.slug } });
    if (existing) {
      console.log(`  - Skipping ${r.name} (already exists)`);
      continue;
    }

    await prisma.restaurant.create({
      data: {
        name: r.name,
        slug: r.slug,
        address: r.address,
        phone: r.phone,
        website: (r as any).website,
        lat: r.lat,
        lng: r.lng,
        halalStatus: r.halalStatus,
        halalNote: (r as any).halalNote,
        priceRange: r.priceRange,
        rating: r.rating,
        photos: r.photos,
        menu: (r as any).menu || [],
        cuisines: { create: cuisineRecords.map((c) => ({ cuisineId: c.id })) },
        features: { create: featureRecords.map((f) => ({ featureId: f.id })) },
        hours: { create: r.hours },
      },
    });
    console.log(`  + Added ${r.name}`);
    added++;
  }

  console.log(`\n✓ Seed completed! Added ${added} restaurants (${allRestaurants.length} total in seed).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
