interface ProjectCardProps {
  title: string;
  description: string;
}

function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
}

const projects = [
  { title: 'Project 1', description: 'Description of project 1.' },
  { title: 'Project 2', description: 'Description of project 2.' },
  { title: 'Project 3', description: 'Description of project 3.' },
];

function ProjectsSection() {
  return (
    <section id="projects" className="bg-light py-5">
      <div className="container">
        <h2>Projects</h2>
        <div className="row">
          {projects.map((project) => (
            <ProjectCard key={project.title} title={project.title} description={project.description} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
