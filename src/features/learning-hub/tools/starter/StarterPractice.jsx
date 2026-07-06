import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildSentenceDeck,
  getShownStarterFingerprint,
} from "./buildSentenceDeck";
import {
  partitionDeckByReadState,
  createNotReadOrder,
  moveCardLaterInNotReadOrder,
} from "./partitionDeck";
import { useStarterFocusSession } from "./useStarterFocusSession";
import StarterPracticeDashboard from "./StarterPracticeDashboard";
import StarterFocusOverlay from "./StarterFocusOverlay";

export default function StarterPractice({ starters, className = "" }) {
  const [cardStates, setCardStates] = useState({});
  const [notReadOrder, setNotReadOrder] = useState([]);
  const [deckVersion, setDeckVersion] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const shownFingerprint = useMemo(
    () => getShownStarterFingerprint(starters),
    [starters],
  );

  const deck = useMemo(
    () => buildSentenceDeck(starters),
    [starters, shownFingerprint, deckVersion],
  );

  const { notRead, read } = useMemo(
    () => partitionDeckByReadState(deck, cardStates, notReadOrder),
    [deck, cardStates, notReadOrder],
  );

  useEffect(() => {
    setCardStates({});
    setNotReadOrder(deck.map((card) => card.id));
    setHasStarted(false);
  }, [shownFingerprint, deckVersion, deck]);

  const handleNewSet = useCallback(() => {
    setDeckVersion((version) => version + 1);
    setCardStates({});
    setNotReadOrder([]);
    setHasStarted(false);
  }, []);

  const handleMarkRead = useCallback((cardId) => {
    setCardStates((prev) => ({ ...prev, [cardId]: "success" }));
    setNotReadOrder((order) => order.filter((id) => id !== cardId));
    setHasStarted(true);
  }, []);

  const handleTryAgainLater = useCallback(
    (cardId) => {
      setNotReadOrder((order) => {
        const activeOrder =
          order.length > 0
            ? order.filter((id) => cardStates[id] !== "success")
            : createNotReadOrder(deck, cardStates);
        return moveCardLaterInNotReadOrder(activeOrder, cardId);
      });
      setHasStarted(true);
    },
    [cardStates, deck],
  );

  const focus = useStarterFocusSession({
    deck,
    notRead,
    read,
    onMarkRead: handleMarkRead,
    onTryAgainLater: handleTryAgainLater,
  });

  const readSentences = useMemo(
    () => read.map((card) => card.sentence),
    [read],
  );

  const handleStartFocus = useCallback(() => {
    setHasStarted(true);
    focus.open();
  }, [focus]);

  return (
    <section aria-label="Practice" className={className}>
      <StarterPracticeDashboard
        deckLength={deck.length}
        readCount={read.length}
        remainingCount={notRead.length}
        readSentences={readSentences}
        canOpenFocus={focus.canOpen}
        hasStarted={hasStarted}
        onStartFocus={handleStartFocus}
        onNewSet={handleNewSet}
      />

      <StarterFocusOverlay
        {...focus}
        onNewSet={handleNewSet}
      />
    </section>
  );
}
