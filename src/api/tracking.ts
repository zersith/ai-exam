import { api } from './client';
import type { RoundResult } from '../types';

export function trackExamResult(userId: number, allResults: RoundResult[], totalScore: number, maxScore: number) {
  api.post('/exam-results', { userId, totalScore, maxScore, allResults }).catch(() => {});
}

export function trackPractice(userId: number, taskIndex: number, taskTitle: string, category: string, completed: boolean) {
  api.post('/practice', { userId, taskIndex, taskTitle, category, completed }).catch(() => {});
}

export function trackPageVisit(userId: number, pageName: string) {
  api.post('/page-visit', { userId, pageName }).catch(() => {});
}
