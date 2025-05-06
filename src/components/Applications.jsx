import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import attackingKnight from "../media/animations/knight-attack.gif";
import "./styles/Applications.css";

function Applications() {
  // Use a ref to avoid direct document.querySelector
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.classList.add("fade-in");
    }
  }, []);

  // A small array to store links (internal vs. external) to simplify routing
  const apps = [
    {
      to: "/math",
      label: "SimplyMathHW (Math Problem Generator for Grades 1-2)",
      external: false,
    },
    {
      to: "/sentence-starters",
      label: "Tom's Learning Hub (Reading & Writing resources for Grades 1-2)",
      external: false,
    },
    {
      to: "/JavaScriptIDE",
      label: "JavaScript Code Compiler (IDE)",
      external: false,
    },
    {
      to: "http://www.myrepbro.com",
      label: "MyRepBro (Workout/Fitness Tracker)",
      external: true,
    },
    {
      to: "/meal-tracker",
      label: "Meal Tracking Guru (Calorie Tracker)",
      external: false,
    },
  ];

  return (
    <div className="app-container bg-slate-900 p-4" ref={containerRef}>
      <div className=" col">
        <img
          src={attackingKnight}
          alt="Attacking Knight"
          className="app-image"
        />
        <h1 className="text-center text-white font-extrabold apps-header text-2xl mb-4">
          Applications
        </h1>
      </div>

      <div className="center font-bold">
        <ul className="app-list">
          {apps.map((app, idx) => (
            <li key={idx}>
              {app.external ? (
                <a
                  href={app.to}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-link"
                >
                  {app.label}
                </a>
              ) : (
                <Link to={app.to} className="interactive-link">
                  {app.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Applications;
