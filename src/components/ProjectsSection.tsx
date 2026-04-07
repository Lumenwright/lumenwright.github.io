import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import styles from './ProjectsSection.module.css';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowModal(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <>
      <div className="col-md-4 mb-4">
        <div className={`card h-100 ${styles.card}`} onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          <img src={project.thumbnail} alt={project.title} className="card-img-top" />
          <div className="card-body d-flex flex-column">
            {(project.company || project.years) && (
              <p className={`card-subtitle mb-1 ${styles.subtitle}`} style={{ fontSize: '0.8rem' }}>
                {[project.company, project.years].filter(Boolean).join(' · ')}
              </p>
            )}
            <h5 className="card-title">{project.title}</h5>
            <p className="card-text small flex-grow-1">{project.briefDescription}</p>
            {project.skills && project.skills.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="badge rounded-pill" style={{ fontSize: '0.7rem', background: '#bf9b30', color: '#081c09' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            <img src={project.thumbnail} alt={project.title} className={styles.modalImage} />
            <div className={styles.modalBody}>
              {(project.company || project.years) && (
                <p className={styles.modalSubtitle}>{[project.company, project.years].filter(Boolean).join(' · ')}</p>
              )}
              <h3>{project.title}</h3>
              <p className={styles.modalDescription}>{project.description}</p>
              {project.externalLink && (
                <a href={project.externalLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  View external link
                </a>
              )}
              {project.skills && project.skills.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mt-3">
                  {project.skills.map((skill) => (
                    <span key={skill} className="badge rounded-pill" style={{ fontSize: '0.75rem', background: '#bf9b30', color: '#081c09' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Work</h2>
        <div className="row">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
