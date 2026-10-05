import Image from "next/image";
import type { Project } from "../../lib/portfolio";
import ConnectIcon from "./connect-icon";

export default function Projects({ projects }: { projects: Project[] }) {
  return <section className="content-section" aria-labelledby="projects-heading">
    <h2 id="projects-heading">Projects</h2>
    <div className="project-grid">{projects.map(project => <article className="project-card" key={project.name}>
      {project.image ? <Image className="project-image" src={project.image} alt={`${project.name} preview`} width={640} height={380} unoptimized /> : <div className="project-placeholder"><span aria-hidden="true">↗</span>Project preview coming soon</div>}
      <div className="project-title"><h3>{project.name}</h3><div className="project-actions">
        {project.live && <a href={project.live} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>Live ↗</a>}
        {project.code && <a href={project.code} target="_blank" rel="noreferrer" aria-label={`View ${project.name} source`}><ConnectIcon name="github" />Code</a>}
      </div></div>
      <p>{project.description}</p>
      <ul className="project-stack">{project.stack.map(skill => <li key={skill}>{skill}</li>)}</ul>
    </article>)}</div>
    <div className="projects-footer"><a href="https://github.com/thedittya471?tab=repositories" target="_blank" rel="noreferrer">See all projects <span aria-hidden="true">→</span></a></div>
  </section>;
}
