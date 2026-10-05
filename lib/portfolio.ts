import { randomUUID } from "node:crypto";
import { Pool } from "pg";

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  logo?: string;
};

export type Project = {
  name: string;
  description: string;
  image?: string;
  live?: string;
  code?: string;
  stack: string[];
};

export type PortfolioContent = {
  profile: { name: string; roles: string[]; email: string };
  about: string[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  links: {
    resume: string;
    github: string;
    linkedin: string;
    x: string;
    instagram: string;
  };
};

export const defaultContent: PortfolioContent = {
  profile: {
    name: "Dittya Maity",
    roles: ["Software engineer", "Full stack developer"],
    email: "dittyamaity@gmail.com",
  },
  about: [
    "I’m Dittya, a full stack developer and second-year university student. As a member of my university’s dev club, I’m gaining hands-on experience building projects and products.",
    "I build web interfaces with React, Next.js, TypeScript and Tailwind CSS, connecting them to backend services to create complete applications.",
    "My backend stack includes Node.js, Express, REST APIs and tRPC, with MongoDB and PostgreSQL for databases and Drizzle and Prisma for data access.",
  ],
  experience: [
    { company: "Dev Club NST × RU", role: "Associate", start: "Oct 2025", end: "Present", logo: "/dev-club-logo.jpg" },
  ],
  projects: [
    { name: "Project One", description: "A space for your first featured project. Add a short overview of what it does and the problem it solves.", stack: [] },
    { name: "Project Two", description: "A space for your next featured project. Add a preview, the technologies used, and links when it’s ready.", stack: [] },
  ],
  skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "Express", "MongoDB", "PostgreSQL", "Drizzle", "Prisma", "Redis", "Kafka", "WebSockets", "REST APIs", "tRPC", "Docker", "Postman", "Git", "GitHub"],
  links: {
    resume: "/resume-sample.pdf",
    github: "https://github.com/thedittya471",
    linkedin: "https://www.linkedin.com/in/dittya-maity25150/",
    x: "https://x.com/thedittya",
    instagram: "https://www.instagram.com/dittya__maity",
  },
};

declare global {
  var portfolioPool: Pool | undefined;
}

const pool = global.portfolioPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
});

if (process.env.NODE_ENV !== "production") global.portfolioPool = pool;

let initialized: Promise<void> | undefined;

export type ProjectImageUpload = {
  id: string;
  contentType: string;
  data: Buffer;
};

function initialize() {
  initialized ??= pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_content (
      id smallint PRIMARY KEY CHECK (id = 1),
      content jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS project_images (
      id uuid PRIMARY KEY,
      content_type text NOT NULL,
      data bytea NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      CHECK (octet_length(data) <= 5242880)
    );
  `).then(() => pool.query(
    "INSERT INTO portfolio_content (id, content) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING",
    [JSON.stringify(defaultContent)],
  )).then(() => undefined);
  return initialized;
}

export async function getPortfolio(): Promise<PortfolioContent> {
  if (!process.env.DATABASE_URL) return defaultContent;
  try {
    await initialize();
    const result = await pool.query<{ content: PortfolioContent }>("SELECT content FROM portfolio_content WHERE id = 1");
    return result.rows[0]?.content ?? defaultContent;
  } catch (error) {
    console.error("Unable to load portfolio content", error);
    return defaultContent;
  }
}

export async function savePortfolio(content: PortfolioContent, images: ProjectImageUpload[] = []) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  await initialize();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const image of images) {
      await client.query(
        "INSERT INTO project_images (id, content_type, data) VALUES ($1, $2, $3)",
        [image.id, image.contentType, image.data],
      );
    }
    await client.query(
      "UPDATE portfolio_content SET content = $1::jsonb, updated_at = now() WHERE id = 1",
      [JSON.stringify(content)],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

const imageTypes = {
  "image/png": (data: Buffer) => data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  "image/jpeg": (data: Buffer) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
  "image/gif": (data: Buffer) => ["GIF87a", "GIF89a"].includes(data.subarray(0, 6).toString("ascii")),
  "image/webp": (data: Buffer) => data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP",
} satisfies Record<string, (data: Buffer) => boolean>;

export async function prepareProjectImage(file: File): Promise<ProjectImageUpload> {
  if (file.size > 5 * 1024 * 1024) throw new Error("Project images must be 5 MB or smaller.");
  const data = Buffer.from(await file.arrayBuffer());
  const validate = imageTypes[file.type as keyof typeof imageTypes];
  if (!validate || !validate(data)) throw new Error("Project images must be valid PNG, JPEG, WebP or GIF files.");
  return { id: randomUUID(), contentType: file.type, data };
}

export async function getProjectImage(id: string) {
  if (!process.env.DATABASE_URL) return null;
  await initialize();
  const result = await pool.query<{ content_type: string; data: Buffer }>(
    "SELECT content_type, data FROM project_images WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string" && item.length <= 2_000);
}

function isOptionalString(value: unknown) {
  return value === undefined || (typeof value === "string" && value.length <= 2_000);
}

export function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== "object") return false;
  const data = value as PortfolioContent;
  return Boolean(
    data.profile && typeof data.profile.name === "string" && data.profile.name.length <= 100 &&
    typeof data.profile.email === "string" && data.profile.email.length <= 320 && isStringArray(data.profile.roles) &&
    isStringArray(data.about) && Array.isArray(data.experience) && data.experience.length <= 25 &&
    data.experience.every(item => item && [item.company, item.role, item.start, item.end].every(field => typeof field === "string" && field.length <= 200) && isOptionalString(item.logo)) &&
    Array.isArray(data.projects) && data.projects.length <= 25 &&
    data.projects.every(item => item && typeof item.name === "string" && typeof item.description === "string" && item.name.length <= 200 && item.description.length <= 2_000 && isOptionalString(item.image) && isOptionalString(item.live) && isOptionalString(item.code) && isStringArray(item.stack)) &&
    isStringArray(data.skills) && data.skills.length <= 100 && data.links &&
    [data.links.resume, data.links.github, data.links.linkedin, data.links.x, data.links.instagram].every(link => typeof link === "string" && link.length <= 2_000)
  );
}
