import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import attackingKnight from "./media/animations/knight-attack.gif";
import "./styles/Applications.css";
// Component rendering the links to different applications I've made
function Applications() {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Application list
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
    {
      to: "/simplydo",
      label: "To Do List/Task Manager (SimplyDo)",
      external: false,
    },
    {
      to: "/progress-tracker",
      label: "Track your progress on projects!",
      external: false,
    },
    {
      to: "/grow-app",
      label: "Track your progress on projects!",
      external: false,
    },
  ];

  // Filter apps based on search query
  const filteredApps = apps.filter((app) =>
    app.label.toLowerCase().includes(queryText.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle fade-in animation
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.classList.add("fade-in");
    }
  }, []);

  // Handle input focus and change
  const handleInputFocus = () => {
    if (queryText.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputChange = (e) => {
    setQueryText(e.target.value);
    setIsDropdownOpen(e.target.value.length > 0);
  };

  // Toggle show all apps
  const toggleShowAll = () => {
    setShowAllApps(!showAllApps);
    setQueryText("");
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="bg-slate-900 flex-1 flex flex-col justify-center items-center min-h-[85%] p-4"
      ref={containerRef}
    >
      <div className="flex flex-col justify-center items-center">
        <img
          src={attackingKnight}
          alt="Attacking Knight"
          className="app-image"
        />
        <h1 className="flex justify-center items-center text-teal-600 font-extrabold apps-header text-3xl mb-4">
          Applications
        </h1>
      </div>
      <div className="w-full max-w-md relative" ref={inputRef}>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white font-extrabold text-xl mb-4">
            Welcome to my portfolio,{" "}
            <span className="text-teal-600">CodingWithTom</span>
          </h1>
          <div className="flex items-center w-full">
            <input
              type="text"
              value={queryText}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Search for apps..."
              className="flex-1 text-black text-center text-sm p-2 m-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              disabled={showAllApps}
            />
            <button
              onClick={toggleShowAll}
              className="m-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-all duration-300 ease-in-out"
            >
              {showAllApps ? "Show Search" : "Show All"}
            </button>
          </div>
        </div>
        {!showAllApps && isDropdownOpen && filteredApps.length > 0 && (
          <div className=" w-full max-w-md bg-slate-800 border border-slate-500 rounded-lg mt-1 max-h-64 overflow-y-auto z-10">
            <div className="flex flex-col items-center gap-2 p-2">
              {filteredApps.map((app, idx) => (
                <span key={idx} className="w-full">
                  {app.external ? (
                    <a
                      href={app.to}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-teal-600 text-sm hover:text-teal-400 hover:bg-slate-700 rounded-lg p-2 transition-all duration-300 ease-in-out"
                    >
                      {app.label}
                    </a>
                  ) : (
                    <div
                      onClick={() => {
                        navigate(app.to);
                        setIsDropdownOpen(false);
                        setQueryText("");
                      }}
                      className="block w-full text-teal-600 text-sm hover:text-teal-400 hover:bg-slate-700 rounded-lg p-2 transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      {app.label}
                    </div>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
        {!showAllApps &&
          isDropdownOpen &&
          queryText.length > 0 &&
          filteredApps.length === 0 && (
            <div className="absolute w-full max-w-md bg-slate-800 border border-slate-500 rounded-lg mt-1 p-2 z-10">
              <p className="text-white text-sm text-center">No apps found</p>
            </div>
          )}
      </div>
      {showAllApps && (
        <div className="center font-bold border-2 border-slate-500 bg-slate-800 p-4 rounded-lg mb-4 mt-4 w-full max-w-md">
          <div className="flex flex-col items-center gap-2">
            {apps.map((app, idx) => (
              <span key={idx}>
                {app.external ? (
                  <div className="hover:py-4 transition-all duration-300 ease-in-out hover:bg-slate-700 rounded-lg bg-none w-full">
                    <a
                      href={app.to}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-teal-600 text-xl hover:text-teal-400 hover:bg-slate-700 rounded-lg p-2 bg-none transition-all duration-300 ease-in-out"
                    >
                      {app.label}
                    </a>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      navigate(app.to);
                    }}
                    className="hover:py-4 hover:bg-slate-700 rounded-lg p-2 bg-none transition-all duration-300 ease-in-out w-full"
                  >
                    <Link
                      to={app.to}
                      className="block text-teal-600 text-xl hover:text-teal-400 hover:bg-slate-700 rounded-lg p-2 bg-none transition-all duration-300 ease-in-out"
                    >
                      {app.label}
                    </Link>
                  </div>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;
