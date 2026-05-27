import { useState } from 'react';
import { SUBJECT_INFO_MAP } from '../types';
import type { HistoryEntry, RoundResult } from '../types';
import styles from './HistoryPage.module.css';

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem('ai-exam-history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      localStorage.removeItem('ai-exam-history');
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="app-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>考试记录</h1>
          <button onClick={onBack} className={styles.backBtn}>返回首页</button>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📋</span>
          <p>暂无考试记录</p>
          <p className={styles.emptyHint}>完成一次完整的 5 轮考试后，记录会自动保存</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>考试记录</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            共 {history.length} 次考试记录
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={clearHistory} className={styles.clearBtn}>清空记录</button>
          <button onClick={onBack} className={styles.backBtn}>返回首页</button>
        </div>
      </div>

      <div className={styles.list}>
        {history.map(entry => {
          const isOpen = expandedId === entry.id;
          const pct = entry.maxScore > 0 ? Math.round((entry.totalScore / entry.maxScore) * 100) : 0;
          return (
            <div key={entry.id} className={styles.entry}>
              <button
                className={styles.entryHeader}
                onClick={() => setExpandedId(isOpen ? null : entry.id)}
              >
                <div className={styles.entrySummary}>
                  <span className={styles.entryDate}>{formatDate(entry.timestamp)}</span>
                  <span className={styles.entryScore}>
                    {entry.totalScore}/{entry.maxScore} 分 ({pct}%)
                  </span>
                </div>
                <span className={styles.arrow}>{isOpen ? '▾' : '▸'}</span>
              </button>
              {isOpen && (
                <div className={styles.detail}>
                  {entry.allResults.map((rr: RoundResult, i: number) => {
                    const info = SUBJECT_INFO_MAP[rr.subject];
                    const rpct = Math.round(rr.result.accuracy * 100);
                    return (
                      <div key={rr.subject} className={styles.roundRow}>
                        <span className={styles.roundIdx}>#{i + 1}</span>
                        <span className={styles.roundLabel}>{info?.icon} {info?.label}</span>
                        <div className={styles.roundBar}>
                          <div
                            className={styles.roundFill}
                            style={{
                              width: `${rpct}%`,
                              background: rpct >= 75 ? '#059669' : rpct >= 60 ? '#d97706' : '#dc2626',
                            }}
                          />
                        </div>
                        <span className={styles.roundScore}>{rr.result.correctCount}/{rr.result.maxScore}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
