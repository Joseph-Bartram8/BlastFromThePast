import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#212121] text-white">
          <Outlet />
        </main>
        <TanStackRouterDevtools />
      </>
    );
  },
});
