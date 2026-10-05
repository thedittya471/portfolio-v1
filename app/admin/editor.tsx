"use client";

import { useActionState, useState } from "react";
import type { PortfolioContent } from "../../lib/portfolio";
import { saveContentAction } from "./actions";

const emptyExperience = { company: "", role: "", start: "", end: "", logo: "" };
const emptyProject = { name: "", description: "", image: "", live: "", code: "", stack: [] as string[] };

export default function Editor({ initialContent }: { initialContent: PortfolioContent }) {
  const [content, setContent] = useState(initialContent);
  const [state, action, pending] = useActionState(saveContentAction, {});
  const profile = (key: "name" | "email", value: string) => setContent(current => ({ ...current, profile: { ...current.profile, [key]: value } }));
  const updateExperience = (index: number, key: keyof PortfolioContent["experience"][number], value: string) => setContent(current => ({ ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const updateProject = (index: number, key: keyof PortfolioContent["projects"][number], value: string | string[]) => setContent(current => ({ ...current, projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  return <form className="admin-editor" action={action}>
    <input type="hidden" name="content" value={JSON.stringify(content)} />
    <section><h2>Profile</h2><div className="admin-grid">
      <label>Name<input value={content.profile.name} onChange={event => profile("name", event.target.value)} required /></label>
      <label>Email<input type="email" value={content.profile.email} onChange={event => profile("email", event.target.value)} required /></label>
      <label className="admin-wide">Roles, one per line<textarea value={content.profile.roles.join("\n")} onChange={event => setContent(current => ({ ...current, profile: { ...current.profile, roles: event.target.value.split("\n").filter(Boolean) } }))} /></label>
    </div></section>
    <section><h2>About</h2><label>Paragraphs, one per line<textarea rows={7} value={content.about.join("\n")} onChange={event => setContent(current => ({ ...current, about: event.target.value.split("\n").filter(Boolean) }))} /></label></section>
    <section><div className="admin-section-title"><h2>Experience</h2><button type="button" onClick={() => setContent(current => ({ ...current, experience: [...current.experience, emptyExperience] }))}>Add experience</button></div>
      {content.experience.map((item, index) => <fieldset key={index}><div className="admin-grid">
        {(["company", "role", "start", "end", "logo"] as const).map(key => <label key={key}>{key}<input value={item[key] ?? ""} onChange={event => updateExperience(index, key, event.target.value)} /></label>)}
      </div><button className="admin-remove" type="button" onClick={() => setContent(current => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }))}>Remove</button></fieldset>)}
    </section>
    <section><div className="admin-section-title"><h2>Projects</h2><button type="button" onClick={() => setContent(current => ({ ...current, projects: [...current.projects, emptyProject] }))}>Add project</button></div>
      {content.projects.map((item, index) => <fieldset key={index}><div className="admin-grid">
        <label>Name<input value={item.name} onChange={event => updateProject(index, "name", event.target.value)} /></label>
        <label>Project image<input type="file" name={`projectImage-${index}`} accept="image/png,image/jpeg,image/webp,image/gif" /><small>PNG, JPEG, WebP or GIF. Maximum 5 MB.</small></label>
        {item.image && <div className="admin-image-status"><span>Current image is set.</span><button type="button" onClick={() => updateProject(index, "image", "")}>Remove image</button></div>}
        <label className="admin-wide">Description<textarea value={item.description} onChange={event => updateProject(index, "description", event.target.value)} /></label>
        <label>Live URL<input type="url" value={item.live ?? ""} onChange={event => updateProject(index, "live", event.target.value)} /></label>
        <label>Code URL<input type="url" value={item.code ?? ""} onChange={event => updateProject(index, "code", event.target.value)} /></label>
        <label className="admin-wide">Stack, comma separated<input value={item.stack.join(", ")} onChange={event => updateProject(index, "stack", event.target.value.split(",").map(value => value.trim()).filter(Boolean))} /></label>
      </div><button className="admin-remove" type="button" onClick={() => setContent(current => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))}>Remove</button></fieldset>)}
    </section>
    <section><h2>Skills</h2><label>Comma separated<textarea rows={4} value={content.skills.join(", ")} onChange={event => setContent(current => ({ ...current, skills: event.target.value.split(",").map(value => value.trim()).filter(Boolean) }))} /></label></section>
    <section><h2>Links</h2><div className="admin-grid">{Object.entries(content.links).map(([key, value]) => <label key={key}>{key}<input value={value} onChange={event => setContent(current => ({ ...current, links: { ...current.links, [key]: event.target.value } }))} /></label>)}</div></section>
    <div className="admin-save">{state.error && <p className="admin-error" role="alert">{state.error}</p>}{state.success && <p className="admin-success" role="status">{state.success}</p>}<button disabled={pending}>{pending ? "Saving…" : "Save changes"}</button></div>
  </form>;
}
