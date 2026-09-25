"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import styles from "../admin.module.css";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className={styles.loginCard}>
      <h1 className={styles.h1}>Admin</h1>
      <label className={styles.field}>
        <span>Passwort</span>
        <input type="password" name="password" required autoFocus autoComplete="current-password" />
      </label>
      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      <button className="button button-red" disabled={pending}>
        {pending ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
