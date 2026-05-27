import { useState } from 'react';
import { questionBank } from '../data/questions';
import { SUBJECT_INFO_MAP } from '../types';
import type { ExamSubject } from '../types';
import styles from './LearningPage.module.css';

interface Props {
  onBack: () => void;
}

export function LearningPage({ onBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const beginnerQuestions = questionBank.filter(q => q.difficulty === 1);

  // Group by subject
  const bySubject = new Map<ExamSubject, typeof beginnerQuestions>();
  for (const q of beginnerQuestions) {
    const list = bySubject.get(q.subject) || [];
    list.push(q);
    bySubject.set(q.subject, list);
  }

  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>知识点学习</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            共 {beginnerQuestions.length} 个基础知识点，点击展开查看详情
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text)', padding: '8px 16px', borderRadius: 8,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          返回首页
        </button>
      </div>

      {Array.from(bySubject.entries()).map(([subject, questions]) => {
        const info = SUBJECT_INFO_MAP[subject];
        return (
          <div key={subject} className={styles.group}>
            <h2 className={styles.groupTitle}>
              {info?.icon} {info?.label}
              <span className={styles.groupCount}>{questions.length} 个知识点</span>
            </h2>
            {questions.map(q => {
              const isOpen = expandedId === q.id;
              return (
                <div key={q.id} className={styles.item}>
                  <button
                    className={styles.itemHeader}
                    onClick={() => setExpandedId(isOpen ? null : q.id)}
                  >
                    <span className={styles.itemTitle}>{q.title}</span>
                    <span className={styles.arrow}>{isOpen ? '▾' : '▸'}</span>
                  </button>
                  {isOpen && (
                    <div className={styles.itemBody}>
                      <div className={styles.options}>
                        {q.options.map(opt => {
                          const isCorrect = q.answer.includes(opt.key);
                          return (
                            <div
                              key={opt.key}
                              className={`${styles.option} ${isCorrect ? styles.correct : ''}`}
                            >
                              <span className={styles.key}>{opt.key}</span>
                              <span>{opt.text}</span>
                              {isCorrect && <span className={styles.check}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div className={styles.explanation}>
                        <strong>解析：</strong>{q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
