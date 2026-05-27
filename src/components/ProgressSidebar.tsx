import type { Question } from '../types';
import styles from './ProgressSidebar.module.css';

interface Props {
  questions: Question[];
  answered: Record<string, string[]>;
  currentIndex: number;
  onJump: (index: number) => void;
}

export function ProgressSidebar({ questions, answered, currentIndex, onJump }: Props) {
  return (
    <div className={styles.sidebar}>
      <h3 className={styles.heading}>答题卡</h3>
      <div className={styles.grid}>
        {questions.map((q, i) => {
          const selected = answered[q.id];
          const hasAnswer = selected && selected.length > 0;
          let cls = styles.dot;
          if (hasAnswer) cls += ` ${styles.answered}`;
          if (i === currentIndex) cls += ` ${styles.current}`;
          return (
            <button key={q.id} className={cls} onClick={() => onJump(i)}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className={styles.legend}>
        <span><span className={`${styles.legendDot} ${styles.answered}`} /> 已答</span>
        <span><span className={styles.legendDot} /> 未答</span>
        <span><span className={`${styles.legendDot} ${styles.current}`} /> 当前</span>
      </div>
    </div>
  );
}
