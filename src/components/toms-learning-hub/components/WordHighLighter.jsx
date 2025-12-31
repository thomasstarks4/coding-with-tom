import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WordHighlighter = () => {
  const [text, setText] = useState("The chicken crossed the road.");
  const [highlightedWords, setHighlightedWords] = useState([]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const highlightWords = () => {
    if (text.trim() === "") {
      setHighlightedWords(["Please enter some text."]);
      return;
    }

    const words = text.trim().split(/\s+/);
    setHighlightedWords(words);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 rounded-2xl shadow-xl mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            ✨ Word Highlighter
          </h1>
          <p className="text-white/90 text-center text-lg">
            Watch each word light up as you highlight them!
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label className="block text-gray-700 font-semibold mb-3 text-lg">
            Enter your text:
          </label>
          <textarea
            className="w-full text-gray-800 rounded-xl p-4 border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-all text-lg min-h-[120px] resize-y"
            placeholder="Type or paste a sentence here..."
            value={text}
            onChange={handleInputChange}
          />

          <motion.button
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300"
            onClick={highlightWords}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            🎨 Highlight Words
          </motion.button>
        </motion.div>

        {/* Output Section */}
        <AnimatePresence mode="wait">
          {highlightedWords.length > 0 && (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                ✅ Highlighted Words
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {highlightedWords.map((word, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    <span className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-300 to-orange-300 text-gray-900 font-bold text-xl rounded-lg shadow-md group-hover:shadow-xl transition-all cursor-pointer border-2 border-yellow-400">
                      {word}
                    </span>

                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute -top-2 -right-2 text-2xl"
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ✨
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {highlightedWords.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Ready to Highlight?
            </h3>
            <p className="text-gray-500">
              Enter some text above and click the button!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WordHighlighter;
