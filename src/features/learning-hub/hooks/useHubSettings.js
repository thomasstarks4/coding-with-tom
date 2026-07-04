import { useHubSettingsContext } from "../context/HubSettingsContext";

export {
  HUB_SETTINGS_KEY,
  mergeStarters,
  loadHubSettings,
  saveHubSettings,
} from "./useHubSettings.storage";

export function useHubSettings() {
  return useHubSettingsContext();
}
