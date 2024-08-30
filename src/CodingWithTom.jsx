import './Main.css';
import Home from "./components/Home";
import { useState } from 'react';
import HamburgerButton from './components/HamburgerButton';
import Contact from './components/Contact';
import About from './components/About';
import Applications from './components/Applications';
import { Route, Routes, Link } from "react-router-dom";
import MathGenerator from './components/MathGenerator';

function CodingWithTom() 
{
const [hideIntro, setHideIntro] = useState(true);
const [showMenu, setShowMenu] = useState(false);

function hamburgerMenuClick()
{
  setShowMenu(prevState => !prevState);
}
function hamburgerMenuClick2()
{
  setShowMenu(false);
  const containers = document.querySelectorAll(".container");

  containers.forEach(container => {
      if (showMenu === true)
      {
          container.classList.toggle("reduced", false);
      }
      else {
          container.classList.toggle("reduced", true);
      }
  });
}
const learnMoreButtonClick = () =>
{
  setHideIntro(!hideIntro);
}

  return (
    <div className="main-container">
      <HamburgerButton onClick ={hamburgerMenuClick} showMenu={showMenu}/>
      <Routes>
        <Route path="/" element={<Home onButtonClick={learnMoreButtonClick} intro={hideIntro} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apps" element={<Applications />} />
        <Route path="/math" element={<MathGenerator />} />
      </Routes>
      <div className={showMenu ? 'off-screen-menu active' : 'off-screen-menu'}>
            <ul>
                <Link to="/" onClick={hamburgerMenuClick2}>Home</Link>
                <Link to="/about" onClick={hamburgerMenuClick2}>About</Link>
                <Link to="/contact" onClick={hamburgerMenuClick2}>Contact</Link>
                <Link to="/apps" onClick={hamburgerMenuClick2}>Apps</Link>
            </ul>
        </div>
    </div>
  );
}

export default CodingWithTom;
