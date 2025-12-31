import { motion } from "framer-motion";
import linkedInLogo from "./media/logos/LI-Logo.png";
import githubLogo from "./media/logos/github-mark-white.png";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  smoothTransition,
} from "../../utils/animations";

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
    <motion.div
      className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.h1
          variants={fadeInUp}
          transition={smoothTransition}
          className="text-4xl md:text-6xl font-extrabold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
            Let's Connect
          </span>
        </motion.h1>

        {/* Contact Cards Container */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* LinkedIn Card */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLinkedInButtonClick}
            className="cursor-pointer"
          >
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/20 h-full flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <img
                  src={linkedInLogo}
                  alt="LinkedIn Logo"
                  className="h-20 w-auto"
                />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">LinkedIn</h3>
              <p className="text-slate-300 text-center text-sm">
                Connect professionally
              </p>
            </div>
          </motion.div>

          {/* GitHub Card */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGithubButtonClick}
            className="cursor-pointer"
          >
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/20 h-full flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <img
                  src={githubLogo}
                  alt="GitHub Logo"
                  className="h-20 w-auto"
                />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">GitHub</h3>
              <p className="text-slate-300 text-center text-sm">View my code</p>
            </div>
          </motion.div>

          {/* Calendly Card */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScheduleButtonClick}
            className="cursor-pointer"
          >
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 shadow-xl hover:shadow-green-500/20 h-full flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <svg
                  className="w-20 h-20 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Calendly</h3>
              <p className="text-slate-300 text-center text-sm">
                Schedule a meeting
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          variants={fadeInUp}
          transition={smoothTransition}
          className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 shadow-xl"
        >
          <div className="text-center">
            <motion.h2
              variants={staggerItem}
              className="text-2xl md:text-3xl font-bold text-white mb-4"
            >
              Ready to Collaborate?
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto"
            >
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision. Feel free to reach out
              through any of the platforms above!
            </motion.p>

            {/* Contact Info */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col md:flex-row items-center justify-center gap-4 text-slate-400"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">Available for freelance work</span>
              </div>
              <div className="hidden md:block text-slate-600">|</div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">Based in the USA</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Contact;
