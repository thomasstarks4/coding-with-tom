import { lazy, Suspense } from "react";
import RouteFallback from "../../design-system/components/RouteFallback";

const TpcHome = lazy(
  () => import("../../components/truly-private-chat/components/Home"),
);
const TpcChat = lazy(
  () => import("../../components/truly-private-chat/components/Chat"),
);
const TpcAbout = lazy(
  () => import("../../components/truly-private-chat/components/About"),
);

function withSuspense(Component) {
  return function Wrapped() {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Component />
      </Suspense>
    );
  };
}

const LazyHome = withSuspense(TpcHome);
const LazyChat = withSuspense(TpcChat);
const LazyAbout = withSuspense(TpcAbout);

export const tpcRoutes = [
  { path: "/tpc/home", element: <LazyHome /> },
  { path: "/tpc/chat", element: <LazyChat /> },
  { path: "/tpc/about", element: <LazyAbout /> },
];
