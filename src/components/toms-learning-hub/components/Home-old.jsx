import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      className="relative min-h-screen overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 py-16 sm:py-20 lg:py-24">
        <motion.header
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Welcome to Tom&apos;s Learning Hub
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg lg:text-xl animate-[fadeInUp_1s_ease-out] motion-reduce:animate-none">
            I believe that learning to read should be a fun and engaging
            experience for children. This educational software is designed to
            help young readers build their confidence and skills by using{" "}
            <strong>sentence starters</strong> and{" "}
            <strong>common, everyday words</strong>.
          </p>
        </motion.header>

        {/* Section 1 */}
        <motion.section
          className="mt-10 w-full rounded-2xl bg-white shadow-xl p-5 backdrop-blur-sm border border-gray-200 sm:p-6 lg:p-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <h2 className="text-xl font-semibold sm:text-2xl">How It Works:</h2>
          <ul className="mt-4 space-y-4 text-sm leading-6 text-gray-700 sm:text-base">
            <li>
              <strong>Sentence Starters:</strong> A wide variety of sentence
              starters that form the base of a sentence. These starters are
              crafted to be simple and meaningful, helping children understand
              the context and structure of sentences.
            </li>
            <li>
              <strong>Common Words and Phrases:</strong> Introduces children to
              frequently used words in a fun way, reinforcing their recognition
              and understanding. By reading these common words in different
              contexts, children can start to form their own sentences and
              improve their reading fluency.
            </li>
            <li>
              <strong>Interactive Learning:</strong> Encourages children to
              interact with the content, helping them stay engaged and
              interested. The goal is to make reading not just a learning
              process but an adventure they can enjoy!
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <motion.section
          className="mt-6 w-full rounded-2xl bg-white shadow-xl p-5 backdrop-blur-sm border border-gray-200 sm:mt-8 sm:p-6 lg:mt-10 lg:p-8"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <h2 className="text-xl font-semibold sm:text-2xl">Why Use This?</h2>
          <ul className="mt-4 space-y-4 text-sm leading-6 text-gray-700 sm:text-base">
            <li>
              <strong>Designed for Kids:</strong> Tailored and tested
              specifically for young readers. It’s colorful, easy to use, and
              packed with fun animations and sounds that keep children motivated
              and eager to learn.
            </li>
            <li>
              <strong>Builds Confidence:</strong> By gradually introducing
              children to new words and sentence structures, we help them build
              confidence in their reading abilities.
            </li>
            <li>
              <strong>Perfect for Nightly Homework:</strong> Print out material
              straight from the site and bring it to the dinner table, or
              wherever your learner can best grow.
            </li>
            <li>
              <strong>Supports Parents and Educators:</strong> Whether you're a
              parent looking to supplement your child's learning at home or an
              educator searching for new tools to engage students, this platform
              offers valuable resources to support literacy development.
            </li>
          </ul>
        </motion.section>

        {/* CTA */}
        <motion.div
          className="mt-8 sm:mt-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link to="/starter" className="inline-block">
            <motion.button
              type="button"
              className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-base"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              🎯 Start Learning Now!
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Animated Elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Circle */}
        <motion.div
          className="absolute left-[12%] top-[18%] h-[120px] w-[120px] rounded-full bg-blue-500/30 sm:h-[150px] sm:w-[150px]"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Square */}
        <motion.div
          className="absolute right-[12%] top-1/3 h-[120px] w-[120px] bg-purple-500/30 sm:h-[150px] sm:w-[150px]"
          animate={{
            y: [0, 40, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        {/* Triangle */}
        <motion.div
          className="absolute left-[28%] bottom-[8%]"
          style={{
            width: 0,
            height: 0,
            borderLeft: "60px solid transparent",
            borderRight: "60px solid transparent",
            borderBottom: "110px solid rgba(245, 166, 35, 0.3)",
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </motion.div>
  );
};

export default Home;
