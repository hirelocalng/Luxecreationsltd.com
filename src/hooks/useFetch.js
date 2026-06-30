import { useState, useEffect } from 'react';

/**
 * Fetches data from the API on mount.
 * @param {() => Promise<{ data: any[] }>} fetcher - A function that returns a promise resolving to { data }
 * @param {any[]} fallback - Data to use when the API is unreachable or returns empty
 * @returns {{ items: any[], loading: boolean, error: string|null }}
 */
export function useFetch(fetcher, fallback = []) {
  const [items, setItems] = useState(null); // null = not yet fetched
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then(({ data }) => {
        if (cancelled) return;
        // Use API data if it has items, otherwise fall back silently
        setItems(Array.isArray(data) && data.length > 0 ? data : fallback);
      })
      .catch(() => {
        if (cancelled) return;
        // API unreachable — fall back to hardcoded data silently
        setItems(fallback);
        setError('api_unavailable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // While loading, return fallback so the page never goes blank
  return { items: items ?? fallback, loading, error };
}
