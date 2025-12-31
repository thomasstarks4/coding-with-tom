import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Writer = () => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedTopics, setCompletedTopics] = useState([]);

  const topics = [
    {
      topic: "My Favorite Animal",
      subtopics: [
        "What does it look like?",
        "What does it eat?",
        "Why do I like it?",
      ],
    },
    {
      topic: "A Day At The Park",
      subtopics: [
        "Who was with me?",
        "What did I eat?",
        "What was my favorite part?",
      ],
    },
    {
      topic: "What I Like To Eat",
      subtopics: [
        "What is my favorite food?",
        "Who makes it for me?",
        "When do I eat it?",
      ],
    },
    {
      topic: "My Family",
      subtopics: [
        "Who is in my family?",
        "What do we do together?",
        "Where do we live?",
      ],
    },
    {
      topic: "A Fun Game To Play",
      subtopics: [
        "What are the rules?",
        "What do I like about it?",
        "Who do I play it with?",
      ],
    },
    {
      topic: "My Best Friend",
      subtopics: [
        "What is their name?",
        "How did we meet?",
        "What do we do together?",
      ],
    },
    {
      topic: "A Rainy Day",
      subtopics: [
        "What happens when it rains?",
        "How does it make me feel?",
        "What do I do on a rainy day?",
      ],
    },
    {
      topic: "The Color I Like Most",
      subtopics: [
        "What is my favorite color?",
        "What things are this color?",
        "Why do I like this color?",
      ],
    },
    {
      topic: "A Place I Want To Visit",
      subtopics: [
        "Where is it?",
        "What can I do there?",
        "Who would I go with?",
      ],
    },
    {
      topic: "My Favorite Toy",
      subtopics: ["What is it?", "What does it do?", "Who gave it to me?"],
    },
  ];

  const handleCardClick = (index) => {
    setSelectedTopicIndex(index);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (!completedTopics.includes(selectedTopicIndex)) {
      setCompletedTopics((prev) => [...prev, selectedTopicIndex]);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 p-8 rounded-2xl shadow-xl mb-8 noprint"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            ✍️ Writing Topics
          </h1>
          <p className="text-white/90 text-center text-lg">
            Choose a topic to get started with creative writing!
          </p>
        </motion.div>

        {selectedTopicIndex !== null && (
          <motion.button
            className="noprint mb-6 mx-auto block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg"
            onClick={() => window.print()}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            🖨️ Print My Homework!
          </motion.button>
        )}

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 noprint">
          {topics.map((topicObj, index) => {
            const isCompleted = completedTopics.includes(index);
            return (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl shadow-lg border-4 cursor-pointer ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-600"
                    : "bg-gradient-to-br from-purple-300 to-pink-300 border-purple-400"
                }`}
                initial={{ scale: 0, rotate: 10 }}
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
                  {topicObj.topic}
                </p>
                {isCompleted && (
                  <div className="text-center mt-2 text-2xl">✅</div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedTopicIndex !== null && (
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
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Could your little one write something?
                  </h2>
                  <p className="text-xl text-purple-700 font-bold mb-3">
                    Topic: {topics[selectedTopicIndex].topic}
                  </p>
                  <p className="text-gray-700 font-semibold mb-2">
                    Subtopics to explore:
                  </p>
                  <ul className="list-disc list-inside mb-6 space-y-1 text-gray-600">
                    {topics[selectedTopicIndex].subtopics.map(
                      (subtopic, index) => (
                        <li key={index}>{subtopic}</li>
                      )
                    )}
                  </ul>
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl"
                      onClick={handleConfirm}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ They did!
                    </motion.button>
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-6 rounded-xl"
                      onClick={handleCancel}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Not this time
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Printable Form */}
        {selectedTopicIndex !== null && (
          <div className="hidden print:block bg-white p-8">
            <h2 className="text-3xl font-bold text-center mb-8 border-b-4 border-gray-800 pb-4">
              {topics[selectedTopicIndex].topic}
            </h2>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Writer's Name:</h3>
              <div className="border-b-2 border-gray-400 pb-1">
                ________________________________________________________________
              </div>
            </div>
            {topics[selectedTopicIndex].subtopics.map((subtopic, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-bold mb-3">{subtopic}</h3>
                <div className="space-y-3">
                  <div className="border-b border-gray-400">
                    ________________________________________________________________
                  </div>
                  <div className="border-b border-gray-400">
                    ________________________________________________________________
                  </div>
                  <div className="border-b border-gray-400">
                    ________________________________________________________________
                  </div>
                  <div className="border-b border-gray-400">
                    ________________________________________________________________
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .noprint { display: none !important; }
          body { background: white !important; }
        }
        @page { margin: 1cm; }
      `}</style>
    </motion.div>
  );
};

export default Writer;
