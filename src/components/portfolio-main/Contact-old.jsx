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
    <>
      <h1 className="text-4xl text-white mb-8 text-center">Contact</h1>
      <div className="text-center f-col bg-slate-900 w-1/2 mx-auto flex flex-col items-center justify-center rounded-lg shadow-lg p-6">
        <ul className="logo-holder">
          {/* <li>
          <img className="contact-logo" src={phoneIcon} alt="Phone icon" />
          </li> */}
          <li
            onClick={onLinkedInButtonClick}
            className="flex justify-center hover:bg-slate-800 rounded-lg"
          >
            <img className="h-10 my-4" src={linkedInLogo} alt="Linkedin Logo" />
          </li>
          <li
            onClick={onGithubButtonClick}
            className="flex justify-center hover:bg-slate-800 rounded-lg"
          >
            <img className="h-20 my-4" src={githubLogo} alt="Linkedin Logo" />
          </li>
          <li
            onClick={onScheduleButtonClick}
            className=" h-20 mt-4 p-1 hover:bg-slate-800 hover:text-lg rounded-lg transition-all duration-300 ease-in-out "
          >
            <button className="flex justify-center items-center  font-bold">
              Schedule a meeting with me on Calendly!
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Contact;
