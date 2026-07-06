import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouteFallback from "../design-system/components/RouteFallback";
import ErrorPage from "../components/portfolio-main/ErrorPage";
import { portfolioRoutes } from "./routes/portfolio.routes";
import { learningHubRoutes } from "./routes/learning-hub.routes";
import { tpcRoutes } from "./routes/tpc.routes";
import { visibleAppRoutes } from "./routes/visible-apps.routes";
import { hiddenAppRoutes } from "./routes/hidden-apps.routes";

const routes = [
  ...portfolioRoutes,
  ...learningHubRoutes,
  ...tpcRoutes,
  ...visibleAppRoutes,
  ...hiddenAppRoutes,
  { path: "*", element: <ErrorPage /> },
];

export default function App() {
  const element = useRoutes(routes);

  return (
    <div className="app-shell bg-site">
      <Suspense fallback={<RouteFallback />}>{element}</Suspense>

      <ToastContainer autoClose={3000} position="top-right" theme="dark" />
    </div>
  );
}
