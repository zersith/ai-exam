import { useState, useCallback } from 'react';
import { shuffle } from '../utils/shuffle';
import styles from './PracticePage.module.css';

interface PracticeTask {
  title: string;
  desc: string;
  tool: string;
  difficulty: string;
  timeMinutes: number;
  category: string;
}

const taskPool: PracticeTask[] = [
  // PRD & 文档
  {
    title: '用 AI 写一份完整的 PRD',
    desc: '选择你近期要做的一个功能，向 AI 提供背景、目标用户、核心场景，要求按标准 PRD 结构输出。对比 AI 版本和你手写版本的差异，看看 AI 在哪些方面可以补充你的思考。',
    tool: 'Claude / DeepSeek', difficulty: '入门', timeMinutes: 20, category: 'PRD & 文档',
  },
  {
    title: '将历史优秀 PRD 转化为 AI 模板',
    desc: '找一份团队公认的优秀 PRD，上传到 Claude Projects，在自定义指令中说明"请以此文档的风格和结构作为模板"，然后在新的对话中测试效果。',
    tool: 'Claude Projects', difficulty: '进阶', timeMinutes: 30, category: 'PRD & 文档',
  },
  {
    title: '用 AI 将用户反馈转化为 User Story',
    desc: '收集 10 条真实的用户反馈，输入 AI，要求按"作为...我希望...以便..."格式转化为 User Story，并标注优先级。',
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 15, category: 'PRD & 文档',
  },
  // 竞品分析
  {
    title: '用 AI 做一次竞品功能对比',
    desc: '选择 3 个竞品，收集他们的功能列表和截图，提供给 AI，要求按你指定的维度（核心功能/差异化/定价/用户体验）生成对比分析报告。',
    tool: 'Claude / DeepSeek', difficulty: '入门', timeMinutes: 25, category: '竞品分析',
  },
  {
    title: '建立竞品监控 Prompt 模板',
    desc: '设计一个通用的竞品分析 Prompt 模板，包含固定的分析维度、输出格式和评估标准。用 2 个不同的竞品测试这个模板，迭代至满意后沉淀到团队知识库。',
    tool: '任意 AI 工具', difficulty: '进阶', timeMinutes: 30, category: '竞品分析',
  },
  // 数据分析
  {
    title: '用 AI 分析一份业务数据',
    desc: '准备一份脱敏后的业务数据（Excel），上传到 AI，逐步提问：先了解数据结构 → 要求描述基本统计特征 → 深入分析趋势 → 生成改进建议。记录每一步 Prompt 的效果。',
    tool: 'DeepSeek / Claude', difficulty: '入门', timeMinutes: 25, category: '数据分析',
  },
  {
    title: '用 AI 做 A/B 测试结果分析',
    desc: '找一份真实的 A/B 测试数据（或自己编一组），要求 AI 进行完整的统计分析：计算 p 值、置信区间、效应量，并判断结果是否可信。',
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 20, category: '数据分析',
  },
  {
    title: '用 AI 生成数据可视化方案',
    desc: '描述你的业务指标和数据维度，让 AI 建议最合适的可视化方案（图表类型、对比维度、Dashboard 布局），并生成一个包含示例数据的交互页面。',
    tool: 'Claude Artifacts', difficulty: '进阶', timeMinutes: 20, category: '数据分析',
  },
  // 原型 & 落地
  {
    title: '用 AI 生成一个功能原型',
    desc: '选一个你最近想做的功能，用自然语言向 AI 描述界面布局和交互，生成可交互的 HTML 原型。至少迭代 3 次，每次改进一个方面。',
    tool: 'Claude Artifacts / DeepSeek', difficulty: '入门', timeMinutes: 30, category: '原型 & 开发',
  },
  {
    title: '用 AI 生成数据看板 Demo',
    desc: '描述你需要监控的核心业务指标和布局，让 AI 生成一个包含图表的可交互 Dashboard 页面。可以直接用于向领导演示。',
    tool: 'Claude Artifacts', difficulty: '入门', timeMinutes: 25, category: '原型 & 开发',
  },
  {
    title: '用 AI 写一个浏览器小工具',
    desc: '想一个你日常工作中重复操作的事情（如格式化文本、提取链接），向 AI 描述需求，让它生成一个可用的浏览器插件或油猴脚本。',
    tool: 'Claude / ChatGPT', difficulty: '挑战', timeMinutes: 45, category: '原型 & 开发',
  },
  {
    title: '尝试用 Claude Code 修改项目代码',
    desc: '在终端安装 Claude Code，找一个简单的代码修改任务（如修改文案、调整样式），用自然语言描述需求，观察 AI 如何理解和修改代码。',
    tool: 'Claude Code', difficulty: '挑战', timeMinutes: 40, category: '原型 & 开发',
  },
  // Prompt 工程
  {
    title: '比较不同 Prompt 写法对输出的影响',
    desc: '同一个任务（如写商品文案），分别用 3 种不同质量的 Prompt 测试：模糊版、中等版、详细版。记录输出差异，总结什么信息对 AI 输出质量影响最大。',
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 20, category: 'Prompt 工程',
  },
  {
    title: '用 Few-shot 批量生成内容',
    desc: '设计一个批量任务（如生成 10 个商品标题/活动文案/用户回复模板），先用 3 个示例定义格式和风格，再一次性输入所有任务信息。对比一个一个做 vs 批量做的效率差异。',
    tool: '任意 AI 工具', difficulty: '进阶', timeMinutes: 25, category: 'Prompt 工程',
  },
  {
    title: '体验 DeepSeek 深度思考 vs 普通模式',
    desc: '同一个复杂分析任务（如需求优先级排序的逻辑推演），分别在开启和不开启深度思考的情况下执行，对比两者的推理质量和完整性。',
    tool: 'DeepSeek', difficulty: '进阶', timeMinutes: 20, category: 'Prompt 工程',
  },
  {
    title: '跨工具 Prompt 对比测试',
    desc: '同一条 Prompt 分别在 DeepSeek、Claude、Kimi 中执行，对比输出质量、风格和准确性的差异。总结各工具的适用场景。',
    tool: 'DeepSeek / Claude / Kimi', difficulty: '进阶', timeMinutes: 25, category: 'Prompt 工程',
  },
  // 会议 & 沟通
  {
    title: '用 AI 整理会议纪要',
    desc: '参加一次真实会议并录音 → 用转写工具转文字 → 将转写稿交给 AI → 要求按"决议/待办/风险/分歧"分类整理。对比手工整理的效果和效率。',
    tool: '任意 AI 工具 + 转写工具', difficulty: '入门', timeMinutes: 20, category: '会议 & 沟通',
  },
  {
    title: '用 AI 润色周报',
    desc: '把你本周的工作要点列出来（流水账即可），让 AI 将其整理为结构清晰、重点突出的周报，适配发送给不同受众（直属领导 vs 跨部门同步）。',
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 10, category: '会议 & 沟通',
  },
  {
    title: '用 AI 准备需求评审演示',
    desc: '将你的 PRD 或功能说明交给 AI，要求生成评审会用的演示大纲、关键讨论点和常见质疑的应答建议。实际用于一次评审会后记录效果。',
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 25, category: '会议 & 沟通',
  },
  // 学习 & 成长
  {
    title: '用 AI 快速了解一个新领域',
    desc: '选一个你不太熟悉但工作相关的领域（如推荐算法、供应链金融），让 AI 用"能听懂的人话"解释核心概念、关键指标和常见实践。',
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 15, category: '学习 & 成长',
  },
  {
    title: '用 AI 做知识体系梳理',
    desc: '把你当前负责的业务域的所有知识点告诉 AI，让它帮你梳理一个完整的知识体系框架，标注哪些你已掌握、哪些需要深入学习。',
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 30, category: '学习 & 成长',
  },
  {
    title: '让 AI 当你的面试官',
    desc: '设定 AI 为某公司的面试官，角色面试你关于产品经理 AI 能力的问题。要求 AI 在每个回答后给出反馈和改进建议。',
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 25, category: '学习 & 成长',
  },
  // 效率工具
  {
    title: '用 AI 批量处理 Excel 数据',
    desc: '找一份需要手工处理的 Excel 表格，描述处理规则，让 AI 生成一个可直接使用的处理方案（公式/Python 脚本/直接处理）。比较手工 vs AI 辅助的耗时。',
    tool: 'Claude / ChatGPT', difficulty: '进阶', timeMinutes: 25, category: '效率工具',
  },
  {
    title: '搭建你的 AI 工作流',
    desc: '梳理你一周内的所有工作内容，识别哪些环节可以用 AI 提效。为前 3 个最值得提效的环节设计 Prompt 模板，实际使用一周后评估效果。',
    tool: '任意 AI 工具', difficulty: '挑战', timeMinutes: 60, category: '效率工具',
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  '入门': '#059669',
  '进阶': '#4f46e5',
  '挑战': '#d97706',
};

export function PracticePage({ onBack }: { onBack: () => void }) {
  const [tasks, setTasks] = useState(() => shuffle([...taskPool]).slice(0, 5));
  const [doneMap, setDoneMap] = useState<Record<number, boolean>>({});

  const refresh = useCallback(() => {
    setTasks(shuffle([...taskPool]).slice(0, 5));
    setDoneMap({});
  }, []);

  const toggleDone = (idx: number) => {
    setDoneMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>AI 实践任务</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            随机推荐 5 个实践任务，完成一个勾一个，点击"换一批"刷新
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={refresh} className={styles.refreshBtn}>
            🔄 换一批
          </button>
          <button onClick={onBack} className={styles.backBtn}>
            返回首页
          </button>
        </div>
      </div>

      <div className={styles.taskList}>
        {tasks.map((task, i) => {
          const done = doneMap[i];
          return (
            <div key={`${task.title}-${i}`} className={`${styles.taskCard} ${done ? styles.taskDone : ''}`}>
              <div className={styles.taskHeader}>
                <button
                  className={`${styles.checkbox} ${done ? styles.checked : ''}`}
                  onClick={() => toggleDone(i)}
                >
                  {done ? '✓' : ''}
                </button>
                <div className={styles.taskInfo}>
                  <div className={styles.taskTitleRow}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    <span
                      className={styles.taskDifficulty}
                      style={{ color: DIFFICULTY_COLORS[task.difficulty] }}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                  <div className={styles.taskMeta}>
                    <span>🛠 {task.tool}</span>
                    <span>⏱ 约 {task.timeMinutes} 分钟</span>
                    <span>📂 {task.category}</span>
                  </div>
                </div>
              </div>
              <p className={styles.taskDesc}>{task.desc}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.stats}>
        共 {taskPool.length} 个实践任务 | 已完成 {Object.values(doneMap).filter(Boolean).length} / 5
      </div>
    </div>
  );
}
