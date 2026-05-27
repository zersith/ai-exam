import { useState } from 'react';
import styles from './PracticePage.module.css';

interface PracticeTask {
  title: string;
  desc: string;
  guide: string;
  tool: string;
  difficulty: string;
  timeMinutes: number;
  category: string;
}

const taskPool: PracticeTask[] = [
  // PRD & 文档
  {
    title: '用 AI 写一份完整的 PRD',
    desc: '选择你近期要做的一个功能，向 AI 提供背景、目标用户、核心场景，要求按标准 PRD 结构输出。对比 AI 版本和你手写版本的差异。',
    guide: `1. 选一个真实功能（如"购物车改版"）
2. 打开 Claude/DeepSeek，输入：角色设为资深电商PM
3. 提供：业务背景（2-3句）、目标用户画像、3个核心使用场景、期望的PRD结构
4. 收到初稿后，检查：逻辑完整性、边界情况覆盖、可衡量指标
5. 将AI版与你手写版做逐段对比，标注AI补充了哪些你没想到的点`,
    tool: 'Claude / DeepSeek', difficulty: '入门', timeMinutes: 20, category: 'PRD & 文档',
  },
  {
    title: '将历史优秀 PRD 转化为 AI 模板',
    desc: '找一份团队公认的优秀 PRD，上传到 Claude Projects，在自定义指令中说明以此文档的风格和结构作为模板，然后在新的对话中测试效果。',
    guide: `1. 找一份团队公认写得很好的PRD（脱敏处理）
2. 打开 Claude，创建新 Project，命名为"PRD模板"
3. 在"自定义指令"中写：请以我上传的PRD文档作为模板，后续所有PRD都按此结构和风格输出
4. 上传PRD文件到Project知识库
5. 在新对话中测试：输入一个新功能需求，检查输出是否复现了模板的结构和风格
6. 根据测试结果微调自定义指令`,
    tool: 'Claude Projects', difficulty: '进阶', timeMinutes: 30, category: 'PRD & 文档',
  },
  {
    title: '用 AI 将用户反馈转化为 User Story',
    desc: '收集 10 条真实的用户反馈，输入 AI，要求按标准 User Story 格式转化，并标注优先级。',
    guide: `1. 从客服系统/用户群/应用商店评论中收集10条真实反馈
2. 在AI中输入：将以下用户反馈转化为标准User Story格式（作为...我希望...以便...）
3. 要求AI为每个Story标注优先级（P0/P1/P2）和判断依据
4. 检查转化结果：用户原始意图是否被正确理解？优先级判断是否合理？
5. 挑出3个AI转化最好的Story，直接纳入下次迭代计划`,
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 15, category: 'PRD & 文档',
  },
  // 竞品分析
  {
    title: '用 AI 做一次竞品功能对比',
    desc: '选择 3 个竞品，收集他们的功能列表和截图，提供给 AI，要求按你指定的维度（核心功能/差异化/定价/用户体验）生成对比分析报告。',
    guide: `1. 选定3个竞品（建议1个行业龙头+1个直接竞品+1个新锐）
2. 整理材料：每个竞品的核心功能清单、定价页面截图、App Store近30天评论摘要
3. 在AI中设定分析维度：核心功能矩阵、差异化亮点、定价策略、用户体验评价、我们的可学之处
4. 将材料分段输入，要求AI生成对比表格和雷达图描述
5. 人工补充AI可能遗漏的隐性信息（如行业传闻、融资动态）`,
    tool: 'Claude / DeepSeek', difficulty: '入门', timeMinutes: 25, category: '竞品分析',
  },
  {
    title: '建立竞品监控 Prompt 模板',
    desc: '设计一个通用的竞品分析 Prompt 模板，包含固定的分析维度、输出格式和评估标准。用 2 个不同的竞品测试这个模板，迭代至满意后沉淀到团队知识库。',
    guide: `1. 打开一个新对话，编写Prompt模板：角色定义+分析维度（功能/定价/UX/市场/技术）+输出格式（对比表+文字分析+机会点）+评估标准
2. 用竞品A测试模板，记录不足之处（如"定价分析太浅"）
3. 修改模板，用竞品B再次测试
4. 迭代2-3轮直到输出质量稳定
5. 将最终模板保存到团队文档库（飞书/语雀），附上使用说明和效果示例`,
    tool: '任意 AI 工具', difficulty: '进阶', timeMinutes: 30, category: '竞品分析',
  },
  // 数据分析
  {
    title: '用 AI 分析一份业务数据',
    desc: '准备一份脱敏后的业务数据（Excel），上传到 AI，逐步提问：先了解数据结构 → 要求描述基本统计特征 → 深入分析趋势 → 生成改进建议。',
    guide: `1. 准备数据：导出一份业务数据（如最近30天订单表），删除用户手机号/姓名等PII字段，保留数字和分类字段
2. 第一步：上传文件，问"请描述这个数据表的结构和各字段含义"
3. 第二步："请给出各数值字段的基本统计特征（均值/中位数/标准差/最大最小值）"
4. 第三步："请分析最近30天的趋势变化，有哪些值得关注的异常点？"
5. 第四步："基于以上分析，给出3个可落地的业务优化建议"
6. 记录每一步AI的表现，总结哪个环节AI分析最有用、哪个环节需要人工判断`,
    tool: 'DeepSeek / Claude', difficulty: '入门', timeMinutes: 25, category: '数据分析',
  },
  {
    title: '用 AI 做 A/B 测试结果分析',
    desc: '找一份真实的 A/B 测试数据（或自己编一组），要求 AI 进行完整的统计分析：计算 p 值、置信区间、效应量，并判断结果是否可信。',
    guide: `1. 准备数据：如果没有真实数据，可以描述"实验组A样本量5000转化率12.5%，对照组B样本量5000转化率11.8%，请分析"
2. 在AI中要求：计算p值、95%置信区间、效应量（相对提升率）
3. 追问："这个结果在95%置信水平下是否统计显著？是否可以推全量？"
4. 追问："如果样本量只有500而非5000，结论会改变吗？请解释原因"
5. 总结：AI在做统计分析时的准确性如何？哪个环节最需要人工验证？`,
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 20, category: '数据分析',
  },
  {
    title: '用 AI 生成数据可视化方案',
    desc: '描述你的业务指标和数据维度，让 AI 建议最合适的可视化方案（图表类型、对比维度、Dashboard 布局），并生成一个包含示例数据的交互页面。',
    guide: `1. 列出你需要监控的5-8个核心业务指标（如GMV、转化率、客单价、复购率、退款率）
2. 在Claude中输入：描述每个指标的数据类型（时间序列/分类/比率）和对比需求（环比/同比/细分），要求建议最佳图表类型
3. 要求AI说明为什么每个指标适合某种图表（如"转化率适合折线图因为它需要展示趋势变化"）
4. 要求AI生成一个包含所有指标的Dashboard HTML页面（使用Chart.js），填入示例数据
5. 在浏览器中预览效果，调整布局和配色`,
    tool: 'Claude Artifacts', difficulty: '进阶', timeMinutes: 20, category: '数据分析',
  },
  // 原型 & 开发
  {
    title: '用 AI 生成一个功能原型',
    desc: '选一个你最近想做的功能，用自然语言向 AI 描述界面布局和交互，生成可交互的 HTML 原型。至少迭代 3 次，每次改进一个方面。',
    guide: `1. 选一个真实功能（如"优惠券选择器"），在纸上画一个最粗糙的草图明确布局
2. 第1轮：向AI描述整体布局（顶部标题栏、中间优惠券列表、底部使用按钮），生成第一版原型
3. 第2轮：要求改进视觉——品牌色、圆角卡片、阴影层次、空状态展示
4. 第3轮：要求增加交互——点击优惠券高亮选中、自动计算折扣后价格、过期优惠券置灰
5. 在手机/浏览器中实际体验原型，记录AI生成UI的优缺点`,
    tool: 'Claude Artifacts / DeepSeek', difficulty: '入门', timeMinutes: 30, category: '原型 & 开发',
  },
  {
    title: '用 AI 生成数据看板 Demo',
    desc: '描述你需要监控的核心业务指标和布局，让 AI 生成一个包含图表的可交互 Dashboard 页面。可以直接用于向领导演示。',
    guide: `1. 确定Dashboard目标受众（领导/团队/自己）和核心信息层级
2. 整理5-8个核心指标，标注每个指标的：当前值、环比变化、目标值、预警阈值
3. 在Claude中输入：描述整体布局（4列网格，第一行放概览数字卡片，第二行放趋势图，第三行放明细表格）
4. 逐个描述每个图表：指标名称、数据示例、图表类型、颜色方案
5. 生成后检查：数据是否有明显错误？交互是否流畅？颜色是否区分度足够？
6. 调整文字为业务语言（不要用技术术语），确保领导能直接看懂`,
    tool: 'Claude Artifacts', difficulty: '入门', timeMinutes: 25, category: '原型 & 开发',
  },
  {
    title: '用 AI 写一个浏览器小工具',
    desc: '想一个你日常工作中重复操作的事情（如格式化文本、提取链接），向 AI 描述需求，让它生成一个可用的浏览器插件或油猴脚本。',
    guide: `1. 找出一个日常高频重复操作（示例：从PRD文档中提取所有URL链接并去重）
2. 向AI描述需求：输入是什么（选中文本/当前页面/粘贴内容），处理逻辑是什么，输出格式是什么
3. 要求AI生成一个Tampermonkey（油猴）脚本或一个独立的HTML工具页面
4. 如果是油猴脚本：安装Tampermonkey扩展→创建新脚本→粘贴代码→在目标页面测试
5. 如果是HTML工具：保存为.html文件→浏览器打开→测试→反馈改进
6. 分享工具给团队，收集使用反馈`,
    tool: 'Claude / ChatGPT', difficulty: '挑战', timeMinutes: 45, category: '原型 & 开发',
  },
  {
    title: '尝试用 Claude Code 修改项目代码',
    desc: '在终端安装 Claude Code，找一个简单的代码修改任务（如修改文案、调整样式），用自然语言描述需求，观察 AI 如何理解和修改代码。',
    guide: `1. 安装Claude Code：在终端运行 npm install -g @anthropic-ai/claude-code
2. cd到你的项目目录，运行claude启动交互式会话
3. 第一个任务（简单）：帮我把首页的按钮文字从"提交"改成"确认下单"，按钮颜色改成品牌绿
4. 观察AI如何定位文件、理解代码结构、做精准修改
5. 第二个任务（中等）：在用户列表页加一个搜索框，支持按用户名模糊搜索
6. 重要：每次修改后用git diff检查改动，确认AI没有改坏其他地方
7. 总结：哪些任务适合让AI直接改代码？哪些需要人工确认？`,
    tool: 'Claude Code', difficulty: '挑战', timeMinutes: 40, category: '原型 & 开发',
  },
  // Prompt 工程
  {
    title: '比较不同 Prompt 写法对输出的影响',
    desc: '同一个任务（如写商品文案），分别用 3 种不同质量的 Prompt 测试：模糊版、中等版、详细版。记录输出差异，总结什么信息对 AI 输出质量影响最大。',
    guide: `1. 选定一个任务：为某款T恤写电商商品文案（标题+3个卖点+详情描述）
2. 版本A（模糊）："写一个T恤的商品文案"
3. 版本B（中等）："为一款纯棉白色T恤写电商文案，包含标题和3个卖点"
4. 版本C（详细）：角色设为资深电商文案，产品为纯棉白色T恤（200g精梳棉、修身版型、不易变形），目标用户为25-35岁注重品质的男性，输出格式为标题（20字以内）+3个卖点（每个15字）+详情描述（100字），风格简约专业突出面料质感
5. 把3个输出放在一起对比，标注每个版本缺失了什么信息
6. 结论：哪个要素对输出质量影响最大（角色/产品细节/格式约束/风格要求）？`,
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 20, category: 'Prompt 工程',
  },
  {
    title: '用 Few-shot 批量生成内容',
    desc: '设计一个批量任务（如生成 10 个商品标题/活动文案/用户回复模板），先用 3 个示例定义格式和风格，再一次性输入所有任务信息。',
    guide: `1. 选定一个批量任务（如为10款不同商品生成营销短信文案）
2. 准备3个标准示例：输入（商品名+卖点）→输出（短信文案），确保示例覆盖不同风格（促销型/新品型/清仓型）
3. 在Prompt中先展示3个示例，然后列出10个商品的关键信息
4. 观察AI是否为每个商品生成了风格一致、格式统一的文案
5. 对比：逐个生成10次 vs 批量一次生成，记录时间差异
6. 如果批量中有个别输出不符合预期，尝试调整Prompt中的格式约束`,
    tool: '任意 AI 工具', difficulty: '进阶', timeMinutes: 25, category: 'Prompt 工程',
  },
  {
    title: '体验 DeepSeek 深度思考 vs 普通模式',
    desc: '同一个复杂分析任务（如需求优先级排序的逻辑推演），分别在开启和不开启深度思考的情况下执行，对比两者的推理质量和完整性。',
    guide: `1. 准备一个需要多步推理的任务：如"基于ROI、开发成本、战略匹配度三个维度，对以下5个需求做优先级排序并说明推理过程"
2. 第一轮：不开启深度思考，输入任务，记录AI的推理过程和最终结论
3. 第二轮：开启深度思考（R1模式），输入完全相同的Prompt
4. 对比两个输出：推理步骤是否完整？中间逻辑是否有跳跃？最终结论是否有差异？
5. 再测试一个场景：同样的逻辑问题，开启深度思考是否发现了普通模式忽略的边界情况
6. 总结：什么类型的任务值得开启深度思考？（提示：复杂推理/多因素权衡/数学计算）`,
    tool: 'DeepSeek', difficulty: '进阶', timeMinutes: 20, category: 'Prompt 工程',
  },
  {
    title: '跨工具 Prompt 对比测试',
    desc: '同一条 Prompt 分别在 DeepSeek、Claude、Kimi 中执行，对比输出质量、风格和准确性的差异。总结各工具的适用场景。',
    guide: `1. 准备3个不同类型的任务：A-长文写作（产品分析报告）、B-数据分析（从数据表中提取洞察）、C-创意生成（营销活动点子）
2. 为每个任务写一条固定的Prompt，确保信息足够详细
3. 分别在DeepSeek、Claude、Kimi中执行任务A，记录：输出质量、响应速度、格式美观度
4. 同样执行任务B和C
5. 制作对比表：每个工具在各任务类型上的表现（用星级评分）
6. 总结工具选型指南：什么任务优先用哪个工具？（提示：Kimi适合超长中文文档处理，Claude适合结构化分析和代码生成，DeepSeek适合推理和中文创意写作）`,
    tool: 'DeepSeek / Claude / Kimi', difficulty: '进阶', timeMinutes: 25, category: 'Prompt 工程',
  },
  // 会议 & 沟通
  {
    title: '用 AI 整理会议纪要',
    desc: '参加一次真实会议并录音 → 用转写工具转文字 → 将转写稿交给 AI → 要求按决议/待办/风险/分歧分类整理。对比手工整理的效果和效率。',
    guide: `1. 会前准备：确认会议议题，告知参会者会录音（合规要求）
2. 会议中：用飞书/钉钉/腾讯会议自带的录制和转写功能录音
3. 会后导出转写文字稿，检查转写准确率（重点关注人名、专业术语、数字）
4. 将转写稿输入AI，Prompt：请将以下会议记录按以下维度整理：①已达成决议（标注决议人和结论）②待办事项（标注负责人和DDL）③风险点（标注影响和概率）④未解决的分歧点
5. 对比AI版和你自己记的笔记，看AI是否遗漏了重要信息
6. 将AI纪要分享给参会者确认，收集反馈`,
    tool: '任意 AI 工具 + 转写工具', difficulty: '入门', timeMinutes: 20, category: '会议 & 沟通',
  },
  {
    title: '用 AI 润色周报',
    desc: '把你本周的工作要点列出来（流水账即可），让 AI 将其整理为结构清晰、重点突出的周报，适配发送给不同受众。',
    guide: `1. 列出本周做过的所有事情（流水账形式，不需要结构化）
2. 在AI中输入流水账+目标受众（直属领导），要求输出结构化周报：核心成果（3点）+进行中（2点）+下周计划（3点）+需要支持（1点）
3. 再要求AI生成一个"跨部门同步版"：用更通俗的语言，减少术语，突出协作相关的内容
4. 对比两个版本，确认AI正确理解了哪些内容对不同受众更重要
5. 实际发送周报，观察领导和同事的反馈是否有变化`,
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 10, category: '会议 & 沟通',
  },
  {
    title: '用 AI 准备需求评审演示',
    desc: '将你的 PRD 或功能说明交给 AI，要求生成评审会用的演示大纲、关键讨论点和常见质疑的应答建议。实际用于一次评审会后记录效果。',
    guide: `1. 将完整的PRD或功能说明文档提供给AI
2. 要求生成：①5页PPT演示大纲（背景→问题→方案→数据→排期）②5个评审会上最可能被问到的尖锐问题及应答建议③需要提前和哪些人做会前沟通的建议
3. 如果PRD中包含数据，让AI帮你准备1-2个"一句结论+数据支撑"的论点
4. 评审会上实际使用这些材料，记录哪些准备好了（用上了）哪些没准备好（被问到了没准备）
5. 会后更新Prompt模板，加入这次学到的内容`,
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 25, category: '会议 & 沟通',
  },
  // 学习 & 成长
  {
    title: '用 AI 快速了解一个新领域',
    desc: '选一个你不太熟悉但工作相关的领域（如推荐算法、供应链金融），让 AI 用能听懂的人话解释核心概念、关键指标和常见实践。',
    guide: `1. 选一个需要了解但不太熟悉的领域（如：协同过滤推荐算法）
2. 第一问："用小学生都能听懂的话，解释什么是协同过滤推荐算法"
3. 第二问："现在用产品经理能听懂的话，解释协同过滤在电商推荐中的实际应用方式"
4. 第三问："列举电商推荐系统最重要的5个效果指标，并解释每个指标的业务含义"
5. 第四问："目前大厂在推荐系统上有哪些主流技术方案？各自优缺点是什么？"
6. 把AI的回答整理成一份速查笔记，存入个人知识库`,
    tool: '任意 AI 工具', difficulty: '入门', timeMinutes: 15, category: '学习 & 成长',
  },
  {
    title: '用 AI 做知识体系梳理',
    desc: '把你当前负责的业务域的所有知识点告诉 AI，让它帮你梳理一个完整的知识体系框架，标注哪些你已掌握、哪些需要深入学习。',
    guide: `1. 列出你当前负责业务域涉及的所有知识主题（如"电商搜索"涉及：倒排索引、分词、排序模型、Query理解、相关性评估等）
2. 为每个主题自评掌握程度（1-5分）
3. 将所有信息输入AI，要求生成一个知识体系思维导图（用缩进文本表示），标注熟练度并推荐学习路径
4. 要求AI为每个你评分较低的主题推荐最值得看的1-2个学习资源方向（不要求具体URL）
5. 制定一个3个月的学习计划：每月重点攻克1-2个薄弱主题`,
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 30, category: '学习 & 成长',
  },
  {
    title: '让 AI 当你的面试官',
    desc: '设定 AI 为某公司的面试官，角色面试你关于产品经理 AI 能力的问题。要求 AI 在每个回答后给出反馈和改进建议。',
    guide: `1. 设定AI角色：你现在是字节跳动电商部的资深面试官，正在面试一位高级产品经理候选人，重点考察AI能力和产品思维
2. 让AI开始提问（每次1个问题），你认真回答每个问题
3. 每个问题回答后，要求AI给出：①回答中的亮点 ②未提到的关键点 ③建议的补充方向 ④如果满分10分这个回答打几分
4. 至少完成5轮问答，覆盖：AI能力认知、实际项目经验、Prompt设计、数据合规、团队推动等维度
5. 结束后要求AI给你一份完整的面试表现评估报告，标注强项和待提升项`,
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 25, category: '学习 & 成长',
  },
  // Skill 建设
  {
    title: '识别并封装你的第一个 AI Skill',
    desc: '回顾你最近两周的工作，找出一个高频重复的任务场景，按 Skill 四步法（识别→拆解→编写→测试）将其封装为可复用的 Skill。至少让一位同事试用并收集反馈。',
    guide: `1. 回顾最近两周的工作日志，圈出所有重复出现 3 次以上的任务（如周报撰写、竞品监控、用户反馈分类）
2. 选其中一个收益最高的场景，手动做一遍并记录每一步的输入、处理逻辑和输出格式
3. 编写 Skill 指令：包含角色定义（你是谁）、任务步骤（1-2-3-4）、输出模板（表格/JSON/列表）、边界约束（不要做什么、字数范围等）
4. 用至少 3 个真实案例测试 Skill，记录每次的输出质量和需要的修正
5. 请一位同事试用这个 Skill，收集"哪里不好用"或"少了什么"的反馈
6. 根据测试和反馈迭代 Skill，将最终版本存入团队知识库`,
    tool: 'Claude / DeepSeek', difficulty: '进阶', timeMinutes: 40, category: 'Skill 建设',
  },
  {
    title: '搭建团队的 Skill 共享库',
    desc: '在团队知识管理工具中创建一个 Skill 共享目录，制定 Skill 的提交规范和评审标准。先贡献 2 个你自己验证过的 Skill 作为种子内容，然后推动团队成员每人提交 1 个。',
    guide: `1. 选择团队的知识管理工具（飞书知识库/语雀/Notion/Confluence），新建一个"AI Skill 库"目录
2. 制定 Skill 提交模板：Skill 名称、一句话描述、适用场景、前置条件（需要什么输入）、完整指令、使用示例（至少 1 个输入-输出对）、已知局限、维护人
3. 制定评审标准：可用性（新人能直接用）、稳定性（多次运行结果一致）、安全性（不泄露敏感信息）
4. 将你已有的 2 个验证过的 Skill 按模板整理并提交，作为示范案例
5. 在团队周会上做 5 分钟演示：选一个痛点场景，现场用 Skill 解决，让大家看到效果
6. 推动团队成员每人提交 1 个各自领域的 Skill，定期评审和更新`,
    tool: '任意 AI 工具 + 知识管理工具', difficulty: '挑战', timeMinutes: 60, category: 'Skill 建设',
  },
  // 效率工具
  {
    title: '用 AI 批量处理 Excel 数据',
    desc: '找一份需要手工处理的 Excel 表格，描述处理规则，让 AI 生成一个可直接使用的处理方案（公式/Python 脚本/直接处理）。比较手工 vs AI 辅助的耗时。',
    guide: `1. 找一份实际需要处理的表格（如：需要从订单表中提取每个用户的首单日期并计算复购间隔）
2. 向AI描述表格结构（列名和示例数据）和处理规则
3. 先要求AI给出Excel公式方案（适用于简单逻辑），测试是否可用
4. 如果逻辑较复杂，要求AI生成一个Python脚本（pandas），复制到本地运行
5. 计时：手工处理 vs AI辅助处理的时间差异
6. 如果处理逻辑需要复用，把AI生成的脚本保存为工具文件，下次改输入路径即可复用`,
    tool: 'Claude / ChatGPT', difficulty: '进阶', timeMinutes: 25, category: '效率工具',
  },
  {
    title: '搭建你的 AI 工作流',
    desc: '梳理你一周内的所有工作内容，识别哪些环节可以用 AI 提效。为前 3 个最值得提效的环节设计 Prompt 模板，实际使用一周后评估效果。',
    guide: `1. 记录一周工作日志：每小时记录一次在做什么（如实记录，不要美化）
2. 周末分析日志，将工作分为：创造性工作（策略/设计）、重复性工作（报表/周报/回复）、沟通性工作（会议/同步）
3. 识别重复性工作中最耗时的3个环节（如：每次写周报30分钟、整理用户反馈40分钟、回复常见问题20分钟）
4. 为每个环节设计一个标准Prompt模板，目标是让AI完成80%的初稿工作
5. 下一周实际使用这些模板，每天记录节省的时间
6. 周末统计：本周AI帮你节省了多少时间？投入到什么更有价值的工作上了？`,
    tool: '任意 AI 工具', difficulty: '挑战', timeMinutes: 60, category: '效率工具',
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  '入门': '#059669',
  '进阶': '#4f46e5',
  '挑战': '#d97706',
};

export function PracticePage({ onBack }: { onBack: () => void }) {
  const [doneMap, setDoneMap] = useState<Record<number, boolean>>({});
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  const toggleDone = (idx: number) => {
    setDoneMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleGuide = (idx: number) => {
    setExpandedGuide(prev => prev === idx ? null : idx);
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>AI 实践任务</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            共 {taskPool.length} 个实践任务，点击展开查看详细执行指南
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onBack} className={styles.backBtn}>
            返回首页
          </button>
        </div>
      </div>

      <div className={styles.taskList}>
        {taskPool.map((task, i) => {
          const done = doneMap[i];
          const guideOpen = expandedGuide === i;
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
                    <span>{task.tool}</span>
                    <span>约 {task.timeMinutes} 分钟</span>
                    <span>{task.category}</span>
                  </div>
                </div>
              </div>
              <p className={styles.taskDesc}>{task.desc}</p>
              <button
                className={styles.guideToggle}
                onClick={() => toggleGuide(i)}
              >
                {guideOpen ? '收起执行指南 ▲' : '查看执行指南 ▼'}
              </button>
              {guideOpen && (
                <div className={styles.guideContent}>
                  {task.guide.split('\n').map((step, si) => (
                    <div key={si} className={styles.guideStep}>
                      <span className={styles.guideStepNum}>{si + 1}</span>
                      <span>{step.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.stats}>
        共 {taskPool.length} 个实践任务 | 已完成 {Object.values(doneMap).filter(Boolean).length} / {taskPool.length}
      </div>
    </div>
  );
}
