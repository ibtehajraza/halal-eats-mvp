# Halal Eats Ottawa

A modern, mobile-first directory for discovering halal restaurants in Ottawa. Features dual navigation (list + map), smart filtering, location-based search, menu display, and a full admin dashboard with analytics.

## Features

- **41 Verified Restaurants** - Real Ottawa halal restaurants with verified addresses
- **Menu Display** - View menu items with prices on each restaurant page
- **Dual Navigation** - List view and interactive Leaflet map
- **Smart Filtering** - Cuisine, radius, features, price range, open now
- **Search** - Find restaurants by name, cuisine, or dish
- **Location-Based** - Auto-detects user location, shows distance
- **Favorites** - Save restaurants to your personal list
- **Restaurant Details** - Full info pages with hours, contact, menu, directions
- **Admin Dashboard** - CRUD operations for restaurants
- **Analytics** - User tracking, conversions, shadow profiles
- **Mobile-First** - Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap (no API key needed)
- **Auth**: JWT sessions
- **Container**: Docker

---

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### 1. Clone & Install

```bash
cd Opus_Halal_Directory
npm install
```

### 2. Start Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432 with:
- User: `halal_user`
- Password: `halal_pass`
- Database: `halal_directory`

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://halal_user:halal_pass@localhost:5432/halal_directory"

# Admin credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_JWT_SECRET=generate-a-random-32-char-string

# Optional: Google Maps for embedded maps on detail pages
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Create tables
npx prisma db push

# Seed with sample restaurants
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## URLs

| URL | Description |
|-----|-------------|
| `/` | Main directory (list + map views) |
| `/restaurant/[slug]` | Restaurant detail page |
| `/manage-2ad72e` | Admin dashboard (protected) |
| `/manage-2ad72e/analytics` | Analytics overview |
| `/manage-2ad72e/analytics/charts` | Analytics charts & graphs |

> **Note**: Admin URL is obscured to prevent brute force attacks. Change it in production by renaming the folder.

---

## Admin Dashboard

Access: `http://localhost:3000/manage-2ad72e`

Login with credentials from `.env.local`, then you can:
- View all restaurants
- Add new restaurants
- Edit existing restaurants
- Delete restaurants
- View analytics

---

## Analytics

The system tracks:

| Metric | Description |
|--------|-------------|
| **Visitors** | Unique users via browser fingerprint |
| **Sessions** | Visit duration, device, referrer |
| **Page Views** | Every page visited |
| **Filter Usage** | Which filters users apply |
| **Restaurant Views** | Which restaurants get clicked |
| **Conversions** | Directions, calls, website clicks |

### Analytics Dashboard

Access at `/manage-2ad72e/analytics`:
- Overview stats (visitors, sessions, page views)
- Top restaurants by engagement
- Conversion tracking
- Recent activity grouped by user (expandable)

### Analytics Charts

Access at `/manage-2ad72e/analytics/charts`:
- Visitors & Sessions over time
- Page Views & Conversions trends
- Average session duration
- Filter usage patterns
- Activity by hour of day
- Device breakdown (mobile/tablet/desktop)
- Weekly summary comparisons
- Selectable time ranges (7/30/90 days)

### Business Value

For each restaurant, you can show:
- Total page views
- Directions requested (foot traffic indicator)
- Phone calls initiated
- Website clicks

---

## Project Structure

```
├── docker-compose.yml      # PostgreSQL container
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout + analytics
│   │   ├── globals.css                 # Styles
│   │   ├── restaurant/[slug]/page.tsx  # Detail page
│   │   ├── manage-2ad72e/              # Admin (protected)
│   │   │   ├── page.tsx                # Restaurant CRUD
│   │   │   └── analytics/
│   │   │       ├── page.tsx            # Analytics overview
│   │   │       └── charts/page.tsx     # Analytics charts
│   │   └── api/
│   │       ├── restaurants/            # CRUD endpoints
│   │       ├── options/                # Cuisines & features
│   │       ├── auth/                   # Login & session check
│   │       └── analytics/              # Tracking & dashboard
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── FilterBar.tsx
│   │   ├── RestaurantCard.tsx
│   │   └── MapView.tsx
│   └── lib/
│       ├── prisma.ts       # Database client
│       ├── data.ts         # Utilities
│       └── analytics.tsx   # Tracking hooks
```

---

## Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database (delete all data)
npx prisma db push --force-reset
npx prisma db seed

# Create migration (for production)
npx prisma migrate dev --name description

# Apply migrations (production)
npx prisma migrate deploy
```

---

## Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and delete data
docker-compose down -v

# View logs
docker-compose logs -f db
```

---

## Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
ADMIN_USERNAME=secure_admin
ADMIN_PASSWORD=very_secure_password
ADMIN_JWT_SECRET=random-64-char-production-secret
```

### 3. Database

Use a managed PostgreSQL service:
- AWS RDS
- Supabase
- Neon
- PlanetScale (with adapter)

### 4. Run Migrations

```bash
npx prisma migrate deploy
```

---

## Adding Restaurants

### Via Admin UI
1. Go to `/manage-2ad72e`
2. Login
3. Click "Add Restaurant"
4. Fill form and save

### Via Database Seed

Edit `prisma/seed.ts` and run:

```bash
npx prisma db seed
```

---

## Customization

### Change Admin URL

Rename the folder:
```bash
mv src/app/manage-2ad72e src/app/your-secret-path
```

Update links in the code accordingly.

### Add Cuisines/Features

Edit `prisma/seed.ts`:

```typescript
const cuisines = ['Desi', 'Arabic', 'Your New Cuisine', ...];
const features = ['Dine-in', 'Your New Feature', ...];
```

Then reseed or add via Prisma Studio.

### Color Palette

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: { DEFAULT: '#C62828' },  // Red
  accent: { DEFAULT: '#F4B400' },   // Yellow
  success: '#2E7D32',               // Green
}
```

---

## Troubleshooting

### Database connection failed
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose down && docker-compose up -d
```

### Prisma client outdated
```bash
npx prisma generate
```

### Port 5432 in use
```bash
# Change port in docker-compose.yml
ports:
  - "5433:5432"

# Update DATABASE_URL
DATABASE_URL="postgresql://halal_user:halal_pass@localhost:5433/halal_directory"
```

### Admin login not working
- Check `.env.local` has correct credentials
- Restart dev server after changing env vars
- Clear cookies and try again

---

## License

MIT
