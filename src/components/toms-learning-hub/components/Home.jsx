import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-800">
      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 py-16 sm:py-20 lg:py-24">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl animate-[fadeInDown_1s_ease-out] motion-reduce:animate-none">
            Welcome to Tom&apos;s Learning Hub
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg lg:text-xl animate-[fadeInUp_1s_ease-out] motion-reduce:animate-none">
            At our site, we believe that learning to read should be a fun and
            engaging experience for children. Our educational software is
            designed to help young readers build their confidence and skills by
            using <strong>sentence starters</strong> and{" "}
            <strong>common, everyday words</strong>.
          </p>
        </header>

        {/* Section 1 */}
        <section className="mt-10 w-full rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-8 animate-[fadeInDown_1s_ease-out] motion-reduce:animate-none">
          <h2 className="text-xl font-semibold sm:text-2xl">How It Works:</h2>
          <ul className="mt-4 space-y-4 text-sm leading-6 text-gray-700 sm:text-base">
            <li>
              <strong>Sentence Starters:</strong> We offer a wide variety of
              sentence starters that form the base of a sentence. These starters
              are crafted to be simple and meaningful, helping children
              understand the context and structure of sentences.
            </li>
            <li>
              <strong>Common Words and Phrases:</strong> The software introduces
              children to frequently used words in a fun way, reinforcing their
              recognition and understanding. By reading these common words in
              different contexts, children can start to form their own sentences
              and improve their reading fluency.
            </li>
            <li>
              <strong>Interactive Learning:</strong> Our program encourages
              children to interact with the content, helping them stay engaged
              and interested. The goal is to make reading not just a learning
              process but an adventure they can enjoy!
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mt-6 w-full rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur sm:mt-8 sm:p-6 lg:mt-10 lg:p-8 animate-[fadeInUp_1s_ease-out] motion-reduce:animate-none">
          <h2 className="text-xl font-semibold sm:text-2xl">Why Choose Us?</h2>
          <ul className="mt-4 space-y-4 text-sm leading-6 text-gray-700 sm:text-base">
            <li>
              <strong>Designed for Kids:</strong> Our software is tailored
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
              educator searching for new tools to engage students, our platform
              offers valuable resources to support literacy development.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-8 sm:mt-10">
          <Link to="/starter" className="group inline-block">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-base"
            >
              <span className="absolute inset-0 rounded-xl bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              Click here to generate some sentences for some light learning
              material to go over with your children.
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative Animated Elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Circle */}
        <div
          className="absolute left-[12%] top-[18%] h-[120px] w-[120px] rounded-full bg-blue-500/70 opacity-20 sm:h-[150px] sm:w-[150px]"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationDelay: "0s",
          }}
        />
        {/* Square */}
        <div
          className="absolute right-[12%] top-1/3 h-[120px] w-[120px] bg-teal-400/70 opacity-20 sm:h-[150px] sm:w-[150px]"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />
        {/* Triangle */}
        <div
          className="absolute left-[28%] bottom-[8%] opacity-20"
          style={{
            width: 0,
            height: 0,
            borderLeft: "60px solid transparent",
            borderRight: "60px solid transparent",
            borderBottom: "110px solid #f5a623",
            animation: "float 6s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Keyframes (kept inline so no Tailwind config changes are needed) */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
