import { useState, useEffect, useCallback } from 'react';
import type { Phase, ExamConfig, Question, ExamResult, ExamSubject, RoundResult } from './types';
import { SUBJECT_INFO_MAP, EXAM_ROUNDS } from './types';
import { shuffle } from './utils/shuffle';
import { calculateResult } from './utils/scoring';
import { questionBank } from './data/questions';
import { HomePage } from './routes/HomePage';
import { ExamPage } from './routes/ExamPage';
import { ResultPage } from './routes/ResultPage';
import { KnowledgePage } from './routes/KnowledgePage';
import { PracticePage } from './routes/PracticePage';
import { HistoryPage } from './routes/HistoryPage';
import './App.css';

function pickQuestions(bank: Question[], subject: ExamSubject, count: number): Question[] {
  const pool = shuffle(bank.filter(q => q.subject === subject && q.difficulty >= 2));
  return pool.slice(0, count);
}

function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [roundIndex, setRoundIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [config, setConfig] = useState<ExamConfig>({ subject: EXAM_ROUNDS[0], totalQuestions: 8, timeLimit: 720 });
  const [result, setResult] = useState<ExamResult | null>(null);
  const [remainingTime, setRemainingTime] = useState(720);
  const [allResults, setAllResults] = useState<RoundResult[]>([]);

  const currentSubject = EXAM_ROUNDS[roundIndex];
  const isLastRound = roundIndex >= EXAM_ROUNDS.length - 1;

  const startExam = useCallback((subject: ExamSubject) => {
    const info = SUBJECT_INFO_MAP[subject];
    const picked = pickQuestions(questionBank, subject, info.questionCount);
    setQuestions(picked);
    setConfig({ subject, totalQuestions: info.questionCount, timeLimit: info.timeMinutes * 60 });
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setRemainingTime(info.timeMinutes * 60);
    setPhase('active');
  }, []);

  const answerQuestion = useCallback((questionId: string, keys: string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: keys }));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, questions.length - 1)));
  }, [questions.length]);

  const submitExam = useCallback(() => {
    const r = calculateResult(currentSubject, questions, answers);
    setResult(r);
    setAllResults(prev => [...prev, { subject: currentSubject, result: r }]);
    setPhase('submitted');
  }, [currentSubject, questions, answers]);

  const nextRound = useCallback(() => {
    const next = roundIndex + 1;
    if (next >= EXAM_ROUNDS.length) {
      setPhase('finished');
    } else {
      setRoundIndex(next);
      startExam(EXAM_ROUNDS[next]);
    }
  }, [roundIndex, startExam]);

  const goHome = useCallback(() => {
    setPhase('idle');
    setRoundIndex(0);
    setAllResults([]);
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== 'active' || config.timeLimit === 0) return;
    const timer = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, config.timeLimit]);

  // Auto-submit on time expiry
  useEffect(() => {
    if (phase === 'active' && remainingTime <= 0) {
      const r = calculateResult(currentSubject, questions, answers);
      setResult(r);
      setAllResults(prev => [...prev, { subject: currentSubject, result: r }]);
      setPhase('submitted');
    }
  }, [remainingTime, phase, currentSubject, questions, answers]);

  // Save history when all rounds are done
  useEffect(() => {
    if (phase !== 'finished' || allResults.length === 0) return;
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      allResults,
      totalScore: allResults.reduce((s, r) => s + r.result.correctCount, 0),
      maxScore: allResults.reduce((s, r) => s + r.result.maxScore, 0),
    };
    try {
      const raw = localStorage.getItem('ai-exam-history');
      const existing = raw ? JSON.parse(raw) : [];
      existing.unshift(entry);
      localStorage.setItem('ai-exam-history', JSON.stringify(existing.slice(0, 20)));
    } catch { /* ignore */ }
  }, [phase, allResults]);

  const currentQuestion = questions[currentIndex] ?? null;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? answeredCount / questions.length : 0;

  return (
    <>
      {phase === 'active' && (
        <ExamPage
          subjectLabel={SUBJECT_INFO_MAP[currentSubject].label}
          roundInfo={`第 ${roundIndex + 1} / ${EXAM_ROUNDS.length} 轮`}
          questions={questions}
          currentIndex={currentIndex}
          currentQuestion={currentQuestion}
          answers={answers}
          remainingTime={remainingTime}
          config={config}
          answeredCount={answeredCount}
          progress={progress}
          answerQuestion={answerQuestion}
          goNext={goNext}
          goPrev={goPrev}
          jumpTo={jumpTo}
          submitExam={submitExam}
        />
      )}
      {phase === 'submitted' && result && (
        <ResultPage
          result={result}
          questions={questions}
          roundInfo={`第 ${roundIndex + 1} / ${EXAM_ROUNDS.length} 轮`}
          isLastRound={isLastRound}
          allResults={allResults}
          onNextRound={nextRound}
          onGoHome={goHome}
        />
      )}
      {phase === 'finished' && (
        <ResultPage
          result={null}
          questions={[]}
          roundInfo=""
          isLastRound={true}
          allResults={allResults}
          onNextRound={() => {}}
          onGoHome={goHome}
          isFinal
        />
      )}
      {phase === 'idle' && (
        <HomePage
          startExam={() => {
            setRoundIndex(0);
            startExam(EXAM_ROUNDS[0]);
          }}
          onKnowledge={() => setPhase('knowledge')}
          onPractice={() => setPhase('practice')}
          onHistory={() => setPhase('history')}
        />
      )}
      {phase === 'knowledge' && (
        <KnowledgePage onBack={() => setPhase('idle')} />
      )}
      {phase === 'practice' && (
        <PracticePage onBack={() => setPhase('idle')} />
      )}
      {phase === 'history' && (
        <HistoryPage onBack={() => setPhase('idle')} />
      )}
    </>
  );
}

export default App;
