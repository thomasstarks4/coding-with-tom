import React from "react";
import { motion } from "framer-motion";
import gifPath from "./media/animations/knight-idle.gif";
import { Link } from "react-router-dom";
import "./styles/Home.css";
import {
  scaleIn,
  staggerContainer,
  staggerItem,
  smoothTransition,
} from "../../utils/animations";

function Home() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-[90%] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
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
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <IntroView />
    </div>
  );
}

function IntroView() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="relative z-10"
    >
      <motion.div
        variants={scaleIn}
        transition={smoothTransition}
        className="flex flex-col items-center space-y-6 shadow-2xl rounded-2xl p-8 md:p-12 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-slate-700/50 max-w-4xl"
      >
        {/* Animated heading with gradient text */}
        <motion.h1
          variants={staggerItem}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-pink-400 hover:to-blue-400 transition-all duration-500 cursor-default">
            Eat.
          </span>{" "}
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text hover:from-purple-400 hover:to-green-400 transition-all duration-500 cursor-default">
            Sleep.
          </span>{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 text-transparent bg-clip-text hover:from-pink-400 hover:to-yellow-400 transition-all duration-500 cursor-default">
            Code.
          </span>
          <span className="block mt-4 text-white text-3xl md:text-4xl">
            With me, Thomas!
          </span>
        </motion.h1>

        {/* Animated image with pulse effect */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={gifPath}
            alt="Idle Knight Animation"
            className="w-48 md:w-64 rounded-lg shadow-xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* CTA buttons with hover animations */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl"
        >
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/about"
              className="block text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              <motion.span
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span>Learn About Me</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/apps"
              className="block text-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300"
            >
              <motion.span
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span>View My Work</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default Home;
