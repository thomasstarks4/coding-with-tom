import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loadHubSettings,
  saveHubSettings,
} from "../hooks/useHubSettings";

const HubSettingsContext = createContext(null);

export function HubSettingsProvider({ children }) {
  const [starters, setStartersState] = useState(() => loadHubSettings());
  const [lastSaved, setLastSaved] = useState(null);

  const setStarters = useCallback((updater) => {
    setStartersState(updater);
  }, []);

  useEffect(() => {
    try {
      saveHubSettings(starters);
      setLastSaved(Date.now());
    } catch {
      // Ignore quota or private-mode storage errors.
    }
  }, [starters]);

  const value = useMemo(
    () => ({ starters, setStarters, lastSaved }),
    [starters, setStarters, lastSaved],
  );

  return (
    <HubSettingsContext.Provider value={value}>
      {children}
    </HubSettingsContext.Provider>
  );
}

export function useHubSettingsContext() {
  const context = useContext(HubSettingsContext);
  if (!context) {
    throw new Error(
      "useHubSettings must be used within HubSettingsProvider",
    );
  }
  return context;
}
