import styles from "./LoadingBar.module.css";

interface LoadingBarProps {
  visible: boolean;
  progress: number;
  label: string;
}

export function LoadingBar({ visible, progress, label }: LoadingBarProps) {
  if (!visible) {
    return null;
  }
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${Math.max(2, progress)}%` }} />
      </div>
      <div className={styles.label}>
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}

