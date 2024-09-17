import runningKnight from "../media/animations/knight-run.gif";
import gifPath from "../media/animations/knight-idle.gif";
import { Link } from "react-router-dom";
function Home(props) {
  return (
    <>
      <div className="container f-col content-cork">
        {props.intro && (
          <h1 className="trifecta">
            <span>Eat.</span> <span>Sleep.</span> <span>Code.</span> With me,
            Thomas!
          </h1>
        )}
        {!props.intro && (
          <>
            <h1 className="trifecta">
              <span>Intro</span> <span>To</span> <span>Me</span>
            </h1>
            <img src={runningKnight} alt="Knight Running" />
          </>
        )}
        {props.intro && (
          <div className="image-container">
            <img src={gifPath} alt="Animated gif" />
            <div>
              <button
                type="button"
                className="learn-more"
                onClick={props.onButtonClick}
              >
                Learn more!
              </button>
              <Link to="/apps">
                <button type="button" className="learn-more">
                  Check out some applications I've made!
                </button>
              </Link>
            </div>
          </div>
        )}
        {!props.intro && (
          <>
            <div className="introduction">
              Hi, I'm Thomas- a veteran and passionate application developer
              with three years of experience in creating dynamic web
              applications and building robust websites optimized for any
              platform. As a full stack web developer, I specialize in using
              HTML, CSS, and JavaScript to craft engaging front-end experiences,
              and C# and SQL to develop powerful APIs and database solutions. I
              also have experience in game development using gdscript and
              Aseprite to bring beautiful pixel art games to life! <br />
              <br />
              Throughout my career, I've had the pleasure of working with
              various clients and companies. I designed a captivating landing
              page for Makai Watersports Rentals and maintained client
              management software for IMT Insurance's Software Services
              department. Additionally, I've created tailored websites for small
              business owners, helping them establish a strong online presence.
              <br />
              <br />
              In my free time, I dive into the world of game development with
              Godot. Currently, I'm working on an exciting project called King's
              Ascension. <br />
              <br />
              Explore my portfolio to see my work and discover how I can bring
              your web development ideas to life!
            </div>
            <button
              type="button"
              className="learn-more"
              onClick={props.onButtonClick}
            >
              Go back!
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
