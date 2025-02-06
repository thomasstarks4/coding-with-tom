import "./Main.css";
import Home from "./components/Home";
import Home2 from "./components/toms-learning-hub/components/Home";
import { useState } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom"; // Import useLocation
import HamburgerButton from "./components/HamburgerButton";
import Contact from "./components/Contact";
import About from "./components/About";
import Applications from "./components/Applications";
import MathGenerator from "./components/toms-learning-hub/components/MathGenerator";
import Starter from "./components/toms-learning-hub/components/Starter";
import Tuner from "./components/toms-learning-hub/components/Tuner";
import Writer from "./components/toms-learning-hub/components/Writer";
import LearningHubNavbar from "./components/toms-learning-hub/components/Navbar"; // Import your learning hub navbar
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import JavaScriptIDE from "./components/JavaScriptIDE";
import WordHighlighter from "./components/toms-learning-hub/components/WordHighLighter";

function CodingWithTom() {
  const [hideIntro, setHideIntro] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation(); // Get the current route location

  const hamburgerMenuClick = () => {
    setShowMenu((prevState) => !prevState);
  };

  const hamburgerMenuClick2 = () => {
    setShowMenu(false);
    const containers = document.querySelectorAll(".container");

    containers.forEach((container) => {
      container.classList.toggle("reduced", !showMenu);
    });
  };

  const learnMoreButtonClick = () => {
    setHideIntro(!hideIntro);
  };

  const initialStarters = {
    starter1: {
      isShown: true,
      text: "I can see the",
      partnerType: "single noun",
    },
    starter2: {
      isShown: true,
      text: "I can see a",
      partnerType: "single noun",
    },
    starter3: { isShown: true, text: "I see my", partnerType: "single noun" },
    starter4: { isShown: true, text: "We like", partnerType: "plural noun" },
    starter5: { isShown: true, text: "We are", partnerType: "adjective" },
    starter6: { isShown: true, text: "We can", partnerType: "verb" },
    starter7: { isShown: true, text: "Go to the", partnerType: "noun/place" },
    starter8: { isShown: true, text: "Come to the", partnerType: "noun/place" },
    starter9: {
      isShown: true,
      text: "Look up at the",
      partnerType: "single noun",
    },
    starter10: {
      isShown: true,
      text: "Look at me in the",
      partnerType: "body part",
    },
    starter11: {
      isShown: true,
      text: "I like to go to",
      partnerType: "plural noun/places",
    },
    starter12: { isShown: true, text: "I like", partnerType: "plural noun" },
    starter13: {
      isShown: true,
      text: "This is the",
      partnerType: "single noun",
    },
    starter14: {
      isShown: true,
      text: "Here is my",
      partnerType: "single noun",
    },
    starter15: { isShown: true, text: "Can you", partnerType: "verb" },
    starter16: {
      isShown: true,
      text: "Can you see a",
      partnerType: "single noun",
    },
    starter17: {
      isShown: true,
      text: "Can you see the",
      partnerType: "single noun",
    },
    starter18: {
      isShown: true,
      text: "Can you see my",
      partnerType: "single noun",
    },
    starter19: { isShown: true, text: "I look at", partnerType: "single noun" },
    starter20: { isShown: true, text: "I was", partnerType: "adjective" },
    starter21: { isShown: true, text: "I play", partnerType: "game/sport" },
    starter22: { isShown: true, text: "I run to", partnerType: "place" },
    starter23: { isShown: true, text: "I go into the", partnerType: "place" },
    starter24: { isShown: true, text: "We have", partnerType: "object" },
    starter25: { isShown: true, text: "I have", partnerType: "object" },
    starter26: { isShown: true, text: "She is", partnerType: "adjective" },
    starter27: { isShown: true, text: "He is", partnerType: "adjective" },
    starter28: { isShown: false, text: "We go to", partnerType: "place" },
  };

  const [startersSelected, setStartersSelected] = useState(initialStarters);

  // Determine which navbar to display based on the current route
  const isLearningHubRoute =
    location.pathname.startsWith("/sentence-starters") ||
    location.pathname.startsWith("/starter") ||
    location.pathname.startsWith("/tuner") ||
    location.pathname.startsWith("/highlighter") ||
    location.pathname.startsWith("/writer");
  const isPortfolioSite = isLearningHubRoute === false;
  return (
    <div
      onClick={() => {
        if (showMenu) setShowMenu(false); //hide menu if user clicks anywhere on the screen
      }}
      className={`min-h-screen ${isLearningHubRoute ? "bg-learning-hub" : ""} ${
        isPortfolioSite ? "bg-main" : ""
      }`}
    >
      {/* Conditionally render the navbar and backgrounds change based on the route */}
      {isLearningHubRoute ? (
        <LearningHubNavbar />
      ) : (
        <>
          <HamburgerButton onClick={hamburgerMenuClick} showMenu={showMenu} />
        </>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home onButtonClick={learnMoreButtonClick} intro={hideIntro} />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apps" element={<Applications />} />
        <Route path="/math" element={<MathGenerator />} />
        <Route path="/highlighter" element={<WordHighlighter />} />
        <Route path="/sentence-starters" element={<Home2 />} />
        <Route
          path="/starter"
          element={<Starter startersSelected={startersSelected} />}
        />
        <Route
          path="/tuner"
          element={
            <Tuner
              setStartersSelected={setStartersSelected}
              startersSelected={startersSelected}
            />
          }
        />
        <Route path="/writer" element={<Writer />} />
        <Route path="/JavaScriptIDE" element={<JavaScriptIDE />}></Route>
      </Routes>

      {/* Add ToastContainer to render toasts */}
      <ToastContainer autoClose={3000} position="top-right" />

      <div className={showMenu ? "off-screen-menu active" : "off-screen-menu"}>
        {showMenu && (
          <ul>
            <Link to="/" onClick={hamburgerMenuClick2}>
              Home
            </Link>
            <Link to="/about" onClick={hamburgerMenuClick2}>
              About
            </Link>
            <Link to="/contact" onClick={hamburgerMenuClick2}>
              Contact
            </Link>
            <Link to="/apps" onClick={hamburgerMenuClick2}>
              Apps
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
}

export default CodingWithTom;
