import SkillsGrid from './SkillsGrid';
import EducationBlock from './EducationBlock';
import RecommendationsSection from './RecommendationsSection';
import { parseInlineBold } from '../utils/parseInlineBold';
import styles from './AboutSection.module.css';

const prose = [
  "I came to software engineering from physics, and I still approach every problem the same way: understand the system before you change it.",
  "**Eight years of Unity/C#** across VR, AR, digital twins, and live training products. **MSc in Physics.** Strong foundations in the 3D math that sits underneath most real-time graphics work.",
  "What I'm told I do well: translating between engineers, designers, and leadership without losing anything in the translation. Spotting the actual problem before proposing a solution. Not letting design contradictions slide without a concrete resolution. Instigating the social and learning events that make a team more than the sum of its parts.",
  "Currently open to roles in games, XR, and simulation. Not afraid of quaternions."
];

function AboutSection() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2>Who am I?</h2>
        <ul className={styles.list}>
          {prose.map((b) => (
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
        <RecommendationsSection />
      </div>
    </section>
  );
}

export default AboutSection;
