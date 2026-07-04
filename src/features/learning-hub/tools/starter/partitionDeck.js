export function moveCardLaterInNotReadOrder(order, cardId) {
  const index = order.indexOf(cardId);
  if (index === -1) {
    return [...order, cardId];
  }
  if (index === order.length - 1) {
    return order;
  }

  const next = order.filter((id) => id !== cardId);
  const laterIndex =
    index + 1 + Math.floor(Math.random() * (next.length - index));
  next.splice(laterIndex, 0, cardId);
  return next;
}

export function createNotReadOrder(deck, cardStates = {}) {
  return deck
    .filter((card) => cardStates[card.id] !== "success")
    .map((card) => card.id);
}

export function partitionDeckByReadState(deck, cardStates, notReadOrder = []) {
  const deckById = Object.fromEntries(deck.map((card) => [card.id, card]));
  const read = [];
  const notRead = [];
  const seenNotRead = new Set();

  for (const card of deck) {
    if (cardStates[card.id] === "success") {
      read.push(card);
    }
  }

  for (const id of notReadOrder) {
    const card = deckById[id];
    if (card && cardStates[id] !== "success") {
      notRead.push(card);
      seenNotRead.add(id);
    }
  }

  for (const card of deck) {
    if (cardStates[card.id] !== "success" && !seenNotRead.has(card.id)) {
      notRead.push(card);
    }
  }

  return { notRead, read };
}
