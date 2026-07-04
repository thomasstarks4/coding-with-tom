export function gradeAnswer(input, expectedAnswer) {
  if (input === null || input === undefined) {
    return { valid: false, correct: false, parsedValue: null, error: "Enter a whole number." };
  }

  const trimmed = String(input).trim();
  if (trimmed === "") {
    return { valid: false, correct: false, parsedValue: null, error: "Enter a whole number." };
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return { valid: false, correct: false, parsedValue: null, error: "Use a whole number only." };
  }

  const parsedValue = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsedValue)) {
    return { valid: false, correct: false, parsedValue: null, error: "Enter a whole number." };
  }

  return {
    valid: true,
    correct: parsedValue === expectedAnswer,
    parsedValue,
    error: null,
  };
}
