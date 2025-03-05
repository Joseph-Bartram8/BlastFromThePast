import { createFileRoute } from "@tanstack/react-router";
import Map from "../pages/InteractiveMap";

export const Route = createFileRoute("/mapPage")({
  component: Map,
});