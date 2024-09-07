import "../styles/Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to Tom's Learning Hub</h1>
        <p className="welcome-subtitle">
          At our site, we believe that learning to read should be a fun and engaging experience for children. Our educational software is designed to help young readers build their confidence and skills by using <strong>sentence starters</strong> and <strong>common, everyday words</strong>.
        </p>

        <div className="content-section">
          <h2 className="section-title">How It Works:</h2>
          <ul className="feature-list">
            <li><strong>Sentence Starters:</strong> We offer a wide variety of sentence starters that form the base of a sentence. These starters are crafted to be simple and meaningful, helping children understand the context and structure of sentences.</li>
            <li><strong>Common Words and Phrases:</strong> The software introduces children to frequently used words in a fun way, reinforcing their recognition and understanding. By reading these common words in different contexts, children can start to form their own sentences and improve their reading fluency.</li>
            <li><strong>Interactive Learning:</strong> Our program encourages children to interact with the content, helping them stay engaged and interested. The goal is to make reading not just a learning process but an adventure they can enjoy!</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-title">Why Choose Us?</h2>
          <ul className="feature-list">
            <li><strong>Designed for Kids:</strong> Our software is tailored specifically for young readers. It’s colorful, easy to use, and packed with fun animations and sounds that keep children motivated and eager to learn.</li>
            <li><strong>Builds Confidence:</strong> By gradually introducing children to new words and sentence structures, we help them build confidence in their reading abilities.</li>
            <li><strong>Perfect for Nightly Homework:</strong> Print out material straight from the site and bring it to the dinner table, or wherever your learner can best grow.</li>
            <li><strong>Supports Parents and Educators:</strong> Whether you're a parent looking to supplement your child's learning at home or an educator searching for new tools to engage students, our platform offers valuable resources to support literacy development.</li>
          </ul>
        </div>

        <div className="cta-section">
            <Link to={'/starter'}>
          <button className="three-d-button">
            Click here to generate some sentences for some light learning material to go over with your children.
          </button>
          </Link>
        </div>
      </div>

      {/* Decorative Animated Elements */}
      <div className="animated-elements">
        <div className="animated-circle"></div>
        <div className="animated-square"></div>
        <div className="animated-triangle"></div>
      </div>
    </div>
  );
};

export default Home;
