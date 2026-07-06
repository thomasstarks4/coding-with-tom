import { useCallback, useState } from "react";
import {
  hasSeenToolGuide,
  markToolGuideSeen,
} from "./useToolGuide.storage";

export {
  HUB_GUIDE_KEY,
  loadToolGuides,
  saveToolGuides,
  hasSeenToolGuide,
  markToolGuideSeen,
} from "./useToolGuide.storage";

export function useToolGuide(toolId) {
  const [hasBeenSeen] = useState(() => hasSeenToolGuide(toolId));
  const [isExpanded, setIsExpanded] = useState(() => !hasSeenToolGuide(toolId));

  const markSeen = useCallback(() => {
    markToolGuideSeen(toolId);
    setIsExpanded(false);
  }, [toolId]);

  const toggle = useCallback(() => {
    setIsExpanded((expanded) => {
      const nextExpanded = !expanded;
      if (!nextExpanded) {
        markToolGuideSeen(toolId);
      }
      return nextExpanded;
    });
  }, [toolId]);

  const dismiss = useCallback(() => {
    markToolGuideSeen(toolId);
    setIsExpanded(false);
  }, [toolId]);

  return {
    isExpanded,
    hasBeenSeen,
    markSeen,
    toggle,
    dismiss,
  };
}
