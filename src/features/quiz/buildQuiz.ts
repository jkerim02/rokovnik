/**
 * buildQuiz — generiše multiple-choice pitanja iz lokalnih podataka.
 *  - vocab: riječ → pogodi značenje
 *  - notes: citat → pogodi knjigu
 * Čista logika (bez UI/DB), lako testabilna.
 */
export type QuizQuestion = {
  id: string;
  prompt: string; // ono što se pokazuje (riječ ili citat)
  options: string[]; // ponuđeni odgovori (uključuje tačan)
  correctIndex: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Napravi pitanja: za svaki tačan par (prompt, answer) bira do `choices-1`
 * pogrešnih odgovora iz ostalih `answer` vrijednosti.
 */
export function buildQuestions(
  items: { id: string; prompt: string; answer: string }[],
  choices = 4,
): QuizQuestion[] {
  const usable = items.filter((it) => it.prompt.trim() && it.answer.trim());
  if (usable.length < 2) return [];

  const allAnswers = Array.from(new Set(usable.map((it) => it.answer)));

  return shuffle(usable).map((item) => {
    const distractors = shuffle(
      allAnswers.filter((a) => a !== item.answer),
    ).slice(0, Math.max(1, Math.min(choices - 1, allAnswers.length - 1)));
    const options = shuffle([item.answer, ...distractors]);
    return {
      id: item.id,
      prompt: item.prompt,
      options,
      correctIndex: options.indexOf(item.answer),
    };
  });
}
