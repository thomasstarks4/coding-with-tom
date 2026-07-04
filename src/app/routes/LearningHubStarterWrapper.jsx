import Starter from "../../components/toms-learning-hub/components/Starter";
import Tuner from "../../components/toms-learning-hub/components/Tuner";
import { useHubSettings } from "../../features/learning-hub/hooks/useHubSettings";

export default function LearningHubStarterWrapper({ tool }) {
  const { starters, setStarters, lastSaved } = useHubSettings();

  if (tool === "tuner") {
    return (
      <Tuner
        startersSelected={starters}
        setStartersSelected={setStarters}
        lastSaved={lastSaved}
      />
    );
  }

  return <Starter startersSelected={starters} />;
}
