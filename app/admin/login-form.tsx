"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return <form className="admin-login" action={action}>
    <p>Sign in to edit your portfolio.</p>
    <label>Admin password<input name="password" type="password" required autoComplete="current-password" /></label>
    {state.error && <p className="admin-error" role="alert">{state.error}</p>}
    <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
