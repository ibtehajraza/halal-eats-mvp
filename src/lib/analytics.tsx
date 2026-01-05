'use client';
import { useEffect, useRef, useCallback } from 'react';

// Generate fingerprint from browser characteristics
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    canvas.toDataURL(),
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  return 'v_' + Math.abs(hash).toString(36);
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function getVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = generateFingerprint();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

interface TrackOptions {
  eventType: string;
  eventName: string;
  page?: string;
  restaurantId?: string;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  const sessionStart = useRef(Date.now());
  const visitorId = useRef<string>('');
  const sessionId = useRef<string>('');

  useEffect(() => {
    visitorId.current = getVisitorId();
    sessionId.current = getSessionId();

    // End session on page unload
    const handleUnload = () => {
      const duration = Math.floor((Date.now() - sessionStart.current) / 1000);
      navigator.sendBeacon('/api/analytics/end-session', JSON.stringify({
        sessionId: sessionId.current,
        duration,
      }));
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const track = useCallback((options: TrackOptions) => {
    if (!visitorId.current) return;
    // Skip tracking on admin pages
    if (window.location.pathname.startsWith('/manage-')) return;

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: visitorId.current,
        sessionId: sessionId.current,
        ...options,
        metadata: {
          ...options.metadata,
          referrer: document.referrer,
          timestamp: Date.now(),
        },
      }),
    }).catch(() => {});
  }, []);

  const trackPageView = useCallback((page: string, restaurantId?: string) => {
    track({ eventType: 'page_view', eventName: 'page_view', page, restaurantId });
  }, [track]);

  const trackFilter = useCallback((filterName: string, filterValue: any) => {
    track({
      eventType: 'filter_use',
      eventName: filterName,
      page: window.location.pathname,
      metadata: { filterName, filterValue },
    });
  }, [track]);

  const trackRestaurantView = useCallback((restaurantId: string, restaurantName: string) => {
    track({
      eventType: 'restaurant_view',
      eventName: 'restaurant_card_click',
      restaurantId,
      metadata: { restaurantName },
    });
  }, [track]);

  const trackConversion = useCallback((action: string, restaurantId: string, restaurantName: string) => {
    track({
      eventType: 'conversion',
      eventName: action,
      restaurantId,
      page: window.location.pathname,
      metadata: { restaurantName, action },
    });
  }, [track]);

  return { track, trackPageView, trackFilter, trackRestaurantView, trackConversion };
}

// Provider component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Skip tracking on admin pages
    if (window.location.pathname.startsWith('/manage-')) return;
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  return <>{children}</>;
}
