import { QuestionType } from '../types';
import type { Question, AnswerRecord, ExamResult, ExamSubject } from '../types';

export function gradeAnswer(question: Question, selectedKeys: string[]): boolean {
  if (question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.TRUE_FALSE) {
    return selectedKeys.length === 1 && selectedKeys[0] === question.answer[0];
  }
  if (selectedKeys.length !== question.answer.length) return false;
  return question.answer.every(k => selectedKeys.includes(k));
}

export function calculateResult(
  subject: ExamSubject,
  questions: Question[],
  answers: Record<string, string[]>
): ExamResult {
  const maxScore = questions.length;
  let correctCount = 0;

  const answerRecords: AnswerRecord[] = [];
  const difficultyBreakdown: Record<number, { correct: number; total: number; label: string }> = {
    1: { correct: 0, total: 0, label: '初级' },
    2: { correct: 0, total: 0, label: '中级' },
    3: { correct: 0, total: 0, label: '高级' },
  };

  for (const q of questions) {
    difficultyBreakdown[q.difficulty].total++;

    const selectedKeys = answers[q.id] || [];
    const isCorrect = gradeAnswer(q, selectedKeys);

    if (isCorrect) {
      correctCount++;
      difficultyBreakdown[q.difficulty].correct++;
    }

    answerRecords.push({
      questionId: q.id,
      selectedKeys,
      isCorrect,
    });
  }

  return {
    subject,
    totalScore: correctCount,
    maxScore,
    correctCount,
    wrongCount: maxScore - correctCount,
    accuracy: maxScore > 0 ? correctCount / maxScore : 0,
    answerRecords,
    difficultyBreakdown,
  };
}
