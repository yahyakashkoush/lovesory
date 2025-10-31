'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Custom hook for fetching fresh content from database
 * Implements aggressive cache busting and real-time updates
 */
export function useFreshContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const lastFetchRef = useRef(null);

  const fetchContent = useCallback(async (forceRefresh = true) => {
    try {
      // Generate unique identifier for each request
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Build URL with multiple cache-busting parameters
      const url = new URL('/api/content', window.location.origin);
      url.searchParams.append('t', Date.now());
      url.searchParams.append('_', uniqueId);
      url.searchParams.append('cache', 'false');
      url.searchParams.append('v', Math.random());

      console.log(`[useFreshContent] Fetching from: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '-1',
          'Surrogate-Control': 'no-store',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Request-ID': uniqueId,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[useFreshContent] Data fetched successfully:', data);
      
      // Only update if data actually changed
      if (JSON.stringify(lastFetchRef.current) !== JSON.stringify(data)) {
        setContent(data);
        lastFetchRef.current = data;
        console.log('[useFreshContent] Content updated');
      }
      
      setError(null);
    } catch (err) {
      console.error('[useFreshContent] Error fetching content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Set up polling with aggressive refresh
  useEffect(() => {
    // Poll every 1 second for real-time updates
    intervalRef.current = setInterval(() => {
      fetchContent();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchContent]);

  // Manual refresh function
  const refresh = useCallback(() => {
    console.log('[useFreshContent] Manual refresh triggered');
    return fetchContent(true);
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refresh
  };
}
