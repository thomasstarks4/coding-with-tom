import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./app/App";

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
});
