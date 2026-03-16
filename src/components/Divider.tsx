import styles from './Divider.module.css';

interface DividerProps {
  onLightClick: () => void;
  onDarkClick: () => void;
}

function Divider({ onLightClick, onDarkClick }: DividerProps) {
  return (
    <div className={styles.divider}>
      <div className={styles.circle}>
        <button
          className={`${styles.half} ${styles.topHalf}`}
          onClick={onLightClick}
          aria-label="Expand light section"
        />
        <button
          className={`${styles.half} ${styles.bottomHalf}`}
          onClick={onDarkClick}
          aria-label="Expand dark section"
        />
      </div>
    </div>
  );
}

export default Divider;
