import Link from "next/link";
import Image from "next/image";
import DotField from "./components/dot-field";
import ThemeToggle from "./components/theme-toggle";

export default function Home() {
  return (
    <main id="main" className="portfolio">
      <header className="header">
        <Link href="/" className="wordmark" aria-label="Dittya home">DITTYA</Link>
        <div className="header-right"><a className="contact-link" href="mailto:dittyamaity@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a><ThemeToggle /></div>
      </header>
      <section className="hero" aria-labelledby="name">
        <div className="banner" aria-hidden="true">
          <DotField dotRadius={2} dotSpacing={12} cursorRadius={180} bulgeStrength={36} glowRadius={100} gradientFrom="rgba(145,145,145,0.5)" gradientTo="rgba(145,145,145,0.2)" glowColor="transparent" />
        </div>
        <div className="profile">
          <div className="avatar"><Image src="/avatar.png" alt="Dittya Maity’s illustrated avatar" width={96} height={96} priority unoptimized /></div>
          <div className="intro">
            <h1 id="name">Dittya Maity</h1>
            <p className="role">Software engineer <span> / </span> Full stack developer</p>
            <a className="email-button" href="mailto:dittyamaity@gmail.com"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 6 9 7 9-7" /></svg> Send an email <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
