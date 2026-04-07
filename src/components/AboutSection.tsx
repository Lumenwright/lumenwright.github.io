import { parseInlineBold } from '../utils/parseInlineBold';
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
      </div>
    </section>
  );
}

export default AboutSection;
