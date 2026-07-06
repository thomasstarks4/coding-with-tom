import { describe, it, expect } from "vitest";
import {
  buildSentenceDeck,
  getShownStarterFingerprint,
} from "./buildSentenceDeck";
import { initialStarters } from "../../data/starters";

describe("buildSentenceDeck", () => {
  it("only includes starters marked as shown", () => {
    const settings = {
      ...initialStarters,
      starter1: { ...initialStarters.starter1, isShown: true },
      starter2: { ...initialStarters.starter2, isShown: false },
    };

    const deck = buildSentenceDeck(settings);
    const ids = deck.map((card) => card.id);

    expect(ids).toContain("starter1");
    expect(ids).not.toContain("starter2");
    expect(deck.length).toBe(
      Object.values(settings).filter((starter) => starter.isShown).length,
    );
  });

  it("returns stable card shape with sentence text", () => {
    const deck = buildSentenceDeck({
      starter1: { isShown: true, text: "I can see the", partnerType: "single noun" },
    });

    expect(deck).toEqual([
      expect.objectContaining({
        id: "starter1",
        sentence: expect.stringMatching(/^I can see the .+\.$/),
      }),
    ]);
  });

  it("builds a fingerprint from shown starter keys", () => {
    const fingerprint = getShownStarterFingerprint({
      starter3: { isShown: true },
      starter1: { isShown: true },
      starter2: { isShown: false },
    });

    expect(fingerprint).toBe("starter1,starter3");
  });
});
