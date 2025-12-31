import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import attackingKnight from "./media/animations/knight-attack.gif";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  smoothTransition,
} from "../../utils/animations";
import "./styles/Applications.css";

function Applications() {
  const [queryText, setQueryText] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Application list with categories
  const apps = [
    {
      to: "/math",
      label: "SimplyMathHW",
      description: "Math Problem Generator for Grades 1-2",
      category: "Education",
      external: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      to: "/sentence-starters",
      label: "Tom's Learning Hub",
      description: "Reading & Writing resources for Grades 1-2",
      category: "Education",
      external: false,
      color: "from-green-500 to-emerald-500",
    },
    {
      to: "/JavaScriptIDE",
      label: "JavaScript IDE",
      description: "Code Compiler & Editor",
      category: "Development",
      external: false,
      color: "from-yellow-500 to-orange-500",
    },
    {
      to: "http://www.myrepbro.com",
      label: "MyRepBro",
      description: "Workout/Fitness Tracker",
      category: "Health",
      external: true,
      color: "from-red-500 to-pink-500",
    },
    {
      to: "/meal-tracker",
      label: "Meal Tracking Guru",
      description: "Calorie Tracker",
      category: "Health",
      external: false,
      color: "from-purple-500 to-indigo-500",
    },
    {
      to: "/tpc/home",
      label: "Truly Private Chat",
      description: "Peer-to-Peer Chat App",
      category: "Communication",
      external: false,
      color: "from-teal-500 to-cyan-500",
    },
    {
      to: "/birthday-invitation-maker",
      label: "Birthday Invitation Maker",
      description: "Custom Invitations",
      category: "Utility",
      external: false,
      color: "from-pink-500 to-rose-500",
    },
    {
      to: "/simplydo",
      label: "SimplyDo",
      description: "To Do List/Task Manager",
      category: "Productivity",
      external: false,
      color: "from-indigo-500 to-blue-500",
    },
    {
      to: "/progress-tracker",
      label: "Progress Tracker",
      description: "Track your project progress",
      category: "Productivity",
      external: false,
      color: "from-emerald-500 to-teal-500",
    },
    {
      to: "/grow-app",
      label: "Grow App",
      description: "Personal Growth Tracker",
      category: "Productivity",
      external: false,
      color: "from-orange-500 to-amber-500",
    },
  ];

  // Filter apps based on search query
  const filteredApps = apps.filter(
    (app) =>
      app.label.toLowerCase().includes(queryText.toLowerCase()) ||
      app.description.toLowerCase().includes(queryText.toLowerCase()) ||
      app.category.toLowerCase().includes(queryText.toLowerCase())
  );

  const handleInputChange = (e) => {
    setQueryText(e.target.value);
  };

  const displayApps = queryText.length > 0 ? filteredApps : apps;

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex-1 flex flex-col justify-start items-center min-h-screen p-6 overflow-hidden"
      ref={containerRef}
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
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
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
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

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          transition={smoothTransition}
          className="flex flex-col items-center mb-8"
        >
          <motion.img
            src={attackingKnight}
            alt="Attacking Knight"
            className="w-40 md:w-52 mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              x: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.h1
            variants={staggerItem}
            className="text-4xl md:text-6xl font-extrabold text-center mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              My Applications
            </span>
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="text-white text-lg md:text-xl text-center max-w-2xl"
          >
            Explore my collection of web applications built with modern
            technologies
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          variants={fadeInUp}
          transition={smoothTransition}
          className="w-full max-w-2xl mx-auto mb-8"
          ref={inputRef}
        >
          <div className="relative">
            <motion.input
              type="text"
              value={queryText}
              onChange={handleInputChange}
              placeholder="Search applications by name, description, or category..."
              className="w-full text-white bg-slate-800/80 backdrop-blur-lg border-2 border-slate-700 focus:border-cyan-500 rounded-xl p-4 pl-12 text-lg focus:outline-none transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Apps Grid */}
        <AnimatePresence mode="wait">
          {displayApps.length > 0 ? (
            <motion.div
              key="apps-grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
            >
              {displayApps.map((app, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -10, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {app.external ? (
                    <a
                      href={app.to}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full"
                    >
                      <AppCard app={app} />
                    </a>
                  ) : (
                    <Link to={app.to} className="block h-full">
                      <AppCard app={app} />
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <p className="text-white text-xl">
                No applications found matching "{queryText}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AppCard({ app }) {
  return (
    <div className="relative h-full bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 overflow-hidden group">
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Category badge */}
        <span className="inline-block px-3 py-1 text-xs font-semibold text-cyan-300 bg-cyan-900/50 rounded-full mb-4">
          {app.category}
        </span>

        {/* App name */}
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
          {app.label}
          {app.external && (
            <svg
              className="inline-block ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-base leading-relaxed">
          {app.description}
        </p>
      </div>

      {/* Decorative corner element */}
      <div
        className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${app.color} opacity-20 rounded-tl-full transform translate-x-16 translate-y-16 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-300`}
      />
    </div>
  );
}

export default Applications;
