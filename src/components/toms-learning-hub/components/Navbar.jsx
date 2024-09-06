import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from '../images/toms-learning-hub-logo.png'; // Import the logo (adjust the path as needed)

const Navbar = () => {
  return (
    <header className="navbar-header">
      <nav className={`navbar`}>
        <div className="navbar-logo">
          <Link to="/" className="nav-logo-link">
            <img src={logo} alt="Logo" className="logo-image" /> {/* Display the logo above the text */}
            <span className="site-title">Tom's Learning Hub</span>
          </Link>
        </div>
        <ul className={`nav-menu`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/tuner" className="nav-link">Sentence Tuner</Link>
          </li>
          <li className="nav-item">
            <Link to="/starter" className="nav-link">Sentence Starter</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
