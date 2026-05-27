import { useState, useEffect, useRef, useCallback } from 'react';
import * as authApi from '../api/auth';
import type { UserInfo } from '../api/auth';
import styles from './NameInput.module.css';

interface Props {
  onLogin: (info: UserInfo) => void;
}

export function NameInput({ onLogin }: Props) {
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('ai-exam-user-name') || ''; } catch { return ''; }
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      const info = await authApi.login(trimmed);
      localStorage.setItem('ai-exam-user-name', info.name);
      onLogin(info);
    } catch {
      setLoading(false);
    }
  }, [name, loading, onLogin]);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.icon}>🤖</div>
        <h1 className={styles.title}>AI 产品经理能力认证</h1>
        <p className={styles.subtitle}>请输入你的姓名，开始使用</p>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="输入姓名"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          maxLength={50}
        />
        <button className={styles.startBtn} onClick={handleSubmit} disabled={!name.trim() || loading}>
          {loading ? '...' : '开始'}
        </button>
      </div>
    </div>
  );
}
