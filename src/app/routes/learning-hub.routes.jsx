import { lazy, Suspense } from "react";
import RouteFallback from "../../design-system/components/RouteFallback";
import LearningHubStarterWrapper from "./LearningHubStarterWrapper";

const LearningHubHome = lazy(
  () => import("../../components/toms-learning-hub/components/Home"),
);
const Writer = lazy(
  () => import("../../components/toms-learning-hub/components/Writer"),
);
const WordHighlighter = lazy(
  () => import("../../components/toms-learning-hub/components/WordHighLighter"),
);
const MathGenerator = lazy(
  () => import("../../components/toms-learning-hub/components/MathGenerator"),
);

function withSuspense(Component) {
  return function Wrapped(props) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

const LazyHome = withSuspense(LearningHubHome);
const LazyWriter = withSuspense(Writer);
const LazyHighlighter = withSuspense(WordHighlighter);
const LazyMath = withSuspense(MathGenerator);

function StarterRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <LearningHubStarterWrapper tool="starter" />
    </Suspense>
  );
}

function TunerRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <LearningHubStarterWrapper tool="tuner" />
    </Suspense>
  );
}

export const learningHubRoutes = [
  { path: "/math", element: <LazyMath /> },
  { path: "/highlighter", element: <LazyHighlighter /> },
  { path: "/sentence-starters", element: <LazyHome /> },
  { path: "/starter", element: <StarterRoute /> },
  { path: "/tuner", element: <TunerRoute /> },
  { path: "/writer", element: <LazyWriter /> },
];
