export const QuestionType = {
  SINGLE_CHOICE: 'single',
  MULTI_CHOICE: 'multi',
  TRUE_FALSE: 'truefalse',
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

// 专项考试科目 —— 按能力递进
export const ExamSubject = {
  AI_CAPABILITY: 'ai_capability',
  AI_EFFICIENCY: 'ai_efficiency',
  AI_IMPLEMENT: 'ai_implement',
  PROMPT_MASTERY: 'prompt_mastery',
  DATA_COMPLIANCE: 'data_compliance',
} as const;
export type ExamSubject = (typeof ExamSubject)[keyof typeof ExamSubject];

export const Difficulty = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface Option {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  subject: ExamSubject;
  difficulty: Difficulty;
  title: string;
  options: Option[];
  answer: string[];
  explanation: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedKeys: string[];
  isCorrect: boolean;
}

export type Phase = 'idle' | 'active' | 'submitted' | 'finished' | 'learning' | 'knowledge' | 'practice' | 'history';

export interface ExamConfig {
  subject: ExamSubject;
  totalQuestions: number;
  timeLimit: number;
}

export interface DifficultyBreakdown {
  correct: number;
  total: number;
  label: string;
}

export interface ExamResult {
  subject: ExamSubject;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  answerRecords: AnswerRecord[];
  difficultyBreakdown: Record<number, DifficultyBreakdown>;
}

export interface RoundResult {
  subject: ExamSubject;
  result: ExamResult;
}

export interface SubjectInfo {
  label: string;
  shortLabel: string;
  icon: string;
  desc: string;
  questionCount: number;
  timeMinutes: number;
}

export const SUBJECT_INFO_MAP: Record<ExamSubject, SubjectInfo> = {
  [ExamSubject.AI_CAPABILITY]: {
    label: 'AI 能力认知',
    shortLabel: '能力认知',
    icon: '🧠',
    desc: '考察 AI 能做什么、不能做什么，主流模型的能力边界与应用场景判断',
    questionCount: 8,
    timeMinutes: 12,
  },
  [ExamSubject.AI_EFFICIENCY]: {
    label: 'AI 辅助提效',
    shortLabel: '辅助提效',
    icon: '⚡',
    desc: '考察如何用 AI 提升日常工作效率：PRD 撰写、竞品分析、用户反馈处理等',
    questionCount: 8,
    timeMinutes: 12,
  },
  [ExamSubject.AI_IMPLEMENT]: {
    label: 'AI 驱动落地',
    shortLabel: '驱动落地',
    icon: '🚀',
    desc: '考察 AI 如何将想法变为现实：从需求到原型、代码生成、快速验证',
    questionCount: 8,
    timeMinutes: 12,
  },
  [ExamSubject.PROMPT_MASTERY]: {
    label: 'Prompt 工程实战',
    shortLabel: 'Prompt',
    icon: '✍️',
    desc: '考察 Prompt 设计方法论、多工具适配技巧与团队模板沉淀',
    questionCount: 8,
    timeMinutes: 12,
  },
  [ExamSubject.DATA_COMPLIANCE]: {
    label: '数据驱动与合规',
    shortLabel: '数据合规',
    icon: '📊',
    desc: '考察 AI 辅助数据分析、A/B 测试、安全合规与 AI 伦理',
    questionCount: 8,
    timeMinutes: 12,
  },
};

// 考试轮次顺序
export interface HistoryEntry {
  id: string;
  timestamp: number;
  allResults: RoundResult[];
  totalScore: number;
  maxScore: number;
}

export const EXAM_ROUNDS: ExamSubject[] = [
  ExamSubject.AI_CAPABILITY,
  ExamSubject.AI_EFFICIENCY,
  ExamSubject.AI_IMPLEMENT,
  ExamSubject.PROMPT_MASTERY,
  ExamSubject.DATA_COMPLIANCE,
];

// ===== 旧版兼容 =====

export const Domain = {
  AI_BASICS: 'ai_basics',
  ECOMMERCE_AI: 'ecommerce_ai',
  PROMPT_ENGINEERING: 'prompt',
  DATA_ANALYSIS: 'data_analysis',
  AI_ETHICS: 'ai_ethics',
} as const;
export type Domain = (typeof Domain)[keyof typeof Domain];

export const DOMAIN_LABELS: Record<string, string> = {
  [Domain.AI_BASICS]: 'AI 基础概念',
  [Domain.ECOMMERCE_AI]: '电商 AI 应用',
  [Domain.PROMPT_ENGINEERING]: 'Prompt 工程',
  [Domain.DATA_ANALYSIS]: '数据分析',
  [Domain.AI_ETHICS]: 'AI 伦理与合规',
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  [Difficulty.BEGINNER]: '初级',
  [Difficulty.INTERMEDIATE]: '中级',
  [Difficulty.ADVANCED]: '高级',
};
