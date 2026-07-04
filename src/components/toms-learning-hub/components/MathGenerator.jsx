import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HubModal from "../../../features/learning-hub/layout/HubModal";

function MathGenerator() {
  const [numProblems, setNumProblems] = useState("10");
  const [problems, setProblems] = useState([]);
  const [complexityLevel, setComplexityLevel] = useState(1);
  const [showComplexityDescriptions, setShowComplexityDescriptions] =
    useState(false);

  const complexityInfo = [
    {
      level: 1,
      range: "1-10",
      negatives: false,
      color: "from-green-500 to-emerald-500",
    },
    {
      level: 2,
      range: "1-20",
      negatives: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      level: 3,
      range: "1-50",
      negatives: false,
      color: "from-purple-500 to-pink-500",
    },
    {
      level: 4,
      range: "1-10",
      negatives: true,
      color: "from-orange-500 to-red-500",
    },
    {
      level: 5,
      range: "1-20",
      negatives: true,
      color: "from-yellow-500 to-orange-500",
    },
    {
      level: 6,
      range: "1-50",
      negatives: true,
      color: "from-red-500 to-pink-500",
    },
  ];

  const generateProblems = (e) => {
    e.preventDefault();
    const generatedProblems = [];

    const getMaxNumber = () => {
      switch (parseInt(complexityLevel)) {
        case 2:
        case 5:
          return 20;
        case 3:
        case 6:
          return 50;
        default:
          return 10;
      }
    };

    const getRandomNumber = () =>
      Math.floor(Math.random() * getMaxNumber()) + 1;

    const getOperator = (num1, num2) => {
      let operator = "";
      switch (parseInt(complexityLevel)) {
        case 4:
        case 5:
        case 6:
          operator = Math.random() > 0.5 ? "+" : "-";
          return operator;
        default:
          if (num1 <= num2) operator = "+";
          else operator = Math.random() < 0.5 ? "+" : "-";
          return operator;
      }
    };

    for (let i = 0; i < parseInt(numProblems, 10); i++) {
      const num1 = getRandomNumber();
      const num2 = getRandomNumber();
      const operator = getOperator(num1, num2);

      const problemText = `   ${num1}\n${operator}\u00A0${num2}\n_______`;

      generatedProblems.push(problemText);
    }

    setProblems(generatedProblems);
  };

  const onInputChange = (e) => {
    setNumProblems(e.target.value);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-lg noprint"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            📐 Math Problem Generator
          </h1>
          <p className="text-blue-100 text-center text-lg">
            Create custom math worksheets for grades 1-2
          </p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="noprint">
          <form id="problem-form" onSubmit={generateProblems}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Complexity Level Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    🎯 Complexity Level
                  </h2>
                  <motion.button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                    onClick={() => setShowComplexityDescriptions(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>ℹ️</span>
                    Info
                  </motion.button>
                </div>

                <select
                  className="w-full text-lg p-4 mb-4 font-semibold rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-all"
                  name="complexityLevel"
                  id="complexityLevel"
                  onChange={(e) => setComplexityLevel(e.target.value)}
                  value={complexityLevel}
                >
                  {complexityInfo.map((info) => (
                    <option key={info.level} value={info.level}>
                      Level {info.level} ({info.range}){" "}
                      {info.negatives ? "✓ Negatives" : ""}
                    </option>
                  ))}
                </select>

                <motion.div
                  className={`p-4 rounded-xl bg-gradient-to-r ${
                    complexityInfo[complexityLevel - 1].color
                  } text-white text-center`}
                  key={complexityLevel}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm font-medium mb-1">
                    Current Selection
                  </div>
                  <div className="text-2xl font-bold">
                    Level {complexityLevel}
                  </div>
                  <div className="text-sm mt-1 opacity-90">
                    Numbers: {complexityInfo[complexityLevel - 1].range} •{" "}
                    {complexityInfo[complexityLevel - 1].negatives
                      ? "With"
                      : "No"}{" "}
                    Negatives
                  </div>
                </motion.div>
              </motion.div>

              {/* Number of Problems Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📝 Problem Count
                </h2>

                <label
                  className="text-gray-600 font-medium mb-2 block"
                  htmlFor="numProblems"
                >
                  How many problems do you want?
                </label>

                <input
                  className="w-full text-2xl font-bold p-4 mb-4 text-center rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all"
                  type="number"
                  id="numProblems"
                  value={numProblems}
                  name="numProblems"
                  min="1"
                  max="100"
                  required
                  onChange={onInputChange}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300"
                    type="submit"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✨ Generate
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300"
                    type="button"
                    onClick={() => window.print()}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🖨️ Print
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </form>

          <HubModal
            open={showComplexityDescriptions}
            onClose={() => setShowComplexityDescriptions(false)}
            maxWidth="max-w-2xl"
            labelledBy="math-complexity-title"
          >
            <h2
              id="math-complexity-title"
              className="mb-6 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              Complexity Levels Guide
            </h2>

            <div className="space-y-4">
              {complexityInfo.map((info) => (
                <div
                  key={info.level}
                  className={`rounded-xl bg-gradient-to-r p-4 text-white ${info.color}`}
                >
                  <div className="mb-2 text-lg font-bold">
                    Level {info.level}
                  </div>
                  <div className="text-sm opacity-90">
                    • Number range: {info.range}
                    <br />• Negative results:{" "}
                    {info.negatives ? "Allowed" : "Not allowed"}
                    <br />• Operations: Addition and Subtraction
                  </div>
                </div>
              ))}
            </div>
          </HubModal>
        </div>

        {/* Print-only header */}
        <div className="hidden print:block mb-8 onlyPrint">
          <h1 className="text-3xl font-bold text-center mb-6">
            Math Practice Worksheet
          </h1>
          <div className="flex justify-center gap-8 text-lg">
            <div>Name: ________________________________</div>
            <div>Date: ________________</div>
          </div>
        </div>

        {/* Problems Display */}
        <AnimatePresence mode="wait">
          {problems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 noprint mb-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <div className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-800">
                  <span>✅</span>
                  <span>Generated {problems.length} Problems!</span>
                </div>
              </motion.div>

              <div
                id="problems"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 onlyPrint"
              >
                {problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    className="problem bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 print:shadow-none print:border print:border-gray-400"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-sm text-gray-500 font-semibold mb-2 print:text-black">
                      #{index + 1}
                    </div>
                    <pre className="font-mono text-2xl font-bold text-gray-800 whitespace-pre leading-relaxed">
                      {problem}
                    </pre>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {problems.length === 0 && (
          <motion.div
            className="text-center py-16 noprint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Ready to Practice?
            </h3>
            <p className="text-gray-500">
              Select your settings and click Generate to create math problems!
            </p>
          </motion.div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .noprint {
            display: none !important;
          }
          .onlyPrint {
            display: block !important;
          }
          body {
            background: white !important;
          }
          #problems {
            display: grid !important;
            grid-template-columns: repeat(5, 1fr) !important;
            gap: 1.5rem !important;
          }
          .problem {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
        @page {
          margin: 1cm;
        }
      `}</style>
    </motion.div>
  );
}

export default MathGenerator;
