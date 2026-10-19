import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import MathQuizPage from './MathQuizPage';
import { HUB_PROGRESS_KEY } from '../../../hooks/useHubProgress';
vi.mock('./math-quiz-presets', async (importOriginal) => ({
  ...await importOriginal(),
  buildQuizFromPreset: () => [{ a: 2, b: 3, operator: '+', answer: 5 }],
}));
beforeEach(() => localStorage.clear());
it('replaces a saved best score after completing a better preset attempt', async () => {
  localStorage.setItem(HUB_PROGRESS_KEY, JSON.stringify({ mathQuiz: {
    attemptMode: 'singleAttempt', quizzesCompleted: 1,
    bestScores: { 'l1-quick-ten': { firstTry: 0, final: 0, total: 1 } },
  } }));
  render(<MemoryRouter><MathQuizPage /></MemoryRouter>);
  fireEvent.click(screen.getAllByRole('button', { name: /start test/i })[0]);
  fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: 'Check answer' }));
  expect(await screen.findByText('Quiz complete')).toBeInTheDocument();
  await waitFor(() => {
    const saved = JSON.parse(localStorage.getItem(HUB_PROGRESS_KEY)).mathQuiz;
    expect(saved.bestScores['l1-quick-ten'].final).toBe(1);
    expect(saved.quizzesCompleted).toBe(2);
  });
});
