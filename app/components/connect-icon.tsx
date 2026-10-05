type IconName = "resume" | "github" | "linkedin" | "x" | "instagram" | "email";

export default function ConnectIcon({ name }: { name: IconName }) {
  const paths = {
    resume: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    github: <path fill="currentColor" stroke="none" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.06c-3.09.67-3.74-1.31-3.74-1.31-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.14 1.7 1.14.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.71-1.49-2.46-.28-5.05-1.23-5.05-5.49 0-1.21.43-2.2 1.14-2.97-.11-.28-.49-1.41.11-2.93 0 0 .93-.3 3.05 1.13A10.6 10.6 0 0 1 12 6.27c.94 0 1.89.13 2.78.37 2.12-1.43 3.05-1.13 3.05-1.13.6 1.52.22 2.65.11 2.93.71.77 1.14 1.76 1.14 2.97 0 4.27-2.59 5.21-5.06 5.48.4.35.75 1.02.75 2.06v3.04c0 .3.2.65.76.54A11.1 11.1 0 0 0 12 .9Z" />,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7m4 0v-7m0 3a3 3 0 0 1 6 0v4" /><circle cx="8" cy="7" r=".75" fill="currentColor" stroke="none" /></>,
    x: <><path d="m4 3 12.5 18H20L7.5 3Z" /><path d="m20 3-7 8M4 21l7-8" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    email: <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></>,
  };
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
