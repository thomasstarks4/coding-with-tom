export function countShownStarters(starters) {
  if (!starters) {
    return 0;
  }

  return Object.values(starters).filter((starter) => starter.isShown).length;
}
