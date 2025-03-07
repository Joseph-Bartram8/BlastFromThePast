import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMarkers } from "../hooks/useMarkers";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet.AwesomeMarkers not being recognized
declare global {
  interface Window {
    L: typeof L;
  }
}

const InteractiveMap = () => {
  const { markers, loading, error } = useMarkers();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Ensure Leaflet is registered globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.L = L;
    }
  }, []);

  // Create AwesomeMarkers-based icons
  const createMarkerIcon = (type: string) => {
    return (window.L as any).AwesomeMarkers.icon({
      icon: type === "store" ? "shopping-cart" : "map-marker-alt",
      markerColor: type === "store" ? "purple" : "blue",
      prefix: "fa",
    });
  };

  // Filter markers based on selected region
  const filteredMarkers = selectedRegion
    ? markers.filter((marker) => marker.region === selectedRegion)
    : markers;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      <h2 className="text-3xl font-[Krona_one] text-black text-center mt-24 mb-6">
        Interactive Map
      </h2>

      <div className="flex flex-row w-full h-[75vh] px-4">
        <div className="w-1/4 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold">Filter Options</h3>
          <select
            className="w-full border rounded-md p-2 mt-1"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            <option value="North East">North East</option>
            <option value="North West">North West</option>
            <option value="Yorkshire and the Humber">Yorkshire and the Humber</option>
            <option value="West Midlands">West Midlands</option>
            <option value="East Midlands">East Midlands</option>
            <option value="South West">South West</option>
            <option value="South East">South East</option>
            <option value="London">London</option>
            <option value="East of England">East of England</option>
          </select>
        </div>

        <div className="w-3/4 h-[100%] bg-white shadow-md rounded-lg relative z-10">
          {loading ? (
            <p className="text-center text-gray-500 mt-4">Loading markers...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">{error}</p>
          ) : (
            <MapContainer
              center={[54.0, -2.0]}
              zoom={6}
              minZoom={2}
              maxZoom={15}
              maxBounds={[[-90, -180], [90, 180]]}
              maxBoundsViscosity={1.0}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {filteredMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.latitude, marker.longitude]}
                  icon={createMarkerIcon(marker.marker_type)}
                >
                  <Popup>
                    <div className="flex flex-col items-center">
                      <h3 className="font-bold text-lg">{marker.name}</h3>
                      <p className="text-gray-700">{marker.description || "No description available"}</p>
                      <p className="text-gray-600 text-sm"><strong>Region:</strong> {marker.region}</p>
                      <p className="text-gray-600 text-sm"><strong>Added by:</strong> {marker.user.display_name}</p>

                      <div className="mt-3 flex flex-col items-center">
                        <img
                          src="/tempProfile.png"
                          alt="Profile"
                          className="w-16 h-16 rounded-full shadow-md"
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
