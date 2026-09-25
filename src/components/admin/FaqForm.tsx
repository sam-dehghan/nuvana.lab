"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveFaq, type FaqState } from "@/app/admin/faq/actions";
import styles from "@/app/admin/admin.module.css";

type Props = { id?: number; question?: string; answer?: string };

export function FaqForm({ id, question = "", answer = "" }: Props) {
  const [state, action, pending] = useActionState<FaqState, FormData>(saveFaq, {});
  const isNew = id === undefined;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isNew && state.saved) formRef.current?.reset();
  }, [isNew, state]);

  return (
    <form ref={formRef} action={action} className={styles.stack}>
      {!isNew && <input type="hidden" name="id" value={id} />}
      <label className={styles.field}>
        <span>Frage</span>
        <input name="question" defaultValue={question} required maxLength={300} />
      </label>
      <label className={styles.field}>
        <span>Antwort</span>
        <textarea name="answer" defaultValue={answer} required rows={4} maxLength={3000} />
      </label>
      <div className={styles.row}>
        <button className="button button-red" disabled={pending}>
          {pending ? "Speichern …" : isNew ? "Frage hinzufügen" : "Speichern"}
        </button>
        {state.saved && !pending && <span className={styles.ok}>Gespeichert</span>}
        {state.error && (
          <span className={styles.error} role="alert">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
