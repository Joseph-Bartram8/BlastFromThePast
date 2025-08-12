import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config"; 

// Define the structure of a marker based on API response
interface Marker {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  region: string;
  marker_type: string;
  created_at: string;
  user: {
    display_name: string;
    store_name?: string;
    first_name?: string;
    last_name?: string;
    profile_image?: string;
  };
}

const API_URL = `${API_BASE_URL}/markers`;

export function useMarkers() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch markers");
        }
        const data: Marker[] = await response.json();
        setMarkers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchMarkers();
  }, []);

  return { markers, loading, error };
}
