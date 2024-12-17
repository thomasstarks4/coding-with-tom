import React, { useState } from "react";
import "../styles/WordHighlighter.css";

const WordHighlighter = () => {
  const [text, setText] = useState("");
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
    <div className="container">
      <h1>Word Highlighter</h1>
      <p>Enter text in the box below and see each word highlighted:</p>
      <textarea
        className="text-input"
        placeholder="Type your text here..."
        value={text}
        onChange={handleInputChange}
      ></textarea>
      <br />
      <button className="highlight-button" onClick={highlightWords}>
        Highlight Words
      </button>
      <div className="output">
        {highlightedWords.map((word, index) => (
          <span
            key={index}
            className="highlight"
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
