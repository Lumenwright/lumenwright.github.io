import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

function ContactSection() {
  return (
    <section id="contact" className="py-5">
      <div className="container">
        <h2>Let's Talk!</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>
            <a href="mailto:rose@lumenwright.com" style={{ color: 'inherit', textDecoration: 'none' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
              rose@lumenwright.com
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/roseadastra" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              <FontAwesomeIcon icon={faLinkedin} style={{ marginRight: '0.5rem' }} />
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default ContactSection;
