import { useMemo, useState } from "react";
import { Printer, CheckCircle2 } from "lucide-react";
import { useHubProgress } from "../../hooks/useHubProgress";
import {
  educatorChecklist,
  writerTopics,
} from "../../data/writer-topics";
import WriterPrintableWorksheet from "./WriterPrintableWorksheet";
import HubModal from "../../layout/HubModal";
import HubToolPageHeader from "../../layout/HubToolPageHeader";
import "../../styles/writer-print.css";

export default function Writer() {
  const { progress, updateProgress } = useHubProgress();
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [printTopicIds, setPrintTopicIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedTopicIds = progress.completedTopics;
  const activeTopic = writerTopics.find((topic) => topic.id === activeTopicId);

  const completedCount = useMemo(
    () =>
      writerTopics.filter((topic) => completedTopicIds.includes(topic.id))
        .length,
    [completedTopicIds],
  );

  const topicsToPrint = useMemo(
    () => writerTopics.filter((topic) => printTopicIds.includes(topic.id)),
    [printTopicIds],
  );

  const togglePrintTopic = (topicId) => {
    setPrintTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  const selectAllForPrint = () => {
    setPrintTopicIds(writerTopics.map((topic) => topic.id));
  };

  const clearPrintSelection = () => {
    setPrintTopicIds([]);
  };

  const handleCardClick = (topicId) => {
    setActiveTopicId(topicId);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (!activeTopicId) {
      return;
    }
    if (!completedTopicIds.includes(activeTopicId)) {
      updateProgress({
        completedTopics: [...completedTopicIds, activeTopicId],
      });
    }
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    window.requestAnimationFrame(() => {
      window.print();
    });
  };

  return (
    <>
      <div className="hub-no-print mx-auto w-full max-w-5xl px-1 sm:px-0">
        <HubToolPageHeader toolId="writer" />

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Topics to print
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {printTopicIds.length === 0
                  ? "No topics selected yet."
                  : `${printTopicIds.length} topic${printTopicIds.length === 1 ? "" : "s"} selected`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={selectAllForPrint}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={clearPrintSelection}
                disabled={printTopicIds.length === 0}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={printTopicIds.length === 0}
                onClick={handlePrint}
                className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Printer size={16} />
                Print selected
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">Writing progress</p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-emerald-700">{completedCount}</span>
              {" / "}
              <span className="font-semibold text-slate-800">
                {writerTopics.length}
              </span>
              {" topics completed"}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-300"
              style={{
                width: `${(completedCount / writerTopics.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-base font-medium text-sky-950 sm:text-lg">
          Check the topics you want to print, then tap a topic to try it out with
          your learner.
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {writerTopics.map((topic) => {
            const isCompleted = completedTopicIds.includes(topic.id);
            const isActive = activeTopicId === topic.id;
            const isCheckedForPrint = printTopicIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className={`rounded-xl border bg-white shadow-sm transition-all ${
                  isCheckedForPrint
                    ? "border-sky-400 ring-2 ring-sky-100"
                    : isActive
                      ? "border-violet-300"
                      : isCompleted
                        ? "border-emerald-200"
                        : "border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3 p-5">
                  <input
                    id={`print-${topic.id}`}
                    type="checkbox"
                    checked={isCheckedForPrint}
                    onChange={() => togglePrintTopic(topic.id)}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-sky-600"
                    aria-label={`Include ${topic.topic} in printout`}
                  />
                  <button
                    type="button"
                    onClick={() => handleCardClick(topic.id)}
                    className="min-w-0 flex-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {topic.topic}
                      </h2>
                      {isCompleted ? (
                        <CheckCircle2
                          size={18}
                          className="shrink-0 text-emerald-600"
                          aria-label="Completed"
                        />
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Grade {topic.grade} · {topic.subtopics.length} prompts
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      {topic.subtopics[0]}
                    </p>
                    <p className="mt-3 text-sm font-medium text-sky-700">
                      Tap to try it out
                    </p>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <HubModal
          open={isModalOpen && !!activeTopic}
          onClose={closeModal}
          labelledBy="writer-modal-title"
        >
          <h2
            id="writer-modal-title"
            className="text-center text-2xl font-bold text-slate-900"
          >
            Ready to write?
          </h2>
          <p className="mt-3 text-center text-lg font-semibold text-sky-800">
            {activeTopic?.topic}
          </p>

          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-700">
              Prompts to discuss
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {activeTopic?.subtopics.map((subtopic) => (
                <li key={subtopic}>{subtopic}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Educator checklist
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {educatorChecklist.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="flex-1 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              onClick={handleConfirm}
            >
              They wrote about it
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              onClick={closeModal}
            >
              Not this time
            </button>
          </div>
        </HubModal>
      </div>

      <div className="hub-print-only hidden">
        {topicsToPrint.map((topic) => (
          <WriterPrintableWorksheet key={topic.id} topicData={topic} />
        ))}
      </div>
    </>
  );
}
