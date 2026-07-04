import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import RouteFallback from "../../design-system/components/RouteFallback";
import LearningHubLayout from "../../features/learning-hub/layout/LearningHubLayout";

const LearningHubHome = lazy(
  () => import("../../features/learning-hub/pages/Home"),
);
const Writer = lazy(
  () => import("../../features/learning-hub/tools/writer/Writer"),
);
const WordHighlighter = lazy(
  () => import("../../features/learning-hub/tools/word-highlighter/WordHighlighter"),
);
const MathGenerator = lazy(
  () => import("../../features/learning-hub/tools/math/MathGenerator"),
);
const MathQuizPage = lazy(
  () => import("../../features/learning-hub/tools/math/quiz/MathQuizPage"),
);
const SentenceStarterPage = lazy(
  () => import("../../features/learning-hub/tools/starter/SentenceStarterPage"),
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
const LazyMathQuiz = withSuspense(MathQuizPage);
const LazySentenceStarter = withSuspense(SentenceStarterPage);

export const learningHubRoutes = [
  {
    element: <LearningHubLayout />,
    children: [
      { path: "/math", element: <LazyMath /> },
      { path: "/math/quiz", element: <LazyMathQuiz /> },
      { path: "/highlighter", element: <LazyHighlighter /> },
      { path: "/sentence-starters", element: <LazyHome /> },
      { path: "/starter", element: <LazySentenceStarter /> },
      { path: "/tuner", element: <Navigate to="/starter#configure" replace /> },
      { path: "/writer", element: <LazyWriter /> },
    ],
  },
];
