import { Outlet } from "react-router-dom";
import { HubSettingsProvider } from "../context/HubSettingsContext";
import LearningHubNavbar from "./LearningHubNavbar";
import "../styles/hub-tokens.css";
import "../styles/print.css";

export default function LearningHubLayout() {
  return (
    <HubSettingsProvider>
      <div className="bg-learning-hub flex min-h-screen flex-col text-slate-800">
        <LearningHubNavbar />
        <main className="hub-content flex-1 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </HubSettingsProvider>
  );
}
