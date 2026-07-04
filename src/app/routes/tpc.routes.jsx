import Home3 from "../../components/truly-private-chat/components/Home";
import Chat from "../../components/truly-private-chat/components/Chat";
import TPCAbout from "../../components/truly-private-chat/components/About";

export const tpcRoutes = [
  { path: "/tpc/home", element: <Home3 /> },
  { path: "/tpc/chat", element: <Chat /> },
  { path: "/tpc/about", element: <TPCAbout /> },
];
