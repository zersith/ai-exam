import { Router } from 'express';
import { db } from './db.js';

const router = Router();

// POST /api/login
router.post('/login', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const trimmed = name.trim().slice(0, 50);
  let user = db.findUserByName(trimmed);
  if (!user) {
    user = db.createUser(trimmed);
  }
  res.json({ userId: user.id, name: user.name });
});

// POST /api/exam-results
router.post('/exam-results', (req, res) => {
  const { userId, totalScore, maxScore, allResults } = req.body;
  if (!userId || totalScore === undefined || maxScore === undefined || !allResults) {
    res.status(400).json({ error: 'userId, totalScore, maxScore, allResults are required' });
    return;
  }
  const id = db.insertExamResult(userId, totalScore, maxScore, allResults);
  res.json({ id });
});

// POST /api/practice
router.post('/practice', (req, res) => {
  const { userId, taskIndex, taskTitle, category, completed } = req.body;
  if (!userId || taskIndex === undefined || !taskTitle || !category || completed === undefined) {
    res.status(400).json({ error: 'userId, taskIndex, taskTitle, category, completed are required' });
    return;
  }
  const id = db.insertPractice(userId, taskIndex, taskTitle, category, completed);
  res.json({ id });
});

// POST /api/page-visit
router.post('/page-visit', (req, res) => {
  const { userId, pageName } = req.body;
  if (!userId || !pageName) {
    res.status(400).json({ error: 'userId, pageName are required' });
    return;
  }
  db.insertPageVisit(userId, pageName);
  res.json({ success: true });
});

// GET /api/dashboard/stats
router.get('/dashboard/stats', (_req, res) => {
  const totalUsers = db.getUserCount();
  const totalExams = db.getExamCount();
  const totalPractice = db.getPracticeCount();

  const allExams = db.getAllExamResults();

  let totalCorrect = 0;
  let totalMax = 0;
  const subjectMap: Record<string, { correct: number; total: number }> = {};

  for (const exam of allExams) {
    totalCorrect += exam.totalScore;
    totalMax += exam.maxScore;
    try {
      const rounds = exam.roundResults as { subject: string; result: { correctCount: number; maxScore: number } }[];
      for (const r of rounds) {
        if (!subjectMap[r.subject]) subjectMap[r.subject] = { correct: 0, total: 0 };
        subjectMap[r.subject].correct += r.result.correctCount;
        subjectMap[r.subject].total += r.result.maxScore;
      }
    } catch { /* skip */ }
  }

  const averageAccuracy = totalMax > 0 ? Math.round((totalCorrect / totalMax) * 100) : 0;

  const subjectBreakdown = Object.entries(subjectMap).map(([subject, s]) => ({
    subject,
    totalCorrect: s.correct,
    totalMax: s.total,
    averageAccuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }));

  const userStats = db.getUserExamStats();
  const topPerformers = userStats.slice(0, 10).map(u => ({
    name: u.name,
    examCount: u.examCount,
    averageAccuracy: u.sumMax > 0 ? Math.round((u.sumScore / u.sumMax) * 100) : 0,
  }));

  const recentExams = allExams.slice(0, 20).map(e => ({
    id: e.id,
    userName: e.userName,
    totalScore: e.totalScore,
    maxScore: e.maxScore,
    accuracy: e.maxScore > 0 ? Math.round((e.totalScore / e.maxScore) * 100) : 0,
    createdAt: e.createdAt,
  }));

  const practiceStats = db.getPracticeStats();

  // Recent activity feed
  const activities: { type: string; userName: string; description: string; createdAt: string }[] = [];

  for (const e of allExams.slice(0, 10)) {
    activities.push({
      type: 'exam_completed',
      userName: e.userName,
      description: `完成全部 5 轮考试 (${e.totalScore}/${e.maxScore} 分)`,
      createdAt: e.createdAt,
    });
  }

  for (const p of db.getRecentPractice(20)) {
    activities.push({
      type: 'practice_done',
      userName: p.userName,
      description: `完成了实践任务：${p.taskTitle}`,
      createdAt: p.createdAt,
    });
  }

  activities.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const recentActivities = activities.slice(0, 20);

  res.json({
    totalUsers,
    totalExams,
    totalPracticeCompletions: totalPractice,
    averageAccuracy,
    subjectBreakdown,
    topPerformers,
    recentExams,
    practiceStats,
    recentActivities,
  });
});

export default router;
