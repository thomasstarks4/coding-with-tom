import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { HubSettingsProvider } from "../context/HubSettingsContext";
import { useHubSettings } from "../hooks/useHubSettings";
import { HUB_SETTINGS_KEY } from "../hooks/useHubSettings.storage";
import { initialStarters } from "../data/starters";

function TunerProbe() {
  const { starters, setStarters } = useHubSettings();

  return (
    <div>
      <span data-testid="selected-count">
        {Object.values(starters).filter((s) => s.isShown).length}
      </span>
      <button
        type="button"
        onClick={() =>
          setStarters((prev) => ({
            ...prev,
            starter1: { ...prev.starter1, isShown: false },
          }))
        }
      >
        Hide starter1
      </button>
    </div>
  );
}

function StarterProbe() {
  const { starters } = useHubSettings();
  const shown = Object.values(starters).filter((s) => s.isShown).length;

  return <span data-testid="starter-count">{shown}</span>;
}

describe("HubSettingsProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shares starter settings across sibling consumers", () => {
    render(
      <HubSettingsProvider>
        <TunerProbe />
        <StarterProbe />
      </HubSettingsProvider>,
    );

    expect(screen.getByTestId("selected-count")).toHaveTextContent(
      String(Object.values(initialStarters).filter((s) => s.isShown).length),
    );
    expect(screen.getByTestId("starter-count")).toHaveTextContent(
      screen.getByTestId("selected-count").textContent,
    );

    act(() => {
      screen.getByRole("button", { name: /hide starter1/i }).click();
    });

    expect(screen.getByTestId("selected-count").textContent).toBe(
      screen.getByTestId("starter-count").textContent,
    );
    expect(localStorage.getItem(HUB_SETTINGS_KEY)).toContain('"isShown":false');
  });
});
