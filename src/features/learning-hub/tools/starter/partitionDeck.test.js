import { describe, it, expect } from "vitest";
import {
  partitionDeckByReadState,
  moveCardLaterInNotReadOrder,
  createNotReadOrder,
} from "./partitionDeck";

describe("partitionDeckByReadState", () => {
  const deck = [
    { id: "starter1", sentence: "I can see the cat." },
    { id: "starter2", sentence: "We like dogs." },
    { id: "starter3", sentence: "She is happy." },
  ];

  it("orders not-read cards using the provided queue", () => {
    const result = partitionDeckByReadState(
      deck,
      { starter1: "success" },
      ["starter3", "starter2"],
    );

    expect(result.read.map((card) => card.id)).toEqual(["starter1"]);
    expect(result.notRead.map((card) => card.id)).toEqual([
      "starter3",
      "starter2",
    ]);
  });

  it("moves all cards to read when every card is successful", () => {
    const result = partitionDeckByReadState(
      deck,
      {
        starter1: "success",
        starter2: "success",
        starter3: "success",
      },
      ["starter2", "starter3", "starter1"],
    );

    expect(result.notRead).toEqual([]);
    expect(result.read).toHaveLength(3);
  });
});

describe("moveCardLaterInNotReadOrder", () => {
  it("moves a card to a later index in the queue", () => {
    const order = ["a", "b", "c", "d"];
    const next = moveCardLaterInNotReadOrder(order, "b");

    expect(next.indexOf("b")).toBeGreaterThan(1);
    expect(next).toHaveLength(4);
    expect(new Set(next)).toEqual(new Set(order));
  });

  it("keeps a lone card in place", () => {
    expect(moveCardLaterInNotReadOrder(["a"], "a")).toEqual(["a"]);
  });
});

describe("createNotReadOrder", () => {
  it("excludes cards already marked as read", () => {
    const deck = [
      { id: "starter1", sentence: "One." },
      { id: "starter2", sentence: "Two." },
    ];

    expect(
      createNotReadOrder(deck, { starter1: "success" }),
    ).toEqual(["starter2"]);
  });
});
