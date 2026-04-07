import EducationBlock from './EducationBlock';
import styles from './EducationSection.module.css';

function EducationSection() {
  return (
    <section id="education" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Education</h2>
        <EducationBlock />
      </div>
    </section>
  );
}

export default EducationSection;
