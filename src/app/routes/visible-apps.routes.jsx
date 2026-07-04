import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import AppShell from "../../design-system/components/AppShell";
import GameShell from "../../design-system/components/GameShell";
import RouteFallback from "../../design-system/components/RouteFallback";

const JavaScriptIDE = lazy(
  () => import("../../components/portfolio-main/JavaScriptIDE"),
);
const ProgressTracker = lazy(
  () => import("../../components/portfolio-main/ProgressTracker/ProgressTracker"),
);
const GardenLabelMaker = lazy(
  () => import("../../components/portfolio-main/GardenLabelMaker"),
);
const SpiritQuest = lazy(
  () => import("../../components/portfolio-main/games/spirit-quest"),
);
const ForestPlatformer = lazy(
  () => import("../../components/portfolio-main/games/forest-platformer"),
);

function withAppShell(title, Component) {
  return function Wrapped() {
    return (
      <AppShell title={title}>
        <Suspense fallback={<RouteFallback />}>
          <Component />
        </Suspense>
      </AppShell>
    );
  };
}

function withGameShell(title, Component) {
  return function Wrapped() {
    return (
      <GameShell title={title}>
        <Suspense fallback={<RouteFallback />}>
          <Component />
        </Suspense>
      </GameShell>
    );
  };
}

const JavaScriptIDERoute = withAppShell("JavaScript IDE", JavaScriptIDE);
const ProgressTrackerRoute = withAppShell("Progress Tracker", ProgressTracker);
const GardenLabelMakerRoute = withAppShell("Plant Label Studio", GardenLabelMaker);
const SpiritQuestRoute = withGameShell("Spirit Quest", SpiritQuest);
const ForestPlatformerRoute = withGameShell("Forest Platformer", ForestPlatformer);

export const visibleAppRoutes = [
  { path: "/JavaScriptIDE", element: <JavaScriptIDERoute /> },
  { path: "/progress-tracker", element: <ProgressTrackerRoute /> },
  { path: "/label-maker", element: <GardenLabelMakerRoute /> },
  { path: "/label-maker2", element: <Navigate to="/label-maker" replace /> },
  { path: "/label-maker-2", element: <Navigate to="/label-maker" replace /> },
  { path: "/games/spirit-quest", element: <SpiritQuestRoute /> },
  { path: "/games/forest-platformer", element: <ForestPlatformerRoute /> },
];
