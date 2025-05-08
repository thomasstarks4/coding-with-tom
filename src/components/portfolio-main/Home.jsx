import React from "react";
import gifPath from "./media/animations/knight-idle.gif";
import { Link } from "react-router-dom";
import "./styles/Home.css";

function Home() {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center p-6">
      <IntroView />
    </div>
  );
}

function IntroView() {
  return (
    <div>
      <div className="flex flex-col items-center space-y-4 border border-xl-gray-400 shadow-2xl rounded-lg p-4 bg-gray-700">
        <h1 className="text-3xl text-white font-extrabold text-center mb-6">
          <span>Eat.</span> <span>Sleep.</span> <span>Code.</span> With me,
          Thomas!
        </h1>
        <img
          src={gifPath}
          alt="Idle Knight Animation"
          className="w-40 md:w-52"
        />
        <div className="flex flex-row space-x-2 ">
          <Link
            to="/about"
            className="text-center px-2 py-4 bg-green-700 hover:bg-green-800 hover:px-4 text-white font-bold rounded transition-all duration-300"
          >
            Learn some more about me!
          </Link>
          <Link
            to="/apps"
            className="text-center px-2 py-4 bg-yellow-500 hover:bg-yellow-600 hover:px-4 text-white font-bold rounded transition-all duration-300"
          >
            Check out some of my work!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
