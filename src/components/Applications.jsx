import { Link } from "react-router-dom";
import attackingKnight from "../media/animations/knight-attack.gif";
function Applications() {
  return (
    <>
      <div className="container col" >
        <img src={attackingKnight} alt="Attacking Knight" />
        <h1 className="center apps-header">Applications</h1>
      </div>
      <div className=" center container">

        <div className="app-list">
          <li>
            <Link to="/math">SimplyMathHW</Link>
          </li>
          <li>
            <Link to="/to-do-list">To Do List</Link>
          </li>
          <li>
            <Link to="/weather">Weather</Link>
          </li>
          <li>
            <Link to="/blogs">Blog</Link>
          </li>
          <li>
            <Link to="/store">E-Commerce Store</Link>
          </li>
        </div>
        </div>
    </>
  );
}

export default Applications;
