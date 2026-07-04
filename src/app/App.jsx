import { Suspense } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LearningHubNavbar from "../components/toms-learning-hub/components/Navbar";
import RouteFallback from "../design-system/components/RouteFallback";
import ErrorPage from "../components/portfolio-main/ErrorPage";
import { portfolioRoutes } from "./routes/portfolio.routes";
import { learningHubRoutes } from "./routes/learning-hub.routes";
import { tpcRoutes } from "./routes/tpc.routes";
import { visibleAppRoutes } from "./routes/visible-apps.routes";
import { hiddenAppRoutes } from "./routes/hidden-apps.routes";

function isLearningHubRoute(pathname) {
  return (
    pathname.startsWith("/sentence-starters") ||
    pathname.startsWith("/starter") ||
    pathname.startsWith("/tuner") ||
    pathname.startsWith("/highlighter") ||
    pathname.startsWith("/writer") ||
    pathname.startsWith("/math")
  );
}

const routes = [
  ...portfolioRoutes,
  ...learningHubRoutes,
  ...tpcRoutes,
  ...visibleAppRoutes,
  ...hiddenAppRoutes,
  { path: "*", element: <ErrorPage /> },
];

export default function App() {
  const location = useLocation();
  const learningHub = isLearningHubRoute(location.pathname);
  const element = useRoutes(routes);

  const shellClass = learningHub
    ? "app-shell bg-learning-hub"
    : "app-shell bg-site";

  return (
    <div className={shellClass}>
      {learningHub && <LearningHubNavbar />}

      <Suspense fallback={<RouteFallback />}>{element}</Suspense>

      <ToastContainer autoClose={3000} position="top-right" theme="dark" />
    </div>
  );
}
