import React, { useState } from "react";

function MathGenerator() {
  const [numProblems, setNumProblems] = useState("10");
  const [problems, setProblems] = useState([]);
  const [complexityLevel, setComplexityLevel] = useState(1);
  const [showComplexityDescriptions, setShowComplexityDescriptions] =
    useState(false);
  const generateProblems = (e) => {
    //Complexity Overview:
    // 1: Default - Simple Addition and subtraction between 1 and 10. No Negatives.
    // 2: Simple Addition and Subtraction between 1 and 20. No Negatives.
    // 3: Simple Addition and Subtraction between 1 and 50. No Negatives.
    // 4: Simple Addition and Subtraction between 1 and 10. Negatives allowed.
    // 5: Simple Addition and Subtraction between 1 and 20. Negatives allowed.
    // 6: Simple Addition and Subtraction between 1 and 50. Negatives allowed.

    e.preventDefault(); // Prevent the form from refreshing the page
    const generatedProblems = []; // Fresh array of problems
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
    // Helper function to generate a random number between 1 and the maximum number
    const getRandomNumber = () =>
      Math.floor(Math.random() * getMaxNumber()) + 1;

    // Helper function to select an operator. Behaves differently based on complexity level.
    const getOperator = (num1, num2) => {
      let operator = "";
      switch (parseInt(complexityLevel)) {
        case 4:
        case 5:
        case 6: // Allow negatives
          operator = Math.random() > 0.5 ? "+" : "-";
          return operator;
        default: // Don't allow negatives
          if (num1 <= num2) operator = "+";
          else operator = Math.random() < 0.5 ? "+" : "-";
          return operator;
      }
    };

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
    <div className="col bg-[#090a37] mb-4 ">
      {/* Header */}
      <h1 className="p-1 font-bold text-3xl text-white onlyPrint">
        Math Problem Generator
      </h1>
      <div className="noprint">
        {/* This div is not included in printing */}
        <form className="m-4" id="problem-form" onSubmit={generateProblems}>
          {/* Complexity */}
          <div className="p-4 py-8 rounded-xl bg-slate-800 text-white text-center flex flex-col w-full">
            <label className="font-semibold mb-2" htmlFor="complexityLevel">
              How complex do you want the problems to be?
              {/* See Complexity Overview in generateProblems function */}
            </label>
            <div class="w-full">
              {/* Descriptions */}
              {showComplexityDescriptions && (
                <div
                  id="complexityDescriptions"
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-gray-300 min-h-screen min-w-full flex justify-center items-center`}
                >
                  <div className="bg-slate-800 rounded-xl shadow-lg p-8 max-w-md w-full">
                    <h2 className="text-xl font-semibold text-white mb-6 text-center">
                      Complexity Levels Overview
                    </h2>
                    <ul className="space-y-4 text-sm">
                      <li>
                        <strong className="text-white">Level 1:</strong> Simple
                        addition and subtraction problems using numbers between
                        1 and 10, ensuring no negative results.
                      </li>
                      <li>
                        <strong className="text-white">Level 2:</strong> Simple
                        addition and subtraction problems using numbers between
                        1 and 20, ensuring no negative results.
                      </li>
                      <li>
                        <strong className="text-white">Level 3:</strong> Simple
                        addition and subtraction problems using numbers between
                        1 and 50, ensuring no negative results.
                      </li>
                      <li>
                        <strong className="text-white">Level 4:</strong> Simple
                        addition and subtraction problems using numbers between
                        1 and 10, allowing for negative results.
                      </li>
                      <li>
                        <strong className="text-white">Level 5:</strong> Simple
                        addition and subtraction problems using numbers between
                        1 and 20, allowing for negative results.
                      </li>
                      <li>
                        <strong className="text-white">Level 6:</strong> Simple
                        addition and subtraction problems using numbers between
                        1 and 50, allowing for negative results.
                      </li>
                    </ul>
                    <button
                      className="mt-8 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 w-full"
                      onClick={() => setShowComplexityDescriptions(false)}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Select Complexity Level */}
            <div className="w-full">
              <select
                className="text-black justify-self-center-center w-20 text-xs text-center p-1 m-2 font-semibold rounded"
                name="complexityLevel"
                id="complexityLevel"
                onChange={(e) => setComplexityLevel(e.target.value)}
              >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
                <option value="6">Level 6</option>
              </select>
            </div>
            {/* Complexity Level */}
            <div className="text-sm">
              <b>Complexity Selected:</b>{" "}
              <span className="font-extrabold text-green-400">
                Level {complexityLevel}
              </span>
            </div>
            <button
              type="button"
              className="mt-4 bg-slate-600 mx-auto rounded hover:font-semibold hover:p-2 p-1 text-xs text-nowrap  w-4/6 transition-all duration-100"
              onClick={() => setShowComplexityDescriptions(true)}
            >
              Show Complexity Descriptions
            </button>
          </div>
          {/* Number of problems */}
          <div class="p-4 py-8 rounded-xl bg-slate-800 text-white text-center flex flex-col mt-4 w-full">
            <label className="font-semibold mb-4" htmlFor="numProblems">
              How many problems do you want?
            </label>
            <input
              className="text-black rounded p-2 mb-2 text-center"
              type="number"
              id="numProblems"
              value={numProblems}
              name="numProblems"
              min="1"
              required
              onChange={onInputChange}
            />
            {/* Action Buttons */}
            <div className="flex space-x-2 flex-row">
              <button className="startProblems w-full" type="submit">
                Generate Problems
              </button>
              <button
                className="printProblems w-full"
                type="button"
                onClick={() => {
                  window.print();
                  console.log("Printing math problems...");
                }}
              >
                Print Test!
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* Name and Date, only shown when printing */}
      <div class="hidden print:flex flex-row justify-center items-center my-8 space-x-4 onlyPrint">
        <div>Name: ________________________________</div>
        <div>Date: ________________</div>
      </div>
      {/* Problems */}
      <div
        id="problems"
        className="problems-container font-extrabold text-lg pb-4 onlyPrint"
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
