import { api } from './client';

export interface SubjectStat {
  subject: string;
  totalCorrect: number;
  totalMax: number;
  averageAccuracy: number;
}

export interface PerformerStat {
  name: string;
  examCount: number;
  averageAccuracy: number;
}

export interface RecentExam {
  id: number;
  userName: string;
  totalScore: number;
  maxScore: number;
  accuracy: number;
  createdAt: string;
}

export interface PracticeStat {
  taskIndex: number;
  taskTitle: string;
  category: string;
  completionCount: number;
}

export interface ActivityItem {
  type: 'exam_completed' | 'practice_done';
  userName: string;
  description: string;
  createdAt: string;
}

export interface DashboardData {
  totalUsers: number;
  totalExams: number;
  totalPracticeCompletions: number;
  averageAccuracy: number;
  subjectBreakdown: SubjectStat[];
  topPerformers: PerformerStat[];
  recentExams: RecentExam[];
  practiceStats: PracticeStat[];
  recentActivities: ActivityItem[];
}

export async function fetchDashboardStats(): Promise<DashboardData> {
  return api.get<DashboardData>('/dashboard/stats');
}
