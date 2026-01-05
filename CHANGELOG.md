# Changelog

All notable changes to the Halal Eats Ottawa project.

---

## [0.7.0] - 2026-01-04

### Added
- **Menu Display** on restaurant detail pages
  - Shows menu items with prices under "Menu Highlights"
  - `menu` JSON field added to Restaurant model
- **Expanded Restaurant Database** - 41 verified Ottawa halal restaurants
  - Indian/Pakistani: Aroma Indian Cuisine, Karahi Point, The Biryani Walla
  - Somali/African: Sa'hara, Alhuda Restaurant
  - Persian: I Cook Persian Cuisine, Silk Road Restaurant, Cafe Tehran
  - Yemeni: House of Mandi, Yemen Gate
  - Turkish: Turkish Kebab House (Bank St & Kanata), A La Istanbul
  - Lebanese: Fairouz, Paramount Fine Foods, Pie Central Bakery
  - Malaysian: Chahaya Malaysia
  - Egyptian: The Egyptian Corner
  - Afghan: Ariana Kabab House (Rideau & Alta Vista)
  - Seafood: Pelican Seafood Market and Grill
- **New Cuisines**: Yemeni, Egyptian, Malaysian, Indonesian, Asian, Syrian
- **New Features**: Breakfast, Market

### Changed
- All restaurant addresses verified via web research
- Seed data split into modular files (`restaurants-part2.ts`, `part3.ts`, `part4.ts`)
- Database schema updated with `menu` field (JSON)

### Fixed
- Removed fictional/unverified restaurants
- Corrected addresses for existing restaurants

---

## [0.6.0] - 2026-01-04

### Added
- **Search by Dish/Keyword**
  - Search bar at top of page
  - Searches restaurant names, cuisines, addresses
  - Clear button to reset search
- **Section Tabs**
  - "All" - Full restaurant list with filters
  - "Trending" - Top restaurants by views
  - "New This Week" - Recently added restaurants
  - "Favorites" - User's saved restaurants
- **Favorites/Saved Lists**
  - Heart icon on restaurant cards
  - Persisted per visitor (localStorage ID)
  - Favorites tab shows saved restaurants
  - Count badge on Favorites tab
- **Database Updates**
  - `Favorite` model for storing user favorites
  - Search and filter query params on API

### Changed
- Home page reorganized with search bar and section tabs
- RestaurantCard now accepts favorite props
- Restaurants API supports `?search=` and `?filter=trending|new` params

---

## [0.5.0] - 2026-01-04

### Added
- **Analytics Charts Page** (`/manage-2ad72e/analytics/charts`)
  - Visitors & Sessions area chart (daily trends)
  - Page Views & Conversions line chart
  - Average Session Duration bar chart
  - Filter Usage bar chart
  - Activity by Hour distribution
  - Device Breakdown pie chart (mobile/tablet/desktop)
  - Weekly Summary grouped bar chart
  - Time range selector (7 days, 30 days, 90 days)
- **Recharts library** for data visualization

### Changed
- Recent Activity now grouped by user with expandable details
- Click user block to see full activity history
- Analytics dashboard header now links to charts page

### Fixed
- Restaurant page views now correctly tracked with restaurant ID
- Added TrackRestaurantView component for server components
- Added ConversionButton component for tracking CTAs
- Admin pages excluded from analytics tracking

---

## [0.4.0] - 2026-01-04

### Added
- **Admin Security**
  - Moved admin to obscured URL (`/manage-2ad72e`) to prevent brute force
  - JWT-based authentication with 8-hour sessions
  - Login form with username/password
  - Environment variables for credentials (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`)
- **Analytics System**
  - Shadow profiles via browser fingerprinting
  - Session tracking (duration, device, referrer, landing/exit pages)
  - Event tracking (page views, filter usage, restaurant views, conversions)
  - Restaurant-level metrics (views, directions, calls, website clicks)
- **Analytics Dashboard** (`/manage-2ad72e/analytics`)
  - Overview stats (visitors, sessions, page views, avg duration)
  - Top restaurants by engagement
  - Conversion tracking (directions, calls, website clicks)
  - Filter usage analytics
  - Device breakdown (mobile/tablet/desktop)
  - Real-time activity feed
- **Database Schema Updates**
  - `Visitor` model for shadow profiles
  - `Session` model for visit tracking
  - `AnalyticsEvent` model for all interactions
  - Restaurant analytics aggregate fields

### Changed
- RestaurantCard now tracks clicks and conversions
- FilterBar tracks all filter interactions
- Layout wraps app in AnalyticsProvider

---

## [0.3.0] - 2026-01-04

### Added
- **Admin Dashboard** (`/admin` → now `/manage-2ad72e`)
  - Table view of all restaurants
  - Add/Edit modal with form validation
  - Delete confirmation
  - Cuisine and feature tag selection
  - Operating hours management
- **PostgreSQL Database** with Docker
  - `docker-compose.yml` for persistent storage
  - Prisma ORM integration
- **Database Schema**
  - `Restaurant` model with all fields
  - `Cuisine` and `Feature` lookup tables
  - Many-to-many relations (`RestaurantCuisine`, `RestaurantFeature`)
  - `RestaurantHours` for operating schedules
- **API Routes**
  - `GET/POST /api/restaurants` - List and create
  - `GET/PUT/DELETE /api/restaurants/[id]` - Read, update, delete
  - `GET /api/options` - Fetch cuisines and features
- **Database Seeding** - Initial 8 Ottawa restaurants

### Changed
- Frontend fetches data from API instead of static file
- Restaurant detail page uses Prisma queries

---

## [0.2.0] - 2026-01-04

### Changed
- **Switched from Mapbox to Leaflet**
  - No API key required
  - Uses free OpenStreetMap tiles
  - `react-leaflet` for React integration
  - Custom red pin markers with active states

### Removed
- Mapbox GL JS dependency
- Mapbox token requirement

---

## [0.1.0] - 2026-01-04

### Added
- **Project Setup**
  - Next.js 14 with App Router
  - TypeScript configuration
  - Tailwind CSS with custom color palette
- **Core Features**
  - Dual navigation (List + Map views)
  - Real-time filtering (cuisine, radius, features, price, open now)
  - Location detection with distance calculation
  - View toggle with synced selection
- **Components**
  - `Header` - Logo and navigation
  - `FilterBar` - Desktop dropdowns + mobile expandable filters
  - `RestaurantCard` - Card with badges, rating, quick actions
  - `MapView` - Interactive map with markers
- **Restaurant Detail Pages**
  - Dynamic routes (`/restaurant/[slug]`)
  - Full info display (hours, contact, features)
  - Embedded Google Map
  - CTAs (Directions, Call)
- **Data Layer**
  - Restaurant type definitions
  - 8 sample Ottawa restaurants
  - Distance calculation utility
  - Open now checker
- **Design System**
  - Primary Red: `#C62828`
  - Accent Yellow: `#F4B400`
  - Success Green: `#2E7D32`
  - Mobile-first responsive design
  - Halal verification badges

---

## Roadmap

### Planned Features
- [x] Search by dish/keyword
- [x] Favorites/saved restaurants
- [x] Menu with prices
- [ ] User reviews and ratings
- [ ] Prayer times widget
- [ ] Nearby mosques integration
- [ ] Restaurant owner dashboard
- [ ] Multi-city support (`/ottawa`, `/toronto`)
- [ ] Online ordering links
- [ ] Push notifications

See [FUTURE_FEATURES.md](./FUTURE_FEATURES.md) for the complete roadmap.
