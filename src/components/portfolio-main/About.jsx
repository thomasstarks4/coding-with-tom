import { motion } from "framer-motion";
import runningKnight from "./media/animations/knight-run.gif";
import { Link } from "react-router-dom";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  smoothTransition,
} from "../../utils/animations";

function About() {
  return (
    <motion.div
      className="introduction relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 font-bold text-white min-h-screen py-12 px-4 overflow-hidden"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Animated knight image */}
        <motion.div
          variants={fadeInUp}
          transition={smoothTransition}
          className="flex justify-center mb-8"
        >
          <motion.img
            src={runningKnight}
            alt="Knight Running"
            className="w-48 md:w-64 drop-shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              x: [0, 20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Main content card */}
        <motion.div
          variants={fadeInUp}
          transition={smoothTransition}
          className="p-8 md:p-12 mb-6 max-w-5xl mx-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/50"
        >
          {/* Header with gradient text */}
          <motion.h1
            variants={staggerItem}
            className="text-3xl md:text-5xl font-extrabold text-center mb-10"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              Intro To Me
            </span>
          </motion.h1>

          {/* Content sections with staggered animations */}
          <motion.div variants={staggerContainer} className="space-y-6">
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-base md:text-lg leading-relaxed bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl shadow-xl p-6 border border-slate-500/30"
                whileHover={{ borderColor: "rgba(96, 165, 250, 0.5)" }}
              >
                Welcome to my portolio! I'm{" "}
                <em className="text-cyan-300">Thomas Starks</em>, a Navy veteran
                and Full-Stack Software Engineer with over three years of
                experience building dynamic web applications and immersive 2D
                games. My expertise spans front-end development with React,
                JavaScript, and CSS frameworks like Bootstrap and Tailwind, and
                back-end development with C#, VB.NET, PHP, and SQL. I leverage
                tools like Postman for rigorous API testing and Git for seamless
                version control, ensuring robust and scalable solutions. My
                career is driven by a passion for solving complex problems and
                delivering user-focused experiences, honed through my work at
                IMT Insurance, Makai Watersports Rentals, and most recently at
                DataAnnotation.tech.
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-base md:text-lg leading-relaxed bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl shadow-xl p-6 border border-slate-500/30"
                whileHover={{ borderColor: "rgba(34, 211, 238, 0.5)" }}
              >
                At IMT Insurance, I developed a client management system that
                streamlined policy and claims processes for insurance agents. By
                implementing user-friendly React components, conducting
                modernization from legacy code, resolving API bottlenecks, and
                enhancing backend performance with C# and SQL Server, I improved
                system responsiveness and usability. My focus on Agile
                collaboration ensured seamless team integration, while my UI
                enhancements using Bootstrap and CSS Flexbox elevated the user
                experience. Similarly, at Makai Watersports Rentals, I designed
                a visually appealing landing page with React, SCSS, and
                Bootstrap, and optimized SQL databases with complex stored
                procedures to ensure data integrity and performance. I also
                integrated Formik and Yup for robust form validation, enhancing
                the frontend's reliability.
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-base md:text-lg leading-relaxed bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl shadow-xl p-6 border border-slate-500/30"
                whileHover={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
              >
                As a game developer, I bring pixel-perfect worlds to life using
                Godot, GDScript, and Aseprite. My current project,{" "}
                <em className="text-purple-300">King's Ascension</em>, showcases
                my ability to craft engaging mechanics and stunning visuals. At
                DataAnnotation.tech, I built web and game applications with
                Vanilla JavaScript, React, and Tailwind, while providing
                critical feedback to improve AI-driven platforms. One of my
                proudest achievements is{" "}
                <motion.a
                  href="https://www.myrepbro.com"
                  className="text-cyan-300 hover:text-cyan-200 underline decoration-2 underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  MyRepBro
                </motion.a>
                , a fitness tracking web app for gym enthusiasts. Built with
                React, Tailwind, PHP, and MySQL, it features workout logging,
                progress tracking, and seamless navigation via React Router, all
                secured with robust user authentication.
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-base md:text-lg leading-relaxed bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl shadow-xl p-6 border border-slate-500/30"
                whileHover={{ borderColor: "rgba(74, 222, 128, 0.5)" }}
              >
                My Navy service, where I supervised a team of electricians and
                managed the Electrical Safety Program, instilled discipline and
                leadership that I carry into every project. Recognized with
                multiple Navy Achievement Medals for technical expertise and
                operational excellence, I approach software development with the
                same precision and commitment. Explore my portfolio to discover
                how I blend technical proficiency, creative problem-solving, and
                a passion for innovation to bring your ideas to life.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Back button with animation */}
          <motion.div
            variants={staggerItem}
            className="flex justify-center mt-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Link
                className="block text-center w-full p-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                to="/"
              >
                <motion.span
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ←
                  </motion.span>
                  <span>Back to Home</span>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default About;
