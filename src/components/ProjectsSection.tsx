export interface Project {
  title: string;
  description: string;
  thumbnail: string;
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="col-md-4">
      <div className="card">
        <img src={project.thumbnail} alt={project.title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text">{project.description}</p>
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
        <h2>Projects</h2>
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
