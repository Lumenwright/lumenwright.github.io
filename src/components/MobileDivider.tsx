import styles from './MobileDivider.module.css';
import ProfileCircle from './ProfileCircle';

function MobileDivider() {
  return (
    <div className={styles.divider}>
      <div className={styles.circleWrapper}>
        <ProfileCircle />
      </div>
    </div>
  );
}

export default MobileDivider;
