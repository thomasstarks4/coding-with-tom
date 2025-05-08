import React from "react";
import runningKnight from "./media/animations/knight-run.gif";
import gifPath from "./media/animations/knight-idle.gif";
import { Link } from "react-router-dom";
import "./styles/Home.css";

function Home({ intro, onButtonClick }) {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center p-6">
      {intro ? (
        <IntroView onButtonClick={onButtonClick} />
      ) : (
        <ProfileView onButtonClick={onButtonClick} />
      )}
    </div>
  );
}

function IntroView({ onButtonClick }) {
  return (
    <div>
      <h1 className="text-3xl text-white font-extrabold text-center mb-6">
        <span>Eat.</span> <span>Sleep.</span> <span>Code.</span> With me,
        Thomas!
      </h1>

      <div className="flex flex-col items-center space-y-4">
        <img
          src={gifPath}
          alt="Idle Knight Animation"
          className="w-40 md:w-52"
        />
        <div className="flex flex-col space-y-2 ">
          <Link
            to="/about"
            className="text-center p-2 bg-green-700 hover:bg-green-800 hover:p-3 text-white font-bold rounded transition-all duration-300"
          >
            Learn more!
          </Link>
          <Link
            to="/apps"
            className="text-center p-2 bg-yellow-500 hover:bg-yellow-600 hover:p-3 text-white font-bold rounded transition-all duration-300"
          >
            Check out some of my work!
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ onButtonClick }) {
  return (
    <>
      <div className="flex justify-center mb-6">
        <img
          src={runningKnight}
          alt="Knight Running"
          className="w-40 md:w-52"
        />
      </div>

      <div className="introduction bg-slate-900 font-extrabold text-white p-4 mb-4 max-w-4xl mx-auto rounded">
        <h1 className="text-xl text-white font-extrabold text-center mb-4">
          <span>Intro</span> <span>To</span> <span>Me</span>
        </h1>
        Hi, I'm Thomas <span className="font-bold">-</span> a veteran and
        passionate application developer with three years of experience in
        creating dynamic web applications and building robust websites optimized
        for any platform. As a full stack web developer, I specialize in using
        HTML, CSS, and JavaScript to craft engaging front-end experiences, and
        C# and SQL to develop powerful APIs and database solutions. I also have
        experience in game development using GDScript and Aseprite to bring
        beautiful pixel art games to life!
        <br />
        <br />
        Throughout my career, I've worked with various clients and companies: I
        designed a captivating landing page for Makai Watersports Rentals and
        maintained client management software for IMT Insurance. I've also
        created tailored websites for small business owners, helping them
        establish a strong online presence.
        <br />
        <br />
        In my free time, I dive into game development with Godot. Currently, I'm
        working on an exciting project called King's Ascension.
        <br />
        <br />
        Explore my portfolio to see my work and discover how I can bring your
        web development ideas to life!
      </div>

      <button type="button" className="learn-more" onClick={onButtonClick}>
        Go back!
      </button>
    </>
  );
}

export default Home;
