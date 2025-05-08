import runningKnight from "../media/animations/knight-run.gif";
import { Link } from "react-router-dom";
function About() {
  return (
    <div className="introduction bg-slate-900 font-bold text-white">
      <div className="flex justify-center mb-6">
        <img
          src={runningKnight}
          alt="Knight Running"
          className="w-40 md:w-52"
        />
      </div>

      <div className="p-6 md:p-8 mb-6 max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-lg text-white">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-teal-300">
          <span>Intro</span> <span>To</span> <span>Me</span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed bg-slate-600 rounded shadow-xl p-4 mb-4">
          Welcome to my portolio! I'm <em>Thomas Starks</em>, a Navy veteran and
          Full-Stack Software Engineer with over three years of experience
          building dynamic web applications and immersive 2D games. My expertise
          spans front-end development with React, JavaScript, and CSS frameworks
          like Bootstrap and Tailwind, and back-end development with C#, VB.NET,
          PHP, and SQL. I leverage tools like Postman for rigorous API testing
          and Git for seamless version control, ensuring robust and scalable
          solutions. My career is driven by a passion for solving complex
          problems and delivering user-focused experiences, honed through my
          work at IMT Insurance, Makai Watersports Rentals, and most recently at
          DataAnnotation.tech.
        </p>
        <br />
        <p className="text-base md:text-lg leading-relaxed bg-slate-600 rounded shadow-xl p-4 mb-4">
          At IMT Insurance, I developed a client management system that
          streamlined policy and claims processes for insurance agents. By
          implementing user-friendly React components, resolving API
          bottlenecks, and enhancing backend performance with C# and SQL Server,
          I improved system responsiveness and usability. My focus on Agile
          collaboration ensured seamless team integration, while my UI
          enhancements using Bootstrap and CSS Flexbox elevated the user
          experience. Similarly, at Makai Watersports Rentals, I designed a
          visually appealing landing page with React, SCSS, and Bootstrap, and
          optimized SQL databases with complex stored procedures to ensure data
          integrity and performance. I also integrated Formik and Yup for robust
          form validation, enhancing the frontend’s reliability.
        </p>
        <br />
        <p className="text-base md:text-lg leading-relaxed bg-slate-600 rounded shadow-xl p-4 mb-4">
          As a game developer, I bring pixel-perfect worlds to life using Godot,
          GDScript, and Aseprite. My current project, <em>King's Ascension</em>,
          showcases my ability to craft engaging mechanics and stunning visuals.
          At DataAnnotation.tech, I built web and game applications with Vanilla
          JavaScript, React, and Tailwind, while providing critical feedback to
          improve AI-driven platforms. One of my proudest achievements is{" "}
          <a
            href="https://www.myrepbro.com"
            className="text-teal-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            MyRepBro
          </a>
          , a fitness tracking web app for gym enthusiasts. Built with React,
          Tailwind, PHP, and MySQL, it features workout logging, progress
          tracking, and seamless navigation via React Router, all secured with
          robust user authentication.
        </p>
        <br />
        <p className="text-base md:text-lg leading-relaxed bg-slate-600 rounded shadow-xl p-4 mb-4">
          My Navy service, where I supervised a team of electricians and managed
          the Electrical Safety Program, instilled discipline and leadership
          that I carry into every project. Recognized with multiple Navy
          Achievement Medals for technical expertise and operational excellence,
          I approach software development with the same precision and
          commitment. Explore my portfolio to discover how I blend technical
          proficiency, creative problem-solving, and a passion for innovation to
          bring your ideas to life.
        </p>
        <div className="flex justify-center mt-4 text-center">
          <Link
            className="w-full mx-auto p-2 mt-2 bg-teal-500 hover:bg-teal-600 hover:p-3 text-white font-bold rounded transition-all duration-300"
            to="/"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
