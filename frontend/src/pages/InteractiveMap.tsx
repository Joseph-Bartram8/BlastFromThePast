import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMarkers } from "../hooks/useMarkers";
import L from "leaflet";
import { useState } from "react";
import { ShoppingCart, User, Calendar, MapPin } from "lucide-react";

// Function to create Lucide-based marker icons
const createMarkerIcon = (type: string) => {
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">`;

  switch (type) {
    case "store":
      iconSvg += `<path d="M6 6h12v10H6z"/><path d="M3 16V6l3-3h12l3 3v10h-3v4H6v-4H3z"/>`;
      break;
    case "collector":
      iconSvg += `<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>`;
      break;
    case "event":
      iconSvg += `<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>`;
      break;
    default:
      iconSvg += `<path d="M12 2a8 8 0 0 1 8 8c0 4.8-8 12-8 12s-8-7.2-8-12a8 8 0 0 1 8-8z"/><circle cx="12" cy="10" r="3"/>`;
  }

  iconSvg += `</svg>`;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(iconSvg)}`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const InteractiveMap = () => {
  const { markers, loading, error } = useMarkers();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Filter markers based on selected region
  const filteredMarkers = selectedRegion
    ? markers.filter((marker) => marker.region === selectedRegion)
    : markers;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Page Title */}
      <h2 className="text-3xl font-[Krona_one] text-black text-center mt-24 mb-6">
        Interactive Map
      </h2>

      {/* Map & Filters Container */}
      <div className="flex flex-row w-full h-[75vh] px-4">
        {/* Sidebar for Filters */}
        <div className="w-1/4 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold">Filter Options</h3>
          <div className="mt-4">
            <label className="block text-sm font-medium">Region:</label>
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
        </div>

        {/* Map Section */}
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

              {/* Render filtered Markers */}
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

                      {/* Profile Picture Display */}
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
