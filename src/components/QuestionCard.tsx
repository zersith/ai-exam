import { DIFFICULTY_LABELS, SUBJECT_INFO_MAP, Difficulty, QuestionType } from '../types';
import type { Question } from '../types';
import styles from './QuestionCard.module.css';

interface Props {
  question: Question;
  selectedKeys: string[];
  onSelect: (keys: string[]) => void;
}

function diffClass(d: Difficulty) {
  if (d === Difficulty.BEGINNER) return styles.diffBeginner;
  if (d === Difficulty.INTERMEDIATE) return styles.diffIntermediate;
  return styles.diffAdvanced;
}

export function QuestionCard({ question, selectedKeys, onSelect }: Props) {
  const isMulti = question.type === QuestionType.MULTI_CHOICE;

  const handleClick = (key: string) => {
    if (isMulti) {
      onSelect(
        selectedKeys.includes(key)
          ? selectedKeys.filter(k => k !== key)
          : [...selectedKeys, key]
      );
    } else {
      onSelect([key]);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.domainTag}>{SUBJECT_INFO_MAP[question.subject]?.label}</span>
        <span className={`${styles.diffTag} ${diffClass(question.difficulty)}`}>
          {DIFFICULTY_LABELS[question.difficulty]}
        </span>
        <span className={styles.typeTag}>
          {question.type === QuestionType.SINGLE_CHOICE && '单选题'}
          {question.type === QuestionType.MULTI_CHOICE && '多选题'}
          {question.type === QuestionType.TRUE_FALSE && '判断题'}
        </span>
      </div>

      <h2 className={styles.title}>{question.title}</h2>

      <div className={styles.options}>
        {question.options.map(opt => {
          const selected = selectedKeys.includes(opt.key);
          return (
            <button
              key={opt.key}
              className={`${styles.option} ${selected ? styles.selected : ''}`}
              onClick={() => handleClick(opt.key)}
            >
              <span className={styles.key}>{opt.key}</span>
              <span className={styles.text}>{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
