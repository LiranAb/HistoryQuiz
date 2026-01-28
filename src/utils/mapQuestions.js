import { decode } from "he";
import { shuffleArray } from "./shuffle";

export function mapQuestions(results) {
  return results.map((q, idx) => {
    const correct = decode(q.correct_answer);
    const incorrect = q.incorrect_answers.map((x) => decode(x));
    const answers = shuffleArray([correct, ...incorrect]); // ערבוב פעם אחת

    return {
      id: String(idx + 1),
      question: decode(q.question),
      correctAnswer: correct,
      answers,
    };
  });
}
