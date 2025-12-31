import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Starter = ({ startersSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [cardStates, setCardStates] = useState({});

  // Enhanced word lists for better sentence construction
  const singleNouns = [
    "cat",
    "dog",
    "sun",
    "moon",
    "car",
    "tree",
    "bird",
    "ball",
    "hat",
    "book",
    "fish",
    "flower",
    "star",
    "house",
    "door",
    "window",
    "table",
    "chair",
  ];

  const pluralNouns = [
    "cats",
    "dogs",
    "trees",
    "cars",
    "books",
    "birds",
    "apples",
    "stars",
    "toys",
    "hats",
    "flowers",
    "cookies",
    "shoes",
    "friends",
    "animals",
    "colors",
  ];

  const adjectives = [
    "big",
    "small",
    "happy",
    "sad",
    "fast",
    "slow",
    "hot",
    "cold",
    "red",
    "blue",
    "tall",
    "short",
    "funny",
    "silly",
    "brave",
    "kind",
    "bright",
    "dark",
  ];

  const verbs = [
    "run",
    "jump",
    "play",
    "sing",
    "read",
    "eat",
    "swim",
    "walk",
    "sleep",
    "dance",
    "write",
    "draw",
    "laugh",
    "talk",
    "listen",
    "watch",
  ];

  const nounPlaces = [
    "park",
    "school",
    "store",
    "beach",
    "zoo",
    "farm",
    "garden",
    "library",
    "playground",
    "kitchen",
  ];

  const bodyParts = [
    "eyes",
    "ears",
    "hands",
    "feet",
    "nose",
    "mouth",
    "face",
    "head",
  ];

  const pluralNounPlaces = [
    "parks",
    "schools",
    "stores",
    "beaches",
    "farms",
    "gardens",
    "libraries",
    "playgrounds",
    "rooms",
    "classrooms",
  ];

  const gamesSports = [
    "tag",
    "soccer",
    "hopscotch",
    "hide-and-seek",
    "catch",
    "jump rope",
    "baseball",
    "basketball",
    "tennis",
    "kickball",
  ];

  const objects = [
    "toy",
    "ball",
    "book",
    "doll",
    "block",
    "bike",
    "pencil",
    "cup",
    "bag",
    "crayon",
    "picture",
    "phone",
    "blanket",
    "backpack",
  ];

  // Enhanced word selection with better context awareness
  const getRandomWord = (partnerType) => {
    const wordMap = {
      "single noun": singleNouns,
      "plural noun": pluralNouns,
      adjective: adjectives,
      verb: verbs,
      "noun/place": nounPlaces,
      "body part": bodyParts,
      "plural noun/places": pluralNounPlaces,
      "game/sport": gamesSports,
      object: objects,
    };
    const words = wordMap[partnerType] || [];
    return words[Math.floor(Math.random() * words.length)];
  };

  // Generate sentences with improved logic
  const generateSentences = () => {
    if (!startersSelected || typeof startersSelected !== "object") {
      return ["Something went wrong"];
    }

    return Object.keys(startersSelected)
      .filter((key) => startersSelected[key]?.isShown)
      .map((key) => {
        const starter = startersSelected[key];
        const randomWord = getRandomWord(starter.partnerType);

        // Ensure proper capitalization and punctuation
        let sentence = `${starter.text} ${randomWord}`;

        // Capitalize first letter if not already
        if (sentence && sentence[0] === sentence[0].toLowerCase()) {
          sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        }

        // Add period if sentence doesn't end with punctuation
        if (sentence && !sentence.match(/[.!?]$/)) {
          sentence += ".";
        }

        return sentence;
      });
  };

  const sentences = generateSentences();

  const handleCardClick = (index) => {
    setSelectedCardIndex(index);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setCardStates((prev) => ({ ...prev, [selectedCardIndex]: "success" }));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setCardStates((prev) => ({ ...prev, [selectedCardIndex]: "retry" }));
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 rounded-2xl shadow-xl mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            📚 Generated Sentences
          </h1>
          <p className="text-white/90 text-center text-lg">
            Click each sentence after your learner reads it!
          </p>
        </motion.div>

        {/* Sentences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sentences.map((sentence, index) => {
            const state = cardStates[index];
            const bgClass =
              state === "success"
                ? "from-green-400 to-emerald-500"
                : state === "retry"
                ? "from-blue-400 to-cyan-500"
                : "from-yellow-300 to-orange-300";

            return (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${bgClass} p-6 rounded-2xl shadow-lg border-4 border-white cursor-pointer`}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(index)}
              >
                <p className="text-xl font-bold text-gray-900 text-center">
                  {sentence}
                </p>
                {state === "success" && (
                  <div className="text-center mt-2 text-2xl">✅</div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Could your learner read this?
                  </h2>
                  <p className="text-xl text-center text-gray-600 mb-6 font-semibold">
                    "{sentences[selectedCardIndex]}"
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl"
                      onClick={handleConfirm}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ Yes!
                    </motion.button>
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl"
                      onClick={handleCancel}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔄 Try Again
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Starter;
