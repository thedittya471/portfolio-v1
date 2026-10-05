import Projects from "./components/projects";
import Skills from "./components/skills";
import Link from "next/link";
import Image from "next/image";
import DotField from "./components/dot-field";
import ThemeToggle from "./components/theme-toggle";
import ConnectIcon from "./components/connect-icon";
import GitHubActivity from "./components/github-activity";
import { getPortfolio } from "../lib/portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPortfolio();
  const { profile, links } = content;
  return (
    <main id="main" className="portfolio">
      <header className="header">
        <Link href="/" className="wordmark" aria-label={`${profile.name} home`}>{profile.name.split(" ")[0].toUpperCase()}</Link>
        <div className="header-right"><a className="contact-link" href={`mailto:${profile.email}`}>Let’s talk <span aria-hidden="true">↗</span></a><ThemeToggle /></div>
      </header>
      <section className="hero" aria-labelledby="name">
        <div className="banner" aria-hidden="true">
          <DotField dotRadius={2.6} dotSpacing={8} cursorRadius={140} bulgeStrength={24} glowRadius={100} gradientFrom="rgba(170,170,170,0.7)" gradientTo="rgba(170,170,170,0.45)" glowColor="transparent" />
        </div>
        <div className="profile">
          <div className="avatar"><Image src="/avatar.png" alt={`${profile.name}’s illustrated avatar`} width={96} height={96} priority unoptimized /></div>
          <div className="intro">
            <h1 id="name">{profile.name}</h1>
            <p className="role">{profile.roles.map((role, index) => <span className="role-item" key={role}>{index > 0 && <i aria-hidden="true"> / </i>}{role}</span>)}</p>
            <a className="email-button" href={`mailto:${profile.email}`}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 6 9 7 9-7" /></svg> Send an email <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <section className="about" aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        <ul>
          {content.about.map(item => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className="content-section" aria-labelledby="connect-heading">
        <h2 id="connect-heading">Connect</h2>
        <div className="connect-links">
          <a href={links.resume} download aria-label="Download résumé"><ConnectIcon name="resume" />Résumé</a>
          <a href={links.github} target="_blank" rel="noreferrer"><ConnectIcon name="github" />GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer"><ConnectIcon name="linkedin" />LinkedIn</a>
          <a href={links.x} target="_blank" rel="noreferrer"><ConnectIcon name="x" />X (Twitter)</a>
          <a href={links.instagram} target="_blank" rel="noreferrer"><ConnectIcon name="instagram" />Instagram</a>
          <a href={`mailto:${profile.email}`}><ConnectIcon name="email" />Email</a>
        </div>
      </section>
      <section className="content-section" aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        {content.experience.map(item => <div className="experience-row" key={`${item.company}-${item.start}`}>
          {item.logo ? <Image className="club-icon" src={item.logo} alt={`${item.company} logo`} width={44} height={44} unoptimized /> : <div className="club-icon" aria-hidden="true">&lt;/&gt;</div>}
          <div className="experience-info"><h3>{item.company}</h3><p>{item.role}</p></div>
          <p className="experience-dates">{item.start} – {item.end}</p>
        </div>)}
      </section>
      <section className="content-section" aria-labelledby="activity-heading">
        <h2 id="activity-heading">Activity</h2>
        <GitHubActivity />
      </section>
      <Projects projects={content.projects} />
      <Skills skills={content.skills} />
    </main>
  );
}
