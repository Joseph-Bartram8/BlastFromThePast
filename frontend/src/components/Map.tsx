import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const position: LatLngExpression = [54.9784, -1.6174]; // Newcastle upon Tyne default center

const Map = () => {
  return (
    <MapContainer
      center={position}
      zoom={6}
      className="relative z-0"
      style={{ width: "100%", height: "100%", minHeight: "500px", maxHeight: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default Map;
