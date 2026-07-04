import { useEffect, useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { RefreshCw } from "lucide-react";
import HubModal from "../../../features/learning-hub/layout/HubModal";
import {
  buildSentenceDeck,
  getShownStarterFingerprint,
} from "../../../features/learning-hub/tools/starter/buildSentenceDeck";
import {
  partitionDeckByReadState,
  createNotReadOrder,
  moveCardLaterInNotReadOrder,
} from "../../../features/learning-hub/tools/starter/partitionDeck";
import StarterDeckContainer, {
  StarterHintBanner,
  StarterReadCard,
  StarterSentenceCard,
} from "../../../features/learning-hub/tools/starter/StarterDeckContainers";

const Starter = ({ startersSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardStates, setCardStates] = useState({});
  const [notReadOrder, setNotReadOrder] = useState([]);
  const [deckVersion, setDeckVersion] = useState(0);

  const shownFingerprint = useMemo(
    () => getShownStarterFingerprint(startersSelected),
    [startersSelected],
  );

  const deck = useMemo(
    () => buildSentenceDeck(startersSelected),
    [startersSelected, shownFingerprint, deckVersion],
  );

  const { notRead, read } = useMemo(
    () => partitionDeckByReadState(deck, cardStates, notReadOrder),
    [deck, cardStates, notReadOrder],
  );

  const selectedCard = deck.find((card) => card.id === selectedCardId);
  const sessionComplete = deck.length > 0 && read.length === deck.length;
  const showHint = deck.length > 0 && !sessionComplete;

  useEffect(() => {
    setCardStates({});
    setNotReadOrder(deck.map((card) => card.id));
  }, [shownFingerprint, deckVersion, deck]);

  const handleNewSet = () => {
    setDeckVersion((version) => version + 1);
    setCardStates({});
    setNotReadOrder([]);
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedCardId) {
      return;
    }
    setCardStates((prev) => ({ ...prev, [selectedCardId]: "success" }));
    setNotReadOrder((order) => order.filter((id) => id !== selectedCardId));
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  const handleCancel = () => {
    if (!selectedCardId) {
      return;
    }
    setNotReadOrder((order) => {
      const activeOrder =
        order.length > 0
          ? order.filter((id) => cardStates[id] !== "success")
          : createNotReadOrder(deck, cardStates);
      return moveCardLaterInNotReadOrder(activeOrder, selectedCardId);
    });
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-1 sm:px-0">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <header className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Sentence Starter
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
            Work through the Not read container first. When your learner finishes
            a sentence, move it to Read.
          </p>
        </header>
        <button
          type="button"
          onClick={handleNewSet}
          className="inline-flex min-h-[var(--hub-touch-min)] shrink-0 items-center justify-center gap-2 self-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 sm:self-start"
        >
          <RefreshCw size={16} />
          New set
        </button>
      </div>

      {deck.length > 0 ? (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">
              Session progress
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-emerald-700">{read.length}</span>
              {" / "}
              <span className="font-semibold text-slate-800">{deck.length}</span>
              {" read"}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
              style={{
                width: deck.length
                  ? `${(read.length / deck.length) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>
      ) : null}

      {showHint ? (
        <div className="mb-6">
          <StarterHintBanner />
        </div>
      ) : null}

      {deck.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-800">
            No sentence starters are selected.
          </p>
          <p className="mt-2 text-slate-600">
            Open Sentence Tuner and choose at least one starter to practice.
          </p>
        </div>
      ) : (
        <LayoutGroup>
          <div className="flex flex-col gap-6">
            <StarterDeckContainer
              title="Not read"
              position="top"
              count={notRead.length}
              description="Sentences waiting for your learner."
              emptyMessage="All sentences have been read. Start a new set or celebrate the finish!"
            >
              {notRead.map((card) => (
                <StarterSentenceCard
                  key={card.id}
                  card={card}
                  onClick={handleCardClick}
                />
              ))}
            </StarterDeckContainer>

            <StarterDeckContainer
              title="Read"
              position="bottom"
              count={read.length}
              description="Sentences your learner has read successfully."
              emptyMessage="Sentences move here after you mark them as read."
            >
              {read.map((card) => (
                <StarterReadCard key={card.id} card={card} />
              ))}
            </StarterDeckContainer>
          </div>
        </LayoutGroup>
      )}

      {sessionComplete ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-center">
          <p className="text-lg font-semibold text-emerald-900">
            Session complete!
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Every sentence is in the Read container. Nice work.
          </p>
        </div>
      ) : null}

      <HubModal
        open={isModalOpen && !!selectedCard}
        onClose={closeModal}
        maxWidth="max-w-md"
        labelledBy="starter-modal-title"
      >
        <h2
          id="starter-modal-title"
          className="text-center text-2xl font-bold text-slate-900"
        >
          Could your learner read this?
        </h2>
        <p className="mb-6 mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center text-xl font-semibold leading-relaxed text-slate-700">
          &ldquo;{selectedCard?.sentence}&rdquo;
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="flex-1 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            onClick={handleConfirm}
          >
            Yes — move to Read
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-sky-300 bg-sky-50 px-5 py-3.5 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
            onClick={handleCancel}
          >
            Try again — practice later
          </button>
        </div>
      </HubModal>
    </div>
  );
};

export default Starter;
