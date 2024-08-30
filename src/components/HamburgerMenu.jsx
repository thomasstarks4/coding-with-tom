import { Link } from 'react-router-dom';
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
function HamburgerMenu()
{
    return(
        <div className="off-screen-menu">
            <ul>
                <Link to={Home}>Home</Link>
                <Link to={About}>About</Link>
                <Link to={Contact}>Contact</Link>
            </ul>
        </div>
    )
}

export default HamburgerMenu;