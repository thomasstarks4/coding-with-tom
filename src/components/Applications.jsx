import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import attackingKnight from "../media/animations/knight-attack.gif";
import "./styles/Applications.css";

function Applications() {
  useEffect(() => {
    const appElement = document.querySelector(".app-container");
    appElement.classList.add("fade-in");
  }, []);

  return (
    <div className="app-container">
      <div className="container col">
        <img src={attackingKnight} alt="Attacking Knight" className="app-image" />
        <h1 className="center apps-header">Applications</h1>
      </div>
      <div className="center container">
        <ul className="app-list">
          <li>
            <Link to="/math" className="interactive-link">SimplyMathHW</Link>
          </li>
          <li>
            <Link to="/sentence-starters" className="interactive-link">Tom's Learning Hub</Link>
          </li>
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="http://www.myrepbro.com"
              className="interactive-link"
            >
              MyRepBro
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Applications;
