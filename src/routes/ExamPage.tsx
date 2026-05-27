import { useState } from 'react';
import type { Question, ExamConfig } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { ProgressSidebar } from '../components/ProgressSidebar';
import styles from './ExamPage.module.css';

interface Props {
  subjectLabel: string;
  roundInfo: string;
  questions: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  answers: Record<string, string[]>;
  remainingTime: number;
  config: ExamConfig;
  answeredCount: number;
  progress: number;
  answerQuestion: (questionId: string, keys: string[]) => void;
  goNext: () => void;
  goPrev: () => void;
  jumpTo: (index: number) => void;
  submitExam: () => void;
}

export function ExamPage({
  subjectLabel, roundInfo,
  questions, currentIndex, currentQuestion,
  answers, remainingTime, config, answeredCount, progress,
  answerQuestion, goNext, goPrev, jumpTo, submitExam,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!currentQuestion) {
    return (
      <div className="app-container">
        <p>加载中... (题目数: {questions.length}, 当前: {currentIndex})</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      setShowConfirm(true);
    } else {
      submitExam();
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <div className={styles.examLayout}>
        <main className={styles.main}>
          <div className={styles.headerBar}>
            <div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:2}}>
                {roundInfo} · {subjectLabel}
              </div>
              <span className={styles.questionNum}>
                第 <strong>{currentIndex + 1}</strong> / {questions.length} 题
              </span>
            </div>
            <div className={styles.rightActions}>
              {config.timeLimit !== null && (
                <span className={remainingTime < 300 ? styles.timerWarn : styles.timer}>
                  {formatTime(remainingTime)}
                </span>
              )}
              <button className={styles.submitBtn} onClick={handleSubmit}>交卷</button>
            </div>
          </div>

          <div className={styles.progressBarWrap}>
            <div className={styles.progressBar} style={{ width: `${progress * 100}%` }} />
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedKeys={answers[currentQuestion.id] || []}
            onSelect={(keys) => answerQuestion(currentQuestion.id, keys)}
          />

          <div className={styles.navButtons}>
            <button className={styles.navBtn} onClick={goPrev} disabled={currentIndex === 0}>
              上一题
            </button>
            {currentIndex < questions.length - 1 ? (
              <button className={styles.navBtn} onClick={goNext}>
                下一题
              </button>
            ) : (
              <button className={styles.submitNavBtn} onClick={handleSubmit}>
                交卷
              </button>
            )}
          </div>
        </main>

        <aside className={styles.sidebar}>
          <ProgressSidebar
            questions={questions}
            answered={answers}
            currentIndex={currentIndex}
            onJump={jumpTo}
          />
        </aside>
      </div>

      {showConfirm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>确认交卷</h3>
            <p>
              你还有 <strong>{questions.length - answeredCount}</strong> 道题未作答，确定要交卷吗？
            </p>
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)}>继续答题</button>
              <button className={styles.confirmBtn} onClick={submitExam}>确认交卷</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
