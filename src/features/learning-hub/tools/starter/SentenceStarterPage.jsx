import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HubToolPageHeader from "../../layout/HubToolPageHeader";
import { useHubSettings } from "../../hooks/useHubSettings";
import { countShownStarters } from "./countShownStarters";
import TunerPanel from "./TunerPanel";
import StarterPractice from "./StarterPractice";

export default function SentenceStarterPage() {
  const { starters, setStarters, lastSaved } = useHubSettings();
  const selectedCount = countShownStarters(starters);
  const location = useLocation();

  const [configureExpanded, setConfigureExpanded] = useState(() => {
    if (location.hash === "#configure") {
      return true;
    }
    return selectedCount === 0;
  });

  useEffect(() => {
    if (selectedCount === 0) {
      setConfigureExpanded(true);
    }
  }, [selectedCount]);

  useEffect(() => {
    if (location.hash === "#configure") {
      setConfigureExpanded(true);
      document.getElementById("configure")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <div className="mx-auto w-full max-w-5xl px-1 sm:px-0">
      <HubToolPageHeader toolId="starter" />

      <TunerPanel
        starters={starters}
        setStarters={setStarters}
        lastSaved={lastSaved}
        expanded={configureExpanded}
        onExpandedChange={setConfigureExpanded}
        collapsible={selectedCount > 0}
      />

      <StarterPractice starters={starters} className="mt-6" />
    </div>
  );
}
