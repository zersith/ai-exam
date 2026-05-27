import { useState } from 'react';
import styles from './KnowledgePage.module.css';

interface KnowledgeSection {
  id: string;
  title: string;
  icon: string;
  items: KnowledgeItem[];
}

interface KnowledgeItem {
  term: string;
  content: string;
  tags?: string[];
}

const knowledgeBase: KnowledgeSection[] = [
  {
    id: 'capability',
    title: 'AI 能力认知',
    icon: '🧠',
    items: [
      {
        term: '大语言模型（LLM）',
        content: '基于海量文本数据训练的 AI 模型，核心能力是理解和生成自然语言。它通过预测下一个 token 来生成连贯文本，擅长文本分析、推理、摘要和创作，但不擅长精确数学计算。主流 LLM 包括 DeepSeek、Claude、ChatGPT、Kimi 等。',
        tags: ['基础概念', 'LLM'],
      },
      {
        term: 'Token（令牌）',
        content: 'AI 处理文本的最小计量单位，约 0.75 个中文字或 4 个英文字母。Token 影响：计费（按 token 数收费）、上下文窗口大小（一次能处理多少 token）、响应速度（token 越多生成越慢）。产品经理了解 Token 有助于估算 AI 功能成本。',
        tags: ['基础概念', '计费'],
      },
      {
        term: '上下文窗口（Context Window）',
        content: '模型一次能处理的最大文本量，以 token 为单位。Claude 支持 200K token（约 15 万中文字），DeepSeek 支持 128K。上下文越大，一次性可以给 AI 的背景信息越多。但长上下文也会增加成本和响应时间，产品设计时需权衡。',
        tags: ['基础概念', '技术参数'],
      },
      {
        term: '模型幻觉（Hallucination）',
        content: 'AI 生成看似合理但实际不准确或虚构的内容的现象。这是 LLM 的固有缺陷——模型本质是"预测下一个词"而非"查询事实数据库"。产品经理必须保持验证习惯，对关键事实和数据交叉确认。缓解方法：RAG（检索增强生成）、明确要求引用来源、联网搜索。',
        tags: ['风险', '关键概念'],
      },
      {
        term: '多模态 AI',
        content: '能同时理解和处理文本、图片、语音、视频等多种信息类型的 AI。例如可以上传商品图片+文字描述+用户评论，AI 综合所有信息给出分析。对电商 PM 意味着更丰富的信息输入和更全面的分析能力。',
        tags: ['进阶概念'],
      },
      {
        term: 'RAG（检索增强生成）',
        content: '在 AI 生成回答前，先从外部知识库检索相关信息，将检索结果作为上下文注入 Prompt，再让 AI 基于这些真实信息生成回答。RAG 能显著减少幻觉、提供可追溯的引用来源。适用于需要基于特定文档库回答问题的场景。',
        tags: ['进阶概念', '技术方案'],
      },
      {
        term: 'AI Agent（智能体）',
        content: '能自主规划多步任务、调用外部工具（API、数据库、浏览器）、执行闭环操作并验证结果的 AI 系统。与普通问答 AI 不同，Agent 不只是"回答问题"，而是"完成任务"。如：自动分析数据→生成报表→发送邮件通知。',
        tags: ['进阶概念', '前沿'],
      },
      {
        term: '微调（Fine-tuning）vs 提示工程（Prompt Engineering）',
        content: '微调是通过额外训练数据改变模型行为，需要标注数据和技术资源，效果好但门槛高。Prompt 工程是在不改变模型的前提下优化输入指令，产品经理可以直接操作。大多场景应先用 Prompt 工程验证，确实需要更高精度时才考虑微调。',
        tags: ['进阶概念', '实操对比'],
      },
      {
        term: '开源模型 vs 闭源模型',
        content: '开源模型（如 DeepSeek）可私有化部署，数据安全性更高，可定制性强。闭源模型（如 Claude、ChatGPT）通常 API 更稳定、生态更完善、开箱即用。选型需综合考量安全需求、成本、效果和集成难度，没有绝对优劣。',
        tags: ['选型', '对比'],
      },
      {
        term: 'Vibe Coding（氛围编程）',
        content: '用自然语言描述想要的功能，AI 生成代码并实时预览效果，通过不断对话迭代优化的编程方式。对 PM 的价值：不需要编码技能就能快速创建可交互的产品原型来验证想法。代表工具：Claude Artifacts、Cursor、Bolt。',
        tags: ['前沿', '实操'],
      },
    ],
  },
  {
    id: 'efficiency',
    title: 'AI 辅助提效',
    icon: '⚡',
    items: [
      {
        term: 'AI 辅助 PRD 撰写',
        content: '核心流程：提供业务背景、目标用户、核心场景 → 上传历史优秀 PRD 作为风格参考 → 指定文档结构和详细程度 → AI 生成初稿 → 人工精修逻辑和表达。关键：输入质量决定输出质量，模糊的输入只能得到泛化的输出。进阶技巧：在 Claude Projects 中上传公司 PRD 模板作为固定参考。',
        tags: ['文档', 'PRD'],
      },
      {
        term: 'AI 辅助竞品分析',
        content: '标准流程：明确分析维度（功能/定价/UX/市场策略）→ 收集竞品素材（截图、官网、用户评价）→ 上传 AI 要求按维度对比 → 指定输出格式（对比表格）→ 人工审核和补充洞察。建议建立标准化的分析 Prompt 模板，每次只需替换竞品名称和新素材即可复用。',
        tags: ['分析', '模板'],
      },
      {
        term: 'AI 处理用户反馈',
        content: '流程：脱敏用户数据 → 上传反馈文本 → 要求 AI 按主题聚类、情感分类、提炼高频问题 Top 10 → 输出结构化分析报告。注意：必须先去除 PII（手机号、姓名等），不可将原始用户数据上传到外部 AI 工具。',
        tags: ['分析', '安全'],
      },
      {
        term: 'AI 辅助会议纪要',
        content: '先用转写工具（飞书妙记、通义听悟）将录音转文字，再将文字稿给 AI，要求按"决议/待办/风险/分歧"分类提炼。每次会议使用相同的 Prompt 模板，确保纪要格式统一、团队成员能快速定位关键信息。',
        tags: ['会议', '模板'],
      },
      {
        term: 'AI 辅助用户故事编写',
        content: '提供 Epic 描述和目标用户画像 → 要求 AI 按"作为...我希望...以便..."格式拆分 → 标注每个 Story 的优先级（P0/P1/P2）和验收标准 → 人工审核调整。AI 帮你快速完成从 Epic 到 Story 的拆解，PM 聚焦于业务逻辑验证。',
        tags: ['文档', '敏捷'],
      },
      {
        term: '建立 AI 工作流 SOP',
        content: '识别团队高频重复工作 → 为每个场景编写标准 Prompt → 沉淀到团队知识库 → 定期评审更新。例如：竞品监控 SOP = 每月收集素材 + 统一 Prompt 模板 + AI 生成初稿 + 人工审核。标准化是规模化提效的前提。',
        tags: ['团队', '流程'],
      },
    ],
  },
  {
    id: 'implement',
    title: 'AI 驱动落地',
    icon: '🚀',
    items: [
      {
        term: 'AI 生成交互原型',
        content: '使用 Claude Artifacts 或类似工具：用自然语言描述页面布局、组件和交互 → AI 生成可交互 HTML/CSS/JS → 实时预览 → 对话迭代修改。PM 可以在几分钟内将想法变成可点击的原型用于用户测试或向领导演示。',
        tags: ['原型', '实操'],
      },
      {
        term: 'Claude Code（AI 编程助手）',
        content: 'Anthropic 推出的终端 AI 编程工具，可直接理解整个代码仓库上下文并进行代码编写、修改和调试。PM 可以用自然语言让 Claude Code 修改代码、修复简单 bug、或理解某个功能的实现逻辑，无需等开发排期。',
        tags: ['工具', '编程'],
      },
      {
        term: '从 PRD 到可运行代码',
        content: '当前 AI 可以：PRD → 生成前端页面代码 → 生成简单后端 API → 生成测试用例。但 AI 生成的代码需要通过人工 Code Review、安全检查和测试才能上线。PM 的价值在于：把模糊的业务需求翻译成精确的功能描述，AI 负责执行。',
        tags: ['流程', '代码'],
      },
      {
        term: 'AI 生成测试用例',
        content: '将 PRD 或功能描述提供给 AI → 要求按"正常流程/异常流程/边界条件"三类生成测试用例 → 指定输出格式（Given-When-Then） → 人工补充业务特有场景。AI 能覆盖大部分常规测试场景，PM 和 QA 聚焦于业务逻辑的深度验证。',
        tags: ['测试', '质量'],
      },
      {
        term: 'AI 原型迭代的最佳实践',
        content: '每次只改一个方面（布局/颜色/交互/数据），观察 AI 的响应，确认无误后再改下一个。给出具体、可操作的反馈（不是"不好看"，而是"按钮颜色改为 #FF6600，字号改为 16px"）。善用对话的连续性，不要每次从头开始。',
        tags: ['原型', '实操'],
      },
    ],
  },
  {
    id: 'prompt',
    title: 'Prompt 工程',
    icon: '✍️',
    items: [
      {
        term: 'Prompt 三要素',
        content: '优质 Prompt = 角色设定（"你是XX专家"）+ 任务上下文（背景、目标、约束）+ 输出格式（表格/JSON/列表/字数）。三者缺一不可。角色限制 AI 的视角和知识范围，上下文确保 AI 理解场景，格式让输出直接可用。',
        tags: ['基础', '框架'],
      },
      {
        term: '思维链（Chain-of-Thought）',
        content: '在 Prompt 中要求 AI "一步步思考"或"展示推理过程"，触发模型的推理能力。适用于复杂逻辑分析、多方案对比、ROI 计算等场景。在 DeepSeek 中对应"深度思考"模式，在 Claude 中需在 Prompt 中明确要求。注意：简单任务使用 CoT 反而浪费时间和 Token。',
        tags: ['进阶', '技巧'],
      },
      {
        term: 'Few-shot Prompting',
        content: '在 Prompt 中提供 2-5 个输入-输出示例，让 AI 学习格式和风格后完成新任务。PM 实用场景：批量生成 50 个商品标题（先用 3 个示例定义格式）、用户反馈分类（先用示例定义各类别的判定标准）、标签标准化。',
        tags: ['进阶', '批量'],
      },
      {
        term: '不同工具的 Prompt 适配差异',
        content: 'Claude 对结构化 XML 标签响应好，适合复杂指令。DeepSeek 深度思考模式需配合推理型 Prompt。Kimi 对中文长文本理解强，适合文档分析类 Prompt。同一条 Prompt 在不同工具上效果不同，迁移时需要在新工具上重新测试和微调。',
        tags: ['工具', '适配'],
      },
      {
        term: 'Prompt 迭代与评估',
        content: '建立评估标准：准确性（事实正确）、稳定性（多次运行结果一致）、可用性（输出格式直接可用）、成本（Token 消耗合理）。对同一任务用不同 Prompt 做 A/B 对比。将验证有效的 Prompt 沉淀为团队模板，标注适用工具和效果说明。',
        tags: ['评估', '团队'],
      },
      {
        term: 'System Prompt 设计',
        content: 'System Prompt 定义 AI 在整个对话中的角色、行为边界和回答风格，是 AI 产品的"灵魂"。好的 System Prompt 包含：角色定位、知识范围、回答风格、禁止行为、澄清机制（遇到模糊输入时主动询问）。',
        tags: ['进阶', '产品设计'],
      },
    ],
  },
  {
    id: 'data',
    title: '数据驱动与合规',
    icon: '📊',
    items: [
      {
        term: 'GMV 核心公式',
        content: 'GMV = 访客数（UV）× 转化率（CVR）× 客单价（ASP）。这是电商最基础的增长公式。用 AI 分析时，可以要求它对每个因子做下钻归因：UV 下降是哪个渠道出了问题？CVR 下降是哪个环节流失了？ASP 变化是品类结构变了还是折扣力度变了？',
        tags: ['数据', '电商'],
      },
      {
        term: 'A/B 测试分析要素',
        content: '用 AI 分析 A/B 测试需提供：实验组/对照组样本量、核心指标定义、观测周期（排除周末/大促效应）、置信水平（通常 95%）。要求 AI 输出完整的统计分析（p 值、置信区间、效应量），而非仅给"B 组赢了"的结论。相关 ≠ 因果，统计显著 ≠ 业务显著。',
        tags: ['数据', '实验'],
      },
      {
        term: '数据安全红线',
        content: '绝不上传到外部 AI 工具的数据类型：用户 PII（手机号、身份证、地址）、公司商业机密（未公开财务数据、战略规划）、用户隐私内容（聊天记录、订单详情）。处理敏感数据应：使用合规的国内工具 + 脱敏处理 + 遵循公司 AI 使用安全策略。',
        tags: ['安全', '合规'],
      },
      {
        term: '《个人信息保护法》要点',
        content: '收集个人信息需取得"知情同意"、用户有权撤回同意和删除数据（被遗忘权）、数据出境有严格限制。AI 产品中涉及用户数据的场景（训练、分析、推荐）都需要遵循这些原则。PM 是产品合规的第一责任人。',
        tags: ['法规', '合规'],
      },
      {
        term: '信息茧房与推荐多样性',
        content: '信息茧房：推荐算法不断推送用户已有偏好的内容，导致用户视野缩窄。解法：在推荐策略中设计"探索-利用"平衡——按比例插入新品类推荐、提供用户可控的探索开关、定期评估推荐结果的多样性指标。',
        tags: ['伦理', '推荐'],
      },
      {
        term: 'AIGC 内容合规',
        content: 'AI 生成内容在电商中使用需关注：真实性（避免虚假宣传）→ 上线前人工审核；版权（AIGC 版权归属尚存争议）→ 人工实质性修改后使用；标注（部分平台要求标注 AI 辅助）→ 遵守平台规则；有害内容过滤 → 建立内容安全围栏。',
        tags: ['合规', '内容'],
      },
    ],
  },
];

export function KnowledgePage({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState(knowledgeBase[0].id);

  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>AI 知识点汇总</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            系统化知识体系，非题目形式，按需查阅学习
          </p>
        </div>
        <button
          onClick={onBack}
          className={styles.backBtn}
        >
          返回首页
        </button>
      </div>

      <div className={styles.layout}>
        <nav className={styles.nav}>
          {knowledgeBase.map(section => (
            <button
              key={section.id}
              className={`${styles.navItem} ${activeSection === section.id ? styles.navActive : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </nav>

        <main className={styles.content}>
          {knowledgeBase.filter(s => s.id === activeSection).map(section => (
            <div key={section.id}>
              <h2 className={styles.sectionTitle}>
                {section.icon} {section.title}
              </h2>
              <div className={styles.items}>
                {section.items.map(item => (
                  <div key={item.term} className={styles.item}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.term}>{item.term}</h3>
                      {item.tags && (
                        <div className={styles.tags}>
                          {item.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={styles.desc}>{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
