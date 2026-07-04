import { lazy } from "react";

const MealTracker = lazy(
  () => import("../../components/portfolio-main/MealTrackingGuru"),
);
const SimplyDo = lazy(() => import("../../components/portfolio-main/SimplyDo"));
const BirthdayInvMaker = lazy(
  () => import("../../components/portfolio-main/BirthdayInvMaker"),
);
const OSRSWildernessHelper = lazy(
  () => import("../../components/portfolio-main/OSRSWildernessHelper"),
);
const GrowApp = lazy(() => import("../../components/grow-app/Grow"));

export const hiddenAppRoutes = [
  { path: "/meal-tracker", element: <MealTracker /> },
  { path: "/simplydo", element: <SimplyDo /> },
  { path: "/birthday-invitation-maker", element: <BirthdayInvMaker /> },
  { path: "/osrs-wilderness", element: <OSRSWildernessHelper /> },
  { path: "/grow-app", element: <GrowApp /> },
];
