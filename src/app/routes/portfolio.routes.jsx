import Home from "../../features/portfolio/Home";
import About from "../../features/portfolio/About";
import Contact from "../../features/portfolio/Contact";
import Projects from "../../features/portfolio/Projects";
import { Navigate } from "react-router-dom";

export const portfolioRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/projects", element: <Projects /> },
  { path: "/apps", element: <Navigate to="/projects" replace /> },
];
