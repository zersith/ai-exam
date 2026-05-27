import styles from './Timer.module.css';

interface Props {
  seconds: number;
}

export function Timer({ seconds }: Props) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const isWarn = seconds < 300;

  return (
    <span className={`${styles.timer} ${isWarn ? styles.warn : ''}`}>
      {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </span>
  );
}
