import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./app/App";
import {
  getFeaturedProjects,
  getListedProjects,
  getVisibleProjects,
  TIER,
  projects,
} from "./config/project-registry";

describe("App", () => {
  it("renders the home page hero", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /Thomas Starks/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Full-Stack Software Engineer/i)).toBeInTheDocument();
  });

  it("renders projects page without hidden apps", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Tom's Learning Hub/i)).toBeInTheDocument();
    expect(screen.queryByText(/Meal Tracking Guru/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/SimplyDo/i)).not.toBeInTheDocument();
  });

  it("redirects /apps to /projects", () => {
    render(
      <MemoryRouter initialEntries={["/apps"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /^Projects$/i })).toBeInTheDocument();
  });
});

describe("project-registry", () => {
  it("only exposes featured and listed projects publicly", () => {
    const visible = getVisibleProjects();
    expect(visible.every((p) => p.tier !== TIER.HIDDEN)).toBe(true);
    expect(visible.length).toBe(
      getFeaturedProjects().length + getListedProjects().length,
    );
  });

  it("keeps store hidden", () => {
    const store = projects.find((p) => p.id === "store");
    expect(store).toBeUndefined();
  });
});
