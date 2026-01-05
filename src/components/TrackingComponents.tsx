'use client';
import { useEffect } from 'react';
import { useAnalytics } from '@/lib/analytics';

export function TrackRestaurantView({ restaurantId, restaurantName }: { restaurantId: string; restaurantName: string }) {
  const { trackPageView, trackConversion } = useAnalytics();

  useEffect(() => {
    trackPageView(`/restaurant/${restaurantId}`, restaurantId);
  }, [restaurantId, trackPageView]);

  return null;
}

export function ConversionButton({ 
  restaurantId, 
  restaurantName, 
  action, 
  href, 
  children, 
  className 
}: { 
  restaurantId: string; 
  restaurantName: string; 
  action: 'directions_click' | 'call_click' | 'website_click';
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { trackConversion } = useAnalytics();

  const handleClick = () => {
    trackConversion(action, restaurantId, restaurantName);
  };

  return (
    <a href={href} onClick={handleClick} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}
