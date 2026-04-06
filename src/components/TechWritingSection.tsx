import technicalWriting from '../data/technical-writing';
import styles from './TechWritingSection.module.css';

function TechWritingSection() {
  return (
    <section id="technical-writing" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Technical Writing</h2>
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
      </div>
    </section>
  );
}

export default TechWritingSection;
