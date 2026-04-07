import SkillsGrid from './SkillsGrid';
import styles from './SkillsSection.module.css';

function SkillsSection() {
  return (
    <section id="skills" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Skills</h2>
        <SkillsGrid />
      </div>
    </section>
  );
}

export default SkillsSection;
