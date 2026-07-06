import { formatProblem } from "./generateProblems";

export default function MathPrintWorksheet({
  problems,
  activeLevel,
  includeAnswerKey,
}) {
  return (
    <div className="hub-print-only hidden">
      <div className="math-worksheet-header">
        <h1 className="math-worksheet-title">Math Practice Worksheet</h1>
        <div className="math-worksheet-meta">
          <span>Name: ________________________________</span>
          <span>Date: ________________</span>
        </div>
        {activeLevel ? (
          <p className="mt-3 text-sm text-slate-600">
            {activeLevel.label} · {activeLevel.description}
          </p>
        ) : null}
      </div>

      <div className="math-problems-grid">
        {problems.map((problem, index) => (
          <div key={index} className="math-problem-card">
            <p className="math-problem-number">#{index + 1}</p>
            <div className="math-problem-body">
              <pre className="math-problem-text">{formatProblem(problem)}</pre>
            </div>
          </div>
        ))}
      </div>

      {includeAnswerKey && problems.length > 0 ? (
        <section className="math-answer-key">
          <h2 className="math-answer-key-title">Answer Key</h2>
          <ul className="math-answer-list">
            {problems.map((problem, index) => (
              <li key={index}>
                #{index + 1}: {problem.answer}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
