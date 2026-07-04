import Home2 from "../../components/toms-learning-hub/components/Home";
import Writer from "../../components/toms-learning-hub/components/Writer";
import WordHighlighter from "../../components/toms-learning-hub/components/WordHighLighter";
import MathGenerator from "../../components/toms-learning-hub/components/MathGenerator";
import LearningHubStarterWrapper from "./LearningHubStarterWrapper";

export const learningHubRoutes = [
  { path: "/math", element: <MathGenerator /> },
  { path: "/highlighter", element: <WordHighlighter /> },
  { path: "/sentence-starters", element: <Home2 /> },
  { path: "/starter", element: <LearningHubStarterWrapper tool="starter" /> },
  { path: "/tuner", element: <LearningHubStarterWrapper tool="tuner" /> },
  { path: "/writer", element: <Writer /> },
];
