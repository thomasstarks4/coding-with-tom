import React, { useState } from "react";
import "../styles/WordHighlighter.css";

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
    <div className="text-black font-extrabold bg-slate-500 text-center highlighter-container">
      <h1 className="text-black text-2xl mb-4">Word Highlighter</h1>
      <p>Enter text in the box below and see each word highlighted:</p>
      <textarea
        className="text-input rounded-lg p-2"
        placeholder="Enter a sentence..."
        value={text}
        onChange={handleInputChange}
      ></textarea>
      <br />
      <button className="three-d-button" onClick={highlightWords}>
        Highlight Words
      </button>
      <div className="text-center mt-4">
        Your highlighted words will show up below:
      </div>
      <div className="output">
        {highlightedWords.map((word, index) => (
          <span
            key={index}
            className="highlight text-black"
            onMouseOver={(e) => e.target.classList.add("hover-highlight")}
            onMouseOut={(e) => e.target.classList.remove("hover-highlight")}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordHighlighter;
