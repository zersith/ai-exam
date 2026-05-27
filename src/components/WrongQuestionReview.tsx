import { SUBJECT_INFO_MAP, DIFFICULTY_LABELS } from '../types';
import type { Question, AnswerRecord } from '../types';
import styles from './WrongQuestionReview.module.css';

interface Props {
  questions: Question[];
  answerRecords: AnswerRecord[];
}

export function WrongQuestionReview({ questions, answerRecords }: Props) {
  const wrongRecords = answerRecords.filter(r => !r.isCorrect);
  const questionMap = new Map(questions.map(q => [q.id, q]));

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>错题回顾 ({wrongRecords.length} 题)</h2>
      {wrongRecords.map((record, idx) => {
        const q = questionMap.get(record.questionId);
        if (!q) return null;
        return (
          <div key={record.questionId} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.idx}>#{idx + 1}</span>
              <span className={styles.domainTag}>{SUBJECT_INFO_MAP[q.subject]?.label}</span>
              <span>{DIFFICULTY_LABELS[q.difficulty]}</span>
            </div>
            <p className={styles.questionText}>{q.title}</p>
            <div className={styles.answers}>
              <div className={styles.yourAnswer}>
                <span className={styles.answerLabel}>你的答案：</span>
                {record.selectedKeys.length === 0
                  ? <span className={styles.empty}>未作答</span>
                  : record.selectedKeys.map(k => {
                      const opt = q.options.find(o => o.key === k);
                      return <span key={k} className={styles.wrongKey}>{k}. {opt?.text}</span>;
                    })
                }
              </div>
              <div className={styles.correctAnswer}>
                <span className={styles.answerLabel}>正确答案：</span>
                {q.answer.map(k => {
                  const opt = q.options.find(o => o.key === k);
                  return <span key={k} className={styles.correctKey}>{k}. {opt?.text}</span>;
                })}
              </div>
            </div>
            <div className={styles.explanation}>
              <strong>解析：</strong>{q.explanation}
            </div>
          </div>
        );
      })}
    </div>
  );
}
