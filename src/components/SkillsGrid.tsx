import skills, { SkillCategory } from '../data/skills';
import styles from './SkillsGrid.module.css';

function SkillTag({ label }: { label: string }) {
  return <span className={styles.tag}>{label}</span>;
}

function SkillCategoryBlock({ category, skills }: SkillCategory) {
  return (
    <div className={styles.category}>
      <p className={styles.categoryLabel}>{category}</p>
      <div className={styles.tags}>
        {skills.map((skill) => (
          <SkillTag key={skill} label={skill} />
        ))}
      </div>
    </div>
  );
}

function SkillsGrid() {
  return (
    <div className={styles.grid}>
      {skills.map((cat) => (
        <SkillCategoryBlock key={cat.category} category={cat.category} skills={cat.skills} />
      ))}
    </div>
  );
}

export default SkillsGrid;
