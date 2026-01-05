# Halal Eats Ottawa - Technical Documentation

Complete technical reference for developers and LLMs working with this codebase.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Database Schema](#database-schema)
4. [API Routes](#api-routes)
5. [Components](#components)
6. [Analytics System](#analytics-system)
7. [Authentication](#authentication)
8. [Data Flow](#data-flow)
9. [Key Files Reference](#key-files-reference)
10. [Common Tasks](#common-tasks)
11. [Environment Variables](#environment-variables)
12. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                     │
├─────────────────────────────────────────────────────────────────┤
│  Pages (App Router)           │  Components                      │
│  ├── / (Home)                 │  ├── Header.tsx                  │
│  ├── /restaurant/[slug]       │  ├── FilterBar.tsx               │
│  └── /manage-2ad72e/*         │  ├── RestaurantCard.tsx          │
│                               │  ├── MapView.tsx                 │
│                               │  ├── LocationSelector.tsx        │
│                               │  └── TrackingComponents.tsx      │
├─────────────────────────────────────────────────────────────────┤
│                        API ROUTES (/api)                         │
│  ├── /restaurants      (CRUD)                                    │
│  ├── /favorites        (User favorites)                          │
│  ├── /auth/*           (Login, session check)                    │
│  ├── /analytics/*      (Tracking, dashboard, charts)             │
│  └── /options          (Cuisines, features lists)                │
├─────────────────────────────────────────────────────────────────┤
│                        DATABASE (PostgreSQL)                     │
│  └── Prisma ORM                                                  │
│      ├── Restaurant, Cuisine, Feature                            │
│      ├── Visitor, Session, AnalyticsEvent                        │
│      └── Favorite                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack
- **Framework**: Next.js 14 (App Router, Server Components)
- **Language**: TypeScript
- **Database**: PostgreSQL (Docker container)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap (free, no API key)
- **Charts**: Recharts
- **Auth**: JWT (stored in cookies)

---

## Directory Structure

```
Opus_Halal_Directory/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   ├── seed.ts                    # Main seed script
│   └── data/
│       ├── restaurants-part1.ts   # Original 12 restaurants (in seed.ts)
│       ├── restaurants-part2.ts   # Indian, Somali, Persian, Moroccan
│       ├── restaurants-part3.ts   # Fast food, Bakery, Yemeni, Lebanese
│       └── restaurants-part4.ts   # Afghan, Turkish, Egyptian, Malaysian
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout + AnalyticsProvider
│   │   ├── page.tsx               # Home page (list/map/search/tabs)
│   │   ├── globals.css            # Tailwind + custom styles
│   │   ├── restaurant/
│   │   │   └── [slug]/page.tsx    # Restaurant detail page
│   │   ├── manage-2ad72e/         # Admin dashboard (obscured URL)
│   │   │   ├── page.tsx           # Restaurant CRUD
│   │   │   └── analytics/
│   │   │       ├── page.tsx       # Analytics overview
│   │   │       └── charts/page.tsx # Analytics charts
│   │   └── api/
│   │       ├── restaurants/
│   │       │   ├── route.ts       # GET (list), POST (create)
│   │       │   └── [id]/route.ts  # GET, PUT, DELETE by ID
│   │       ├── favorites/route.ts # GET, POST, DELETE favorites
│   │       ├── options/route.ts   # GET cuisines & features
│   │       ├── auth/
│   │       │   ├── login/route.ts # POST login
│   │       │   └── check/route.ts # GET session check
│   │       └── analytics/
│   │           ├── track/route.ts      # POST events
│   │           ├── dashboard/route.ts  # GET dashboard data
│   │           ├── charts/route.ts     # GET chart data
│   │           └── end-session/route.ts # POST end session
│   ├── components/
│   │   ├── Header.tsx             # Logo, nav
│   │   ├── FilterBar.tsx          # Filters (cuisine, radius, etc.)
│   │   ├── RestaurantCard.tsx     # Card with actions
│   │   ├── MapView.tsx            # Leaflet map
│   │   ├── LocationSelector.tsx   # Address input + geocoding
│   │   └── TrackingComponents.tsx # Analytics wrappers
│   └── lib/
│       ├── prisma.ts              # Prisma client singleton
│       ├── data.ts                # Utility functions
│       └── analytics.tsx          # Analytics hooks & context
├── docker-compose.yml             # PostgreSQL container
├── .env.example                   # Environment template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Database Schema

### Core Models

```prisma
model Restaurant {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique          // URL-friendly identifier
  address     String
  city        String   @default("ottawa")
  phone       String
  website     String?
  lat         Float                     // Latitude for map
  lng         Float                     // Longitude for map
  halalStatus String   @default("self-reported")  // "verified" | "self-reported"
  halalNote   String?                   // e.g., "All meat halal certified"
  priceRange  Int      @default(2)      // 1-3 ($, $$, $$$)
  rating      Float?                    // 1.0-5.0
  photos      String[] @default([])     // Array of image URLs
  menu        Json     @default("[]")   // [{item: string, price: number}]
  
  // Relations
  cuisines    RestaurantCuisine[]
  features    RestaurantFeature[]
  hours       RestaurantHours[]
  
  // Analytics aggregates (denormalized for performance)
  totalViews         Int @default(0)
  totalDirections    Int @default(0)
  totalCalls         Int @default(0)
  totalWebsiteClicks Int @default(0)
}

model Cuisine {
  id          String   @id @default(cuid())
  name        String   @unique          // "Lebanese", "Turkish", etc.
  restaurants RestaurantCuisine[]
}

model Feature {
  id          String   @id @default(cuid())
  name        String   @unique          // "Dine-in", "Delivery", etc.
  restaurants RestaurantFeature[]
}

model RestaurantHours {
  id           String     @id @default(cuid())
  restaurantId String
  days         String                   // "Mon-Fri", "Sat-Sun", etc.
  hours        String                   // "11:00 AM - 10:00 PM" or "Closed"
  @@unique([restaurantId, days])
}
```

### Analytics Models

```prisma
model Visitor {
  id             String    @id @default(cuid())
  fingerprint    String    @unique      // Browser fingerprint hash
  firstSeen      DateTime  @default(now())
  lastSeen       DateTime  @updatedAt
  totalSessions  Int       @default(0)
  totalPageViews Int       @default(0)
  city           String?
  sessions       Session[]
  events         AnalyticsEvent[]
}

model Session {
  id          String    @id @default(cuid())
  visitorId   String
  startedAt   DateTime  @default(now())
  endedAt     DateTime?
  duration    Int?                      // Seconds
  pageViews   Int       @default(0)
  userAgent   String?
  referrer    String?
  landingPage String?
  exitPage    String?
  device      String?                   // "mobile" | "tablet" | "desktop"
  events      AnalyticsEvent[]
}

model AnalyticsEvent {
  id           String      @id @default(cuid())
  visitorId    String
  sessionId    String
  timestamp    DateTime    @default(now())
  eventType    String      // "page_view" | "filter_use" | "restaurant_view" | "conversion"
  eventName    String      // Specific action name
  page         String?     // URL path
  restaurantId String?     // If event relates to a restaurant
  metadata     Json?       // Additional data
}

model Favorite {
  visitorId    String
  restaurantId String
  createdAt    DateTime @default(now())
  @@id([visitorId, restaurantId])
}
```

### Many-to-Many Relations

```prisma
model RestaurantCuisine {
  restaurantId String
  cuisineId    String
  @@id([restaurantId, cuisineId])
}

model RestaurantFeature {
  restaurantId String
  featureId    String
  @@id([restaurantId, featureId])
}
```

---

## API Routes

### Restaurants API

#### `GET /api/restaurants`
List restaurants with optional filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search name, cuisine, address |
| `filter` | string | `"trending"` (by views) or `"new"` (last 7 days) |
| `cuisine` | string | Filter by cuisine name |
| `features` | string | Comma-separated feature names |
| `priceRange` | string | `"1"`, `"2"`, or `"3"` |

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Shawarma Palace",
    "slug": "shawarma-palace-rideau",
    "cuisines": [{ "cuisine": { "name": "Lebanese" } }],
    "features": [{ "feature": { "name": "Dine-in" } }],
    "hours": [{ "days": "Mon-Sun", "hours": "11:00 AM - 2:00 AM" }],
    ...
  }
]
```

#### `POST /api/restaurants`
Create a new restaurant.

**Body:**
```json
{
  "name": "Restaurant Name",
  "slug": "restaurant-slug",
  "address": "123 Main St",
  "phone": "(613) 555-1234",
  "lat": 45.4215,
  "lng": -75.6972,
  "cuisines": ["Lebanese", "Middle Eastern"],
  "features": ["Dine-in", "Takeout"],
  "hours": [{ "days": "Mon-Sun", "hours": "11:00 AM - 10:00 PM" }],
  "menu": [{ "item": "Shawarma", "price": 12.99 }]
}
```

#### `GET /api/restaurants/[id]`
Get single restaurant by ID.

#### `PUT /api/restaurants/[id]`
Update restaurant. Same body as POST.

#### `DELETE /api/restaurants/[id]`
Delete restaurant.

---

### Favorites API

#### `GET /api/favorites?visitorId=xxx`
Get user's favorite restaurant IDs.

**Response:**
```json
{ "favorites": ["restaurant-id-1", "restaurant-id-2"] }
```

#### `POST /api/favorites`
Add favorite.

**Body:**
```json
{ "visitorId": "visitor-fingerprint", "restaurantId": "restaurant-id" }
```

#### `DELETE /api/favorites`
Remove favorite. Same body as POST.

---

### Auth API

#### `POST /api/auth/login`
Admin login.

**Body:**
```json
{ "username": "admin", "password": "secret" }
```

**Response (success):**
```json
{ "success": true }
```
Sets `admin_token` HTTP-only cookie (JWT, 8hr expiry).

#### `GET /api/auth/check`
Check if admin session is valid.

**Response:**
```json
{ "authenticated": true }
```

---

### Analytics API

#### `POST /api/analytics/track`
Track an event.

**Body:**
```json
{
  "fingerprint": "browser-fingerprint-hash",
  "eventType": "page_view",
  "eventName": "home_page",
  "page": "/",
  "restaurantId": null,
  "metadata": { "filters": { "cuisine": "Lebanese" } },
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

**Event Types:**
| eventType | eventName examples | When used |
|-----------|-------------------|-----------|
| `page_view` | `home_page`, `restaurant_detail` | Page load |
| `filter_use` | `cuisine_filter`, `radius_filter` | Filter changed |
| `restaurant_view` | `card_click` | Restaurant card clicked |
| `conversion` | `directions_click`, `call_click`, `website_click` | CTA clicked |

#### `GET /api/analytics/dashboard`
Get analytics overview data.

**Response:**
```json
{
  "overview": {
    "totalVisitors": 150,
    "totalSessions": 320,
    "totalPageViews": 1200,
    "avgSessionDuration": 245
  },
  "topRestaurants": [...],
  "conversions": { "directions": 45, "calls": 23, "website": 12 },
  "filterUsage": { "cuisine": 89, "radius": 45, ... },
  "deviceBreakdown": { "mobile": 60, "desktop": 35, "tablet": 5 },
  "recentActivity": [...]
}
```

#### `GET /api/analytics/charts?range=7`
Get time-series data for charts.

**Query:** `range` = 7, 30, or 90 days

**Response:**
```json
{
  "dailyStats": [
    { "date": "2026-01-01", "visitors": 25, "sessions": 40, "pageViews": 120, "conversions": 8 }
  ],
  "hourlyActivity": [{ "hour": 0, "count": 5 }, ...],
  "weeklyComparison": { "thisWeek": {...}, "lastWeek": {...} }
}
```

#### `POST /api/analytics/end-session`
End a session (called on page unload).

**Body:**
```json
{ "fingerprint": "xxx", "exitPage": "/restaurant/shawarma-palace" }
```

---

## Components

### Header (`src/components/Header.tsx`)
Simple header with logo. No props.

### FilterBar (`src/components/FilterBar.tsx`)

**Props:**
```typescript
{
  cuisines: string[]              // Available cuisine options
  features: string[]              // Available feature options
  selectedCuisine: string
  selectedFeatures: string[]
  selectedRadius: number          // km
  selectedPriceRange: number | null
  openNow: boolean
  onCuisineChange: (cuisine: string) => void
  onFeaturesChange: (features: string[]) => void
  onRadiusChange: (radius: number) => void
  onPriceRangeChange: (price: number | null) => void
  onOpenNowChange: (open: boolean) => void
  onClearFilters: () => void
}
```

**Behavior:**
- Desktop: Horizontal dropdowns
- Mobile: Expandable panel with "Filters" button
- Tracks filter usage via analytics

### RestaurantCard (`src/components/RestaurantCard.tsx`)

**Props:**
```typescript
{
  restaurant: Restaurant          // Full restaurant object
  distance?: number               // km from user
  isSelected?: boolean            // Highlight state (for map sync)
  onClick?: () => void
  isFavorite?: boolean
  onToggleFavorite?: () => void
}
```

**Features:**
- Halal badge (verified = green, self-reported = yellow)
- Price range display ($, $$, $$$)
- Distance badge
- Quick action buttons (Directions, Call)
- Favorite heart icon
- Tracks clicks and conversions

### MapView (`src/components/MapView.tsx`)

**Props:**
```typescript
{
  restaurants: Restaurant[]
  userLocation: { lat: number; lng: number } | null
  selectedId: string | null
  onMarkerClick: (id: string) => void
}
```

**Features:**
- Leaflet map with OpenStreetMap tiles
- Red markers for restaurants
- Blue marker for user location
- Click marker to select restaurant
- Auto-centers on user or Ottawa downtown

### LocationSelector (`src/components/LocationSelector.tsx`)

**Props:**
```typescript
{
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  currentAddress?: string
}
```

**Features:**
- "Use My Location" button (browser geolocation)
- Manual address input with autocomplete
- Uses OpenStreetMap Nominatim API (free)
- Reverse geocoding for coordinates → address

### TrackingComponents (`src/components/TrackingComponents.tsx`)

**Components:**
1. `TrackRestaurantView` - Tracks restaurant page views (server component compatible)
2. `ConversionButton` - Wraps links to track conversions

**Usage:**
```tsx
// In restaurant detail page
<TrackRestaurantView restaurantId={id} restaurantName={name} />

// For CTA buttons
<ConversionButton
  restaurantId={id}
  restaurantName={name}
  action="directions_click"
  href={directionsUrl}
>
  Get Directions
</ConversionButton>
```

---

## Analytics System

### How It Works

1. **Visitor Identification**: Browser fingerprint generated from canvas, WebGL, fonts, etc.
2. **Session Tracking**: New session created if >30 min since last activity
3. **Event Tracking**: All interactions logged with timestamp, page, metadata
4. **Aggregation**: Restaurant-level metrics updated in real-time

### Analytics Provider (`src/lib/analytics.tsx`)

Wrap your app in `<AnalyticsProvider>` (done in `layout.tsx`).

**Hooks:**
```typescript
// Track page view
usePageView(pageName: string, restaurantId?: string)

// Track custom event
const { trackEvent } = useAnalytics()
trackEvent('filter_use', 'cuisine_filter', { value: 'Lebanese' })

// Track conversion
const { trackConversion } = useAnalytics()
trackConversion('directions_click', restaurantId, restaurantName)
```

### Excluding Admin Pages

Analytics automatically excludes paths starting with `/manage-` or `/admin`.

---

## Authentication

### Flow

1. User visits `/manage-2ad72e`
2. If no valid JWT cookie → show login form
3. Submit credentials → `POST /api/auth/login`
4. Server validates against env vars, returns JWT cookie
5. Subsequent requests include cookie automatically
6. JWT expires after 8 hours

### Security Notes

- Admin URL is obscured (`/manage-2ad72e`) to prevent discovery
- Credentials stored in environment variables only
- JWT secret should be 32+ random characters
- HTTP-only cookie prevents XSS access

---

## Data Flow

### Home Page Load

```
1. User visits /
2. Server fetches restaurants from Prisma
3. Client hydrates with AnalyticsProvider
4. Analytics tracks page_view event
5. User location detected (if permitted)
6. Distances calculated client-side
7. Filters applied → re-fetch or client filter
```

### Restaurant Detail Page

```
1. User clicks restaurant card
2. Analytics tracks restaurant_view event
3. Navigate to /restaurant/[slug]
4. Server fetches restaurant by slug
5. TrackRestaurantView fires page_view
6. User clicks "Get Directions"
7. ConversionButton tracks conversion
8. Restaurant.totalDirections incremented
```

### Admin Dashboard

```
1. Admin visits /manage-2ad72e
2. Check auth cookie → redirect to login if invalid
3. Fetch all restaurants
4. Display in table with edit/delete actions
5. Add/Edit opens modal form
6. Submit → POST/PUT /api/restaurants
7. Refresh list
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page with list/map views, search, tabs |
| `src/app/restaurant/[slug]/page.tsx` | Restaurant detail with menu, hours, CTAs |
| `src/app/manage-2ad72e/page.tsx` | Admin CRUD dashboard |
| `src/app/manage-2ad72e/analytics/page.tsx` | Analytics overview |
| `src/app/manage-2ad72e/analytics/charts/page.tsx` | Analytics charts |
| `src/lib/analytics.tsx` | Analytics context, hooks, fingerprinting |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/data.ts` | Utility functions (distance calc, open now check) |
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.ts` | Database seeding script |

---

## Common Tasks

### Add a New Restaurant

**Option 1: Admin UI**
1. Go to `/manage-2ad72e`
2. Login with admin credentials
3. Click "Add Restaurant"
4. Fill form and save

**Option 2: Database Seed**
1. Add to `prisma/data/restaurants-part4.ts` (or create part5)
2. Import in `prisma/seed.ts`
3. Run: `npx prisma db seed`

**Option 3: API**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"name": "New Place", "slug": "new-place", ...}'
```

### Add a New Cuisine Type

1. Add to `cuisines` array in `prisma/seed.ts`
2. Run: `npx prisma db seed`
3. Or add via Prisma Studio: `npx prisma studio`

### Add a New Feature

1. Add to `features` array in `prisma/seed.ts`
2. Run: `npx prisma db seed`

### Reset Database

```bash
npx prisma db push --force-reset
npx prisma db seed
```

### View Database

```bash
npx prisma studio
```
Opens browser UI at http://localhost:5555

### Change Admin URL

1. Rename folder: `mv src/app/manage-2ad72e src/app/your-new-path`
2. Update any hardcoded links in the code
3. Update analytics exclusion pattern in `analytics.tsx`

### Add Menu Items to Existing Restaurant

```typescript
// In Prisma Studio or via API
await prisma.restaurant.update({
  where: { slug: 'restaurant-slug' },
  data: {
    menu: [
      { item: 'Dish Name', price: 12.99 },
      { item: 'Another Dish', price: 15.99 }
    ]
  }
})
```

---

## Environment Variables

```env
# Database (required)
DATABASE_URL="postgresql://halal_user:halal_pass@localhost:5432/halal_directory"

# Admin Auth (required for admin dashboard)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_JWT_SECRET=random-32-char-string-here

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_KEY=xxx  # For embedded maps on detail pages
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Troubleshooting

### Database Connection Failed

```bash
# Check Docker is running
docker ps

# Restart database
docker-compose down && docker-compose up -d

# Check connection string
echo $DATABASE_URL
```

### Prisma Client Outdated

```bash
npx prisma generate
```

### Port 5432 Already in Use

Edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"
```

Update `DATABASE_URL` to use port 5433.

### Admin Login Not Working

1. Check `.env.local` has correct credentials
2. Restart dev server: `npm run dev`
3. Clear browser cookies
4. Check JWT secret is set

### Map Not Loading

- Leaflet CSS must be imported in `globals.css`
- Check browser console for errors
- Ensure `dynamic` import with `ssr: false` for MapView

### Analytics Not Tracking

1. Check browser console for errors
2. Verify AnalyticsProvider wraps the app
3. Check if page is excluded (admin paths)
4. Verify database has Visitor/Session/Event tables

### Menu Not Showing

1. Ensure `menu` field exists in schema
2. Run `npx prisma db push` to sync schema
3. Check restaurant has menu data (not empty array)
4. Verify detail page includes menu section

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#C62828` | Buttons, links, accents |
| Primary Dark | `#8E0000` | Hover states |
| Accent Yellow | `#F4B400` | Badges, highlights |
| Success Green | `#2E7D32` | Verified badges, success states |
| Error Red | `#D32F2F` | Error messages, closed status |
| Neutral BG | `#F5F5F5` | Page background |
| Neutral Card | `#FFFFFF` | Card backgrounds |
| Neutral Text | `#212121` | Primary text |
| Neutral Secondary | `#757575` | Secondary text |

---

## Performance Considerations

1. **Server Components**: Most pages use React Server Components for faster initial load
2. **Database Indexes**: Slug is unique indexed for fast lookups
3. **Denormalized Metrics**: Restaurant view counts stored directly to avoid joins
4. **Image Optimization**: Use Next.js Image component for restaurant photos
5. **Map Lazy Loading**: MapView loaded dynamically with `ssr: false`

---

## Future Development Notes

See `FUTURE_FEATURES.md` for planned features including:
- User reviews and ratings
- Prayer times widget
- Nearby mosques integration
- Restaurant owner dashboard
- Multi-city support
- Online ordering integration
