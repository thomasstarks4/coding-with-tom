import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import attackingKnight from "./media/animations/knight-attack.gif";
import "./styles/Applications.css";

function Applications() {
  const navigate = useNavigate();
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
    {
      to: "/tpc/home",
      label: "Truly Private Chat (Peer-to-Peer Chat App)",
      external: false,
    },
    {
      to: "/birthday-invitation-maker",
      label: "Birthday Invitation Maker (Web App)",
      external: false,
    },
  ];

  return (
    <div
      className="bg-slate-900 flex-1 flex flex-col justify-center items-center"
      ref={containerRef}
    >
      <div className=" flex flex-col justify-center items-center">
        <img
          src={attackingKnight}
          alt="Attacking Knight"
          className="app-image"
        />
        <h1 className="flex justify-center items-center text-white font-extrabold apps-header text-2xl mb-4">
          Applications
        </h1>
      </div>

      <div className="center font-bold border-2 border-slate-500 bg-slate-800 p-4 rounded-lg mb-4">
        <div className="flex flex-col items-center gap-2">
          {apps.map((app, idx) => (
            <span key={idx}>
              {app.external ? (
                <div className="hover:py-4 transition-all duration-300 ease-in-out  hover:bg-slate-700 rounded-lg bg-none">
                  <a
                    href={app.to}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 text-xl hover:text-teal-400 hover:py-4 hover:bg-slate-700 rounded-lg p-2 bg-none transition-all duration-300 ease-in-out "
                  >
                    {app.label}
                  </a>
                </div>
              ) : (
                <div
                  onClick={() => {
                    navigate(app.to);
                  }}
                  className="hover:py-4 hover:bg-slate-700 rounded-lg p-2 bg-none transition-all duration-300 ease-in-out "
                >
                  <Link
                    to={app.to}
                    className="text-teal-600 text-xl hover:text-teal-400 hover:py-4 hover:bg-slate-700 rounded-lg p-2 bg-none transition-all duration-300 ease-in-out "
                  >
                    {app.label}
                  </Link>
                </div>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Applications;
