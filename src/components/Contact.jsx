import linkedInLogo from "../media/logos/LI-Logo.png";
import githubLogo from "../media/logos/github-mark-white.png";
// import phoneIcon from "../media/logos/mobile-phone.png";

function Contact() {
  const onScheduleButtonClick = () => {
    window.open("https://www.calendly.com/thomas-a-starks4", "_blank");
  };
  const onLinkedInButtonClick = () => {
    window.open("https://www.linkedin.com/in/thomas-a-starks-jr", "_blank");
  };
  const onGithubButtonClick = () => {
    window.open("https://www.github.com/thomasstarks4", "_blank");
  };
  return (
    <div className="center f-col container">
          <h1>Contact</h1>
      <ul className="logo-holder">
        {/* <li>
          <img className="contact-logo" src={phoneIcon} alt="Phone icon" />
        </li> */}
        <li
          onClick={onLinkedInButtonClick}
        >
          <img
            className="contact-logo"
            src={linkedInLogo}
            alt="Linkedin Logo"
          />
        </li>
        <li
          onClick={onGithubButtonClick}
        >
          <img
            className="contact-logo"
            src={githubLogo}
            alt="Linkedin Logo"
          />
        </li>
        <li onClick={onScheduleButtonClick} className="p-1">
          <button className="hover" >
            Schedule a meeting with me!
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Contact;
