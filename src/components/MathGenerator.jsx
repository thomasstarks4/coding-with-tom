import React, { useState } from 'react';

function MathGenerator() {
  const [numProblems, setNumProblems] = useState(0);
  const [problems, setProblems] = useState([]);

  const generateProblems = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const generatedProblems = [];

    // Helper function to generate a random number between 1 and 10
    const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

    // Helper function to randomly select an operator
    const getOperator = (num1, num2) => (num1 < num2 ? '+' : Math.random() < 0.5 ? '+' : '-');

    // Helper function to create the space string based on the length
    // Keeps odd behavior from occuring on the print screen
    for (let i = 0; i < numProblems; i++) {
        const num1 = getRandomNumber();
        const num2 = getRandomNumber();
        const operator = getOperator(num1, num2);
        let space = ""
        switch (num1.toString().length + num2.toString().length)
        {
            case 2:
                space = "_____";
                break;

            case 3:
                space = "____";
                break;

            case 4:
                space = "___";
                break;

            default:
                space = ""
                break;

        }
                
        const problemText = `${num1} ${operator} ${num2} = ${space}`;
        generatedProblems.push(problemText);
    }

    setProblems(generatedProblems); // Update the state with the generated problems
  };

  const onInputChange = (e) => {
    setNumProblems(parseInt(e.target.value)); //Update the state with the number of problems to be generated
  };

  return (
    <div className="container col">
      <h1 className='p-1'>Math Problem Generator</h1>
        <div className="noPrint">
      <form id="problem-form" onSubmit={generateProblems}>
        <label htmlFor="numProblems">Number of Problems:</label>
        <input
          type="number"
          id="numProblems"
          value={numProblems}
          name="numProblems"
          min="1"
          required
          onChange={onInputChange}
          />
        <button className='startProblems' type="submit">Generate Problems</button>
      </form>
          </div>
      <div id="problems" className="problems-container">
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
