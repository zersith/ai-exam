import type { Question, ExamResult, RoundResult } from '../types';
import { SUBJECT_INFO_MAP } from '../types';
import { ScoreDashboard } from '../components/ScoreDashboard';
import { WrongQuestionReview } from '../components/WrongQuestionReview';
import styles from './ResultPage.module.css';

interface Props {
  result: ExamResult | null;
  questions: Question[];
  roundInfo: string;
  isLastRound: boolean;
  allResults: RoundResult[];
  onNextRound: () => void;
  onGoHome: () => void;
  isFinal?: boolean;
}

function FinalSummary({ allResults, onGoHome }: { allResults: RoundResult[]; onGoHome: () => void }) {
  const totalCorrect = allResults.reduce((s, r) => s + r.result.correctCount, 0);
  const totalMax = allResults.reduce((s, r) => s + r.result.maxScore, 0);
  const overallPct = totalMax > 0 ? Math.round((totalCorrect / totalMax) * 100) : 0;

  const getLevel = (pct: number) => {
    if (pct >= 90) return { label: '优秀', color: '#059669', desc: '你对 AI 产品经理核心能力有全面深入的理解' };
    if (pct >= 75) return { label: '良好', color: '#4f46e5', desc: '基础扎实，部分领域可继续深化' };
    if (pct >= 60) return { label: '合格', color: '#d97706', desc: '基本掌握，建议针对性强化薄弱环节' };
    return { label: '需提升', color: '#dc2626', desc: 'AI 知识和应用能力还需要系统性学习' };
  };

  const level = getLevel(overallPct);

  return (
    <div className="app-container">
      <div className={styles.finalHero}>
        <span className={styles.finalIcon}>🏆</span>
        <h1>考试完成</h1>
        <div className={styles.finalScore} style={{ color: level.color }}>
          {totalCorrect} / {totalMax} 分 ({overallPct}%)
        </div>
        <div className={styles.finalLevel} style={{ color: level.color }}>{level.label}</div>
        <p className={styles.finalDesc}>{level.desc}</p>
      </div>

      <div className={styles.roundResults}>
        <h3>各轮成绩</h3>
        {allResults.map((rr, i) => {
          const info = SUBJECT_INFO_MAP[rr.subject];
          const pct = Math.round(rr.result.accuracy * 100);
          return (
            <div key={rr.subject} className={styles.roundResultRow}>
              <span className={styles.roundIdx}>#{i + 1}</span>
              <span className={styles.roundLabel}>{info.icon} {info.label}</span>
              <div className={styles.roundBar}>
                <div className={styles.roundFill} style={{ width: `${pct}%`, background: pct >= 75 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626' }} />
              </div>
              <span className={styles.roundScore}>{rr.result.correctCount}/{rr.result.maxScore}</span>
            </div>
          );
        })}
      </div>

      <button className={styles.homeBtn} onClick={onGoHome}>返回首页</button>
    </div>
  );
}

export function ResultPage({ result, questions, roundInfo, isLastRound, allResults, onNextRound, onGoHome, isFinal }: Props) {
  if (isFinal) {
    return <FinalSummary allResults={allResults} onGoHome={onGoHome} />;
  }

  if (!result) return null;

  return (
    <div className="app-container">
      <div className={styles.roundTag}>{roundInfo}</div>
      <ScoreDashboard result={result} />

      {result.wrongCount > 0 && (
        <WrongQuestionReview
          questions={questions}
          answerRecords={result.answerRecords}
        />
      )}

      {result.wrongCount === 0 && (
        <div className={styles.perfectCard}>
          <span className={styles.perfectIcon}>🎉</span>
          <p>本轮全部答对！</p>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.nextBtn} onClick={onNextRound}>
          {isLastRound ? '查看总成绩' : '下一轮考试'}
        </button>
        <button className={styles.giveUpBtn} onClick={onGoHome}>返回首页</button>
      </div>
    </div>
  );
}
