import React, { useState } from "react";

function MathGenerator() {
  // Store as a string so user can type freely
  const [numProblems, setNumProblems] = useState("1");
  const [problems, setProblems] = useState([]);

  const generateProblems = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const generatedProblems = [];

    // Helper function to generate a random number between 1 and 10
    const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

    // Helper function to randomly select an operator
    const getOperator = (num1, num2) =>
      num1 < num2 ? "+" : Math.random() < 0.5 ? "+" : "-";

    // Create the problems
    for (let i = 0; i < parseInt(numProblems, 10); i++) {
      const num1 = getRandomNumber();
      const num2 = getRandomNumber();
      const operator = getOperator(num1, num2);

      // Non‑breaking space in JS is \u00A0
      // We'll also add newlines for the stacked layout
      const problemText =
        `   ${num1}\n` + // First line, just the top number
        `${operator}\u00A0${num2}\n` + // Second line, operator + second number
        `_______`; // Third line, underscores for the answer

      generatedProblems.push(problemText);
    }

    setProblems(generatedProblems); // Update the state with the generated problems
  };

  const onInputChange = (e) => {
    // Keep the value as a string in state
    setNumProblems(e.target.value);
  };

  return (
    <div className="col bg-black">
      <h1 className="p-1 text-2xl text-white">Math Problem Generator</h1>
      <div className="noprint">
        <form className="m-4" id="problem-form" onSubmit={generateProblems}>
          <label htmlFor="numProblems">Number of Problems:</label>
          <input
            className="text-black"
            type="number"
            id="numProblems"
            value={numProblems}
            name="numProblems"
            min="1"
            required
            onChange={onInputChange}
          />
          <button className="startProblems" type="submit">
            Generate Problems
          </button>
        </form>
      </div>

      {/* 
        The key piece: using "whiteSpace: 'pre'" to preserve
        newlines and spacing from the problemText strings.
      */}
      <div
        id="problems"
        className="problems-container font-extrabold text-lg"
        style={{ whiteSpace: "pre" }}
      >
        {problems.map((problem, index) => (
          <div key={index} className="problem">
            {problem}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MathGenerator;
