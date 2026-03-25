import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import styles from './ContactSection.module.css';

function ContactSection() {
  return (
    <section id="contact" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Let's Talk!</h2>
        <ul className={styles.list}>
          <li>
            <a href="mailto:rose@lumenwright.com" className={styles.link}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
              rose@lumenwright.com
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/roseadastra" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <FontAwesomeIcon icon={faLinkedin} className={styles.icon} />
              LinkedIn
            </a>
          </li>
        </ul>
        <p>Currently open to roles in games, XR, and simulation. Also interested in hearing about anything at the intersection of real-time 3D and novel application domains.</p>
      </div>
    </section>
  );
}

export default ContactSection;
