import { EXAM_ROUNDS, SUBJECT_INFO_MAP } from '../types';
import styles from './HomePage.module.css';

interface Props {
  startExam: () => void;
  onLearn: () => void;
  onKnowledge: () => void;
  onPractice: () => void;
  onHistory: () => void;
}

export function HomePage({ startExam, onLearn, onKnowledge, onPractice, onHistory }: Props) {
  return (
    <div className="app-container">
      <div className={styles.hero}>
        <span className={styles.icon}>🤖</span>
        <h1 className={styles.title}>AI 产品经理能力认证</h1>
        <p className={styles.subtitle}>
          5 轮递进式专项考试，覆盖 AI 能力认知、辅助提效、驱动落地、Prompt 工程、数据合规五大能力维度
        </p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>考试流程</h2>
        <div className={styles.rounds}>
          {EXAM_ROUNDS.map((subject, i) => {
            const info = SUBJECT_INFO_MAP[subject];
            return (
              <div key={subject} className={styles.roundItem}>
                <div className={styles.roundBadge}>{i + 1}</div>
                <div className={styles.roundBody}>
                  <div className={styles.roundHeader}>
                    <span className={styles.roundIcon}>{info.icon}</span>
                    <span className={styles.roundLabel}>{info.label}</span>
                    <span className={styles.roundMeta}>{info.questionCount} 题 · {info.timeMinutes} 分钟</span>
                  </div>
                  <p className={styles.roundDesc}>{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>考试说明</h2>
        <div className={styles.rules}>
          <div className={styles.ruleItem}>
            <span className={styles.ruleLabel}>考试形式</span>
            <span className={styles.ruleValue}>5 轮专项，依次进行，共 40 题</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleLabel}>每轮时长</span>
            <span className={styles.ruleValue}>12 分钟（8 道题）</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleLabel}>题型分布</span>
            <span className={styles.ruleValue}>单选题 / 多选题 / 判断题</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleLabel}>评分规则</span>
            <span className={styles.ruleValue}>每题 1 分，多选需全部选对才得分</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleLabel}>交卷方式</span>
            <span className={styles.ruleValue}>手动交卷或倒计时结束自动交卷</span>
          </div>
        </div>
      </div>

      <button className={styles.startBtn} onClick={startExam}>
        开始第 1 轮考试
      </button>
      <div className={styles.secondaryBtns}>
        <button className={styles.secondaryBtn} onClick={onKnowledge}>
          📚 知识点汇总
        </button>
        <button className={styles.secondaryBtn} onClick={onPractice}>
          🎯 AI 实践任务
        </button>
        <button className={styles.secondaryBtn} onClick={onLearn}>
          💡 基础概念学习
        </button>
        <button className={styles.secondaryBtn} onClick={onHistory}>
          📋 考试记录
        </button>
      </div>
    </div>
  );
}
