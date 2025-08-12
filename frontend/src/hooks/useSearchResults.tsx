import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export interface SearchResult {
  id: string;
  display_name: string;
  store_name?: string;
  profile_image?: string;
  show_real_name: boolean;
  first_name?: string;
  last_name?: string;
  updated_at?: string;
}

const API_URL = `${API_BASE_URL}/users/search`;

export const useSearchResults = (query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setResults(data);
        setError(null);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query]);

  return { results, loading, error };
};
