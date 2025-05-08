import linkedInLogo from "./media/logos/LI-Logo.png";
import githubLogo from "./media/logos/github-mark-white.png";
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
    <div className="text-center f-col bg-slate-900">
      <h1 className="text-4xl text-white mb-8">Contact</h1>
      <ul className="logo-holder">
        {/* <li>
          <img className="contact-logo" src={phoneIcon} alt="Phone icon" />
        </li> */}
        <li
          onClick={onLinkedInButtonClick}
          className="flex justify-center hover:bg-slate-800"
        >
          <img className="h-10 my-4" src={linkedInLogo} alt="Linkedin Logo" />
        </li>
        <li
          onClick={onGithubButtonClick}
          className="flex justify-center hover:bg-slate-800"
        >
          <img className="h-20 my-4" src={githubLogo} alt="Linkedin Logo" />
        </li>
        <li onClick={onScheduleButtonClick} className="p-1 hover:bg-slate-800">
          <button className="h-10 my-4 hover">
            Schedule a meeting with me!
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Contact;
