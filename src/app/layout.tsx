import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsProvider } from '@/lib/analytics';

export const metadata: Metadata = {
  title: 'Halal Eats Ottawa | Find Halal Restaurants Near You',
  description: 'Discover halal restaurants in Ottawa. Browse by cuisine, location, and more.',
  keywords: 'halal food, ottawa, halal restaurants, muslim food, halal directory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body className="bg-neutral-bg min-h-screen">
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
