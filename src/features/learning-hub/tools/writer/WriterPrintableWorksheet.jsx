import {
  WRITING_LINE_COUNT,
  educatorChecklist,
} from "../../data/writer-topics";

function WritingLines({ count = WRITING_LINE_COUNT }) {
  return (
    <div className="writer-lines space-y-5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="writer-line" />
      ))}
    </div>
  );
}

export default function WriterPrintableWorksheet({ topicData, showChecklist = true }) {
  return (
    <article className="writer-worksheet">
      <h2 className="writer-worksheet-title">{topicData.topic}</h2>

      <div className="writer-name-field">
        <p className="writer-label">Writer&apos;s name</p>
        <div className="writer-line writer-line-wide" />
      </div>

      {topicData.subtopics.map((subtopic) => (
        <section key={subtopic} className="writer-prompt-section">
          <h3 className="writer-prompt-title">{subtopic}</h3>
          <WritingLines />
        </section>
      ))}

      {showChecklist ? (
        <section className="writer-checklist-print">
          <h3 className="writer-prompt-title">Check for</h3>
          <ul>
            {educatorChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
