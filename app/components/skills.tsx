const marks: Record<string, [string, string]> = {
  TypeScript: ["TS", "#3178c6"], React: ["⚛", "#61dafb"], "Next.js": ["N", "var(--foreground)"],
  "Tailwind CSS": ["≈", "#38bdf8"], "Node.js": ["JS", "#68a063"], Express: ["ex", "var(--foreground)"],
  MongoDB: ["M", "#47a248"], PostgreSQL: ["PG", "#649ac5"], Drizzle: ["//", "#a3cf48"],
  Prisma: ["△", "var(--foreground)"], Redis: ["R", "#ef4444"], Kafka: ["K", "var(--foreground)"],
  WebSockets: ["⇄", "#a78bfa"], "REST APIs": ["{}", "var(--muted)"], tRPC: ["t", "#398ccb"],
  Docker: ["D", "#2496ed"], Postman: ["P", "#ff6c37"], Git: ["◇", "#f05032"], GitHub: ["GH", "var(--foreground)"],
};

export default function Skills({ skills }: { skills: string[] }) {
  return <section className="content-section" aria-labelledby="skills-heading">
    <h2 id="skills-heading">Skills</h2>
    <ul className="skill-list">{skills.map(name => {
      const [mark, color] = marks[name] ?? [name.slice(0, 2).toUpperCase(), "var(--muted)"];
      return <li key={name}><span className="skill-mark" style={{ color }} aria-hidden="true">{mark}</span>{name}</li>;
    })}</ul>
  </section>;
}
