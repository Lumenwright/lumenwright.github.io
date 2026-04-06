import SkillsGrid from './SkillsGrid';
import EducationBlock from './EducationBlock';
import RecommendationsSection from './RecommendationsSection';
import { parseInlineBold } from '../utils/parseInlineBold';
import technicalWriting from '../data/technical-writing';
import { aboutProse } from '../data/about';
import styles from './AboutSection.module.css';

function AboutSection() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2>Who am I?</h2>
        <ul className={styles.list}>
          {aboutProse.map((b) => (
            <p key={b}>{parseInlineBold(b)}</p>
          ))}
        </ul>
        <hr />
        <h5>Skills</h5>
        <SkillsGrid />
        <hr />
        <h5>Education</h5>
        <EducationBlock />
        <hr />
        <h5>Technical Writing</h5>
        <div className={styles.techWritingList}>
          {technicalWriting.map((entry) => (
            <div key={entry.title} className={styles.techWritingEntry}>
              {entry.url
                ? <a href={entry.url} className={styles.techWritingTitle}>{entry.title}</a>
                : <span className={styles.techWritingTitle}>{entry.title}</span>
              }
              <p className={styles.techWritingDescription}>{entry.description}</p>
            </div>
          ))}
        </div>
        <hr />
        <RecommendationsSection />
      </div>
    </section>
  );
}

export default AboutSection;
