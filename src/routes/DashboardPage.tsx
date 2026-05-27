import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../api/dashboard';
import type { DashboardData } from '../api/dashboard';
import { SUBJECT_INFO_MAP, ExamSubject } from '../types';
import styles from './DashboardPage.module.css';

const SUBJECT_LIST = Object.values(ExamSubject);

const SUBJECT_COLORS: Record<string, string> = {
  [ExamSubject.AI_CAPABILITY]: '#7c3aed',
  [ExamSubject.AI_EFFICIENCY]: '#059669',
  [ExamSubject.AI_IMPLEMENT]: '#4f46e5',
  [ExamSubject.PROMPT_MASTERY]: '#d97706',
  [ExamSubject.DATA_COMPLIANCE]: '#dc2626',
};

function formatTime(ts: string) {
  try {
    const d = new Date(ts + 'Z');
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return ts;
  }
}

function getRankClass(i: number) {
  if (i === 0) return styles.rankGold;
  if (i === 1) return styles.rankSilver;
  if (i === 2) return styles.rankBronze;
  return '';
}

export function DashboardPage({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchDashboardStats()
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message || '无法加载数据'); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className={styles.loading}>加载中...</div>;
  if (error) return <div className={styles.errorBox}>加载失败：{error}<br /><button onClick={onBack}>返回</button></div>;
  if (!data) return null;

  return (
    <div className="app-container">
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>数据看板</h1>
          <p className={styles.headerSub}>使用统计概览</p>
        </div>
        <button onClick={onBack} className={styles.backBtn}>返回首页</button>
      </div>

      {/* Stats Cards */}
      <div className={styles.cardGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statValue}>{data.totalUsers}</div>
          <div className={styles.statLabel}>使用人数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statValue}>{data.totalExams}</div>
          <div className={styles.statLabel}>完成考试次数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{data.totalPracticeCompletions}</div>
          <div className={styles.statLabel}>实践任务完成数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statValue}>{data.averageAccuracy}%</div>
          <div className={styles.statLabel}>整体平均正确率</div>
        </div>
      </div>

      {/* Two-column: Subject breakdown + Top performers */}
      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>各科目表现</h2>
          {data.subjectBreakdown.length === 0 ? (
            <div className={styles.emptyState}>暂无考试数据</div>
          ) : (
            SUBJECT_LIST.map(subject => {
              const stat = data.subjectBreakdown.find(s => s.subject === subject);
              const acc = stat?.averageAccuracy ?? 0;
              const color = SUBJECT_COLORS[subject] || '#6b7280';
              const info = SUBJECT_INFO_MAP[subject];
              return (
                <div key={subject} className={styles.subjectBar}>
                  <span className={styles.subjectLabel}>{info?.shortLabel || subject}</span>
                  <div className={styles.subjectTrack}>
                    <div className={styles.subjectFill} style={{ width: `${Math.max(acc, 5)}%`, background: color }}>
                      {acc > 0 ? `${acc}%` : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>成绩排行 Top 10</h2>
          {data.topPerformers.length === 0 ? (
            <div className={styles.emptyState}>暂无考试数据</div>
          ) : (
            <table className={styles.performerTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>姓名</th>
                  <th>考试次数</th>
                  <th>平均正确率</th>
                </tr>
              </thead>
              <tbody>
                {data.topPerformers.map((p, i) => (
                  <tr key={p.name}>
                    <td><span className={`${styles.rankBadge} ${getRankClass(i)}`}>{i + 1}</span></td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.examCount}</td>
                    <td style={{ color: p.averageAccuracy >= 75 ? '#059669' : p.averageAccuracy >= 60 ? '#d97706' : '#dc2626', fontWeight: 600 }}>
                      {p.averageAccuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent exams */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>最近考试</h2>
        {data.recentExams.length === 0 ? (
          <div className={styles.emptyState}>暂无考试记录</div>
        ) : (
          <table className={styles.examTable}>
            <thead>
              <tr>
                <th>姓名</th>
                <th>得分</th>
                <th>正确率</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {data.recentExams.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.userName}</strong></td>
                  <td>{e.totalScore} / {e.maxScore}</td>
                  <td>
                    <span className={styles.scoreBar} style={{ width: `${e.accuracy}px` }} />
                    {e.accuracy}%
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{formatTime(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Practice popularity */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>实践任务热度</h2>
        {data.practiceStats.length === 0 ? (
          <div className={styles.emptyState}>暂无实践数据</div>
        ) : (
          data.practiceStats.slice(0, 10).map((p, i) => (
            <div key={p.taskIndex} className={styles.subjectBar}>
              <span className={styles.subjectLabel} style={{ width: 'auto', textAlign: 'left' }}>
                {i + 1}. {p.taskTitle}
              </span>
              <div className={styles.subjectTrack}>
                <div className={styles.subjectFill} style={{ width: `${Math.max(p.completionCount * 10, 8)}%`, background: '#059669' }}>
                  {p.completionCount} 人
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent activity */}
      {data.recentActivities.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>最近动态</h2>
          {data.recentActivities.map((a, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={`${styles.activityDot} ${a.type === 'exam_completed' ? styles.activityDotExam : styles.activityDotPractice}`} />
              <span className={styles.activityDesc}>
                <strong>{a.userName}</strong> {a.description}
              </span>
              <span className={styles.activityTime}>{formatTime(a.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
