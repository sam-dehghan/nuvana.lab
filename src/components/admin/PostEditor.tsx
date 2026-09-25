"use client";

import Link from "next/link";
import { startTransition, useActionState, useRef, useState } from "react";
import { deletePost, savePost, uploadCover, type PostState, type UploadState } from "@/app/admin/blog/actions";
import { Markdown } from "@/components/Markdown";
import { slugify } from "@/lib/slug";
import { ConfirmButton } from "./ConfirmButton";
import styles from "@/app/admin/admin.module.css";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  published: boolean;
};

type Tool = { label: string; title: string; before: string; after?: string; line?: boolean };

const tools: Tool[] = [
  { label: "H2", title: "Überschrift", before: "## ", line: true },
  { label: "H3", title: "Zwischenüberschrift", before: "### ", line: true },
  { label: "B", title: "Fett", before: "**", after: "**" },
  { label: "I", title: "Kursiv", before: "_", after: "_" },
  { label: "•", title: "Liste", before: "- ", line: true },
  { label: "1.", title: "Nummerierte Liste", before: "1. ", line: true },
  { label: "❝", title: "Zitat", before: "> ", line: true },
  { label: "Link", title: "Link", before: "[", after: "](https://)" },
];

export function PostEditor({ post, justCreated }: { post?: Post; justCreated?: boolean }) {
  const [state, action, pending] = useActionState<PostState, FormData>(savePost, {});
  const [upload, uploadAction, uploading] = useActionState<UploadState, FormData>(uploadCover, {});

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [body, setBody] = useState(post?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [coverOverride, setCoverOverride] = useState<string | null | undefined>(undefined);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // A fresh upload wins until the user removes it; otherwise keep the stored cover.
  const cover = coverOverride !== undefined ? coverOverride : (upload.url ?? post?.cover_url ?? null);

  function applyTool(tool: Tool) {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = body.slice(start, end) || tool.title;
    const lineStart = tool.line && start > 0 && body[start - 1] !== "\n" ? "\n" : "";
    const insert = `${lineStart}${tool.before}${selected}${tool.after ?? ""}`;
    const next = body.slice(0, start) + insert + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + lineStart.length + tool.before.length;
      el.setSelectionRange(cursor, cursor + selected.length);
    });
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setCoverOverride(undefined);
    startTransition(() => uploadAction(fd));
    e.target.value = "";
  }

  const saved = (state.saved || justCreated) && !pending && !state.error;

  return (
    <div className={styles.editor}>
      <form action={action} className={styles.stack}>
        {post && <input type="hidden" name="id" value={post.id} />}
        <input type="hidden" name="cover_url" value={cover ?? ""} />
        <input type="hidden" name="body" value={body} />

        <label className={styles.field}>
          <span>Titel</span>
          <input
            name="title"
            value={title}
            required
            maxLength={160}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </label>

        <label className={styles.field}>
          <span>URL</span>
          <div className={styles.slug}>
            <span>/blog/</span>
            <input
              name="slug"
              value={slug}
              maxLength={80}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              onBlur={() => setSlug(slugify(slug || title))}
            />
          </div>
        </label>

        <label className={styles.field}>
          <span>Kurzbeschreibung (für Übersicht und Google, max. 300 Zeichen)</span>
          <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} maxLength={300} />
        </label>

        <div className={styles.field}>
          <span>Titelbild</span>
          <div className={styles.cover}>
            {cover ? (
              // Plain img: the preview may be a local upload or any blob URL, no optimisation needed here.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" />
            ) : (
              <span className={styles.muted}>Kein Bild</span>
            )}
            <div className={styles.row}>
              <label className={styles.secondaryButton}>
                {uploading ? "Lädt hoch …" : cover ? "Bild ersetzen" : "Bild hochladen"}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onFile} hidden />
              </label>
              {cover && (
                <button type="button" className={styles.linkButton} onClick={() => setCoverOverride(null)}>
                  Entfernen
                </button>
              )}
            </div>
            {upload.error && (
              <span className={styles.error} role="alert">
                {upload.error}
              </span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.editorHead}>
            <span>Text</span>
            <div className={styles.segmented} role="tablist">
              <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}>
                Schreiben
              </button>
              <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>
                Vorschau
              </button>
            </div>
          </div>
          {tab === "write" ? (
            <>
              <div className={styles.toolbar}>
                {tools.map((t) => (
                  <button key={t.label} type="button" title={t.title} aria-label={t.title} onClick={() => applyTool(t)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={bodyRef}
                className={styles.body}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={18}
                placeholder="Schreib hier deinen Artikel …"
              />
            </>
          ) : (
            <div className={styles.preview}>{body.trim() ? <Markdown>{body}</Markdown> : <p className={styles.muted}>Noch kein Text.</p>}</div>
          )}
        </div>

        <label className={styles.check}>
          <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
          <span>Veröffentlicht (sichtbar auf der Website)</span>
        </label>

        <div className={styles.row}>
          <button className="button button-red" disabled={pending || uploading}>
            {pending ? "Speichern …" : "Speichern"}
          </button>
          <Link href="/admin/blog" className={styles.linkButton}>
            Zurück zur Liste
          </Link>
          {saved && <span className={styles.ok}>Gespeichert</span>}
          {state.error && (
            <span className={styles.error} role="alert">
              {state.error}
            </span>
          )}
        </div>
      </form>

      {post && (
        <form action={deletePost} className={styles.dangerZone}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton message="Diesen Artikel wirklich löschen? Das kann nicht rückgängig gemacht werden.">
            Artikel löschen
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}
