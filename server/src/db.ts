import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data.json');

interface User { id: number; name: string; createdAt: string; }
interface ExamResult { id: number; userId: number; totalScore: number; maxScore: number; roundResults: unknown; createdAt: string; }
interface PracticeCompletion { id: number; userId: number; taskIndex: number; taskTitle: string; category: string; completed: number; createdAt: string; }
interface PageVisit { id: number; userId: number; pageName: string; visitedAt: string; }

interface Store {
  users: User[];
  examResults: ExamResult[];
  practiceCompletions: PracticeCompletion[];
  pageVisits: PageVisit[];
  nextId: number;
}

function load(): Store {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], examResults: [], practiceCompletions: [], pageVisits: [], nextId: 1 };
  }
}

function save(store: Store) {
  fs.writeFileSync(DB_PATH, JSON.stringify(store), 'utf-8');
}

let store = load();

function nextId(): number {
  return store.nextId++;
}

// Auto-save after each mutation
function mutate(fn: () => void) {
  fn();
  save(store);
}

export const db = {
  // Users
  findUserByName(name: string): User | undefined {
    return store.users.find(u => u.name === name);
  },
  createUser(name: string): User {
    const user: User = { id: nextId(), name, createdAt: new Date().toISOString() };
    mutate(() => store.users.push(user));
    return user;
  },

  // Exam results
  insertExamResult(userId: number, totalScore: number, maxScore: number, roundResults: unknown): number {
    const id = nextId();
    mutate(() => store.examResults.push({ id, userId, totalScore, maxScore, roundResults, createdAt: new Date().toISOString() }));
    return id;
  },
  getAllExamResults(): (ExamResult & { userName: string })[] {
    return store.examResults
      .map(e => ({ ...e, userName: store.users.find(u => u.id === e.userId)?.name || '未知' }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // Practice completions
  insertPractice(userId: number, taskIndex: number, taskTitle: string, category: string, completed: boolean): number {
    const id = nextId();
    mutate(() => store.practiceCompletions.push({ id, userId, taskIndex, taskTitle, category, completed: completed ? 1 : 0, createdAt: new Date().toISOString() }));
    return id;
  },
  getPracticeStats(): { taskIndex: number; taskTitle: string; category: string; completionCount: number }[] {
    const map = new Map<number, { taskTitle: string; category: string; users: Set<number> }>();
    for (const p of store.practiceCompletions) {
      if (!p.completed) continue;
      if (!map.has(p.taskIndex)) map.set(p.taskIndex, { taskTitle: p.taskTitle, category: p.category, users: new Set() });
      map.get(p.taskIndex)!.users.add(p.userId);
    }
    return [...map.entries()]
      .map(([idx, v]) => ({ taskIndex: idx, taskTitle: v.taskTitle, category: v.category, completionCount: v.users.size }))
      .sort((a, b) => b.completionCount - a.completionCount);
  },
  getRecentPractice(limit: number): (PracticeCompletion & { userName: string })[] {
    return store.practiceCompletions
      .filter(p => p.completed)
      .map(p => ({ ...p, userName: store.users.find(u => u.id === p.userId)?.name || '未知' }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },

  // Page visits
  insertPageVisit(userId: number, pageName: string) {
    mutate(() => store.pageVisits.push({ id: nextId(), userId, pageName, visitedAt: new Date().toISOString() }));
  },

  // Stats
  getUserCount(): number { return store.users.length; },
  getExamCount(): number { return store.examResults.length; },
  getPracticeCount(): number { return store.practiceCompletions.filter(p => p.completed).length; },

  // Per-user exam stats
  getUserExamStats(): { name: string; examCount: number; sumScore: number; sumMax: number }[] {
    const map = new Map<number, { count: number; sumScore: number; sumMax: number }>();
    for (const e of store.examResults) {
      if (!map.has(e.userId)) map.set(e.userId, { count: 0, sumScore: 0, sumMax: 0 });
      const v = map.get(e.userId)!;
      v.count++;
      v.sumScore += e.totalScore;
      v.sumMax += e.maxScore;
    }
    return [...map.entries()]
      .map(([uid, v]) => {
        const u = store.users.find(u => u.id === uid);
        return { name: u?.name || '未知', examCount: v.count, sumScore: v.sumScore, sumMax: v.sumMax };
      })
      .sort((a, b) => (b.sumMax > 0 ? b.sumScore / b.sumMax : 0) - (a.sumMax > 0 ? a.sumScore / a.sumMax : 0));
  },
};
