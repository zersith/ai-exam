import { SUBJECT_INFO_MAP } from '../types';
import type { ExamResult } from '../types';
import styles from './ScoreDashboard.module.css';

interface Props {
  result: ExamResult;
}

function getLevel(accuracy: number): { label: string; color: string; desc: string } {
  if (accuracy >= 0.9) return { label: '优秀', color: '#059669', desc: '对这一领域有深入的理解和掌握' };
  if (accuracy >= 0.75) return { label: '良好', color: '#4f46e5', desc: '知识体系较完整，部分细节可加深' };
  if (accuracy >= 0.6) return { label: '合格', color: '#d97706', desc: '基础过关，建议针对性加强弱项' };
  return { label: '需提升', color: '#dc2626', desc: '这一领域的知识还需要系统学习' };
}

export function ScoreDashboard({ result }: Props) {
  const pct = Math.round(result.accuracy * 100);
  const level = getLevel(result.accuracy);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (result.accuracy * circumference);
  const info = SUBJECT_INFO_MAP[result.subject];

  return (
    <div className={styles.dashboard}>
      <div className={styles.subjectHeader}>
        <span>{info?.icon} {info?.label}</span>
      </div>
      <div className={styles.scoreTop}>
        <div className={styles.ringWrap}>
          <svg viewBox="0 0 120 120" className={styles.ring}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={level.color} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className={styles.ringArc}
            />
          </svg>
          <div className={styles.ringCenter}>
            <span className={styles.ringPct}>{pct}</span>
            <span className={styles.ringLabel}>分</span>
          </div>
        </div>
        <div className={styles.scoreInfo}>
          <h2 className={styles.level} style={{ color: level.color }}>{level.label}</h2>
          <p className={styles.levelDesc}>{level.desc}</p>
          <div className={styles.stats}>
            <span>正确 <strong>{result.correctCount}</strong> 题</span>
            <span>错误 <strong>{result.wrongCount}</strong> 题</span>
            <span>共 <strong>{result.maxScore}</strong> 题</span>
          </div>
        </div>
      </div>

      <div className={styles.domainSection}>
        <h3>按难度表现</h3>
        {[1, 2, 3].map(d => {
          const data = result.difficultyBreakdown[d];
          if (!data || data.total === 0) return null;
          const dpct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
          return (
            <div key={d} className={styles.domainRow}>
              <span className={styles.domainName}>{data.label}</span>
              <div className={styles.domainBar}>
                <div className={styles.domainFill} style={{ width: `${dpct}%` }} />
              </div>
              <span className={styles.domainScore}>{data.correct}/{data.total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
