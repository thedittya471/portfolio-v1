import Link from "next/link";
import { isAdmin } from "../../lib/admin-auth";
import { getPortfolio } from "../../lib/portfolio";
import { logoutAction } from "./actions";
import Editor from "./editor";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdmin();
  return <main className="admin-shell">
    <header><div><p className="admin-kicker">DITTYA</p><h1>Portfolio admin</h1></div><div className="admin-nav"><Link href="/">View portfolio</Link>{authenticated && <form action={logoutAction}><button>Sign out</button></form>}</div></header>
    {authenticated ? <Editor initialContent={await getPortfolio()} /> : <LoginForm />}
  </main>;
}
