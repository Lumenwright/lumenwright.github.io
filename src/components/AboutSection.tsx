import SkillsGrid from './SkillsGrid';
import EducationBlock from './EducationBlock';

const bullets = [
  'Versatile senior Unity developer and former physicist',
  '8 years building robust, data-driven, real-time 3D experiences',
  'Described as "resilient", "compassionate", and "hungry for knowledge"',
  'Prefers design-led, full-stack teams',
  'Thrives on open-ended problems in fast-paced environments',
  'Not afraid of quaternions or 3D math',
];

function AboutSection() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2>About</h2>
        <ul>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <hr />
        <h5>Skills</h5>
        <SkillsGrid />
        <hr />
        <h5>Education</h5>
        <EducationBlock />
      </div>
    </section>
  );
}

export default AboutSection;
