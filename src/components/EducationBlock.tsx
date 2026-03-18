import education from '../data/education';
import styles from './EducationBlock.module.css';

function EducationBlock() {
  return (
    <div className={styles.list}>
      {education.map((entry) => (
        <div key={entry.institution} className={styles.entry}>
          <div className={styles.left}>
            <span className={styles.institution}>{entry.institution}</span>
            <span className={styles.degree}>{entry.degree}</span>
          </div>
          <span className={styles.years}>{entry.years}</span>
        </div>
      ))}
    </div>
  );
}

export default EducationBlock;
