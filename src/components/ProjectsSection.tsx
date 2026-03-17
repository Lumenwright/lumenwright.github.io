import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img src={project.thumbnail} alt={project.title} className="card-img-top" />
        <div className="card-body">
          {(project.company || project.years) && (
            <p className="card-subtitle mb-1 text-muted" style={{ fontSize: '0.8rem' }}>
              {[project.company, project.years].filter(Boolean).join(' · ')}
            </p>
          )}
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text">{project.description}</p>
          {project.skills && project.skills.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="badge rounded-pill"
                  style={{ fontSize: '0.7rem', background: '#eee', color: '#444' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="bg-light py-5">
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
