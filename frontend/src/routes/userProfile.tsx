import { createRoute } from "@tanstack/react-router";
import { Route } from "./__root";
import UserProfile from "../pages/UserProfile";

export const userProfileRoute = createRoute({
  getParentRoute: () => Route,
  path: "$username",
  component: UserProfile,
});
