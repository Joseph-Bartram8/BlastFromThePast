import { createFileRoute } from "@tanstack/react-router";
import ProtectedRoute from "../components/ProtectedRoute";

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <ProtectedRoute>
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
    </ProtectedRoute>
  );
}
