import { useState } from "react";
import Starter from "../../components/toms-learning-hub/components/Starter";
import Tuner from "../../components/toms-learning-hub/components/Tuner";
import { initialStarters } from "../../features/learning-hub/data/starters";

export default function LearningHubStarterWrapper({ tool }) {
  const [startersSelected, setStartersSelected] = useState(initialStarters);

  if (tool === "tuner") {
    return (
      <Tuner
        startersSelected={startersSelected}
        setStartersSelected={setStartersSelected}
      />
    );
  }

  return (
    <Starter
      startersSelected={startersSelected}
      setStartersSelected={setStartersSelected}
    />
  );
}
