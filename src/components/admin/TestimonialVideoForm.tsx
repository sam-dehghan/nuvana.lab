"use client";

import { useActionState, useRef, useState } from "react";
import { signUpload } from "@/app/admin/gallery/actions";
import { saveVideo, type VideoState } from "@/app/admin/testimonials/actions";
import type { TestimonialVideo } from "@/lib/content";
import styles from "@/app/admin/admin.module.css";

const MAX_BYTES = 20 * 1024 * 1024;

export function TestimonialVideoForm({ item }: { item: TestimonialVideo }) {
  const [state, action, pending] = useActionState<VideoState, FormData>(saveVideo, {});
  const [src, setSrc] = useState(item.src ?? "");
  const [poster, setPoster] = useState(item.poster ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const srcRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);

  async function upload(field: "src" | "poster", file: File) {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError("Die Datei ist größer als 20 MB.");
      return;
    }
    setBusy(field);
    try {
      const fd = new FormData();
      fd.set("contentType", file.type);
      const signed = await signUpload({}, fd);
      if (signed.error || !signed.url || !signed.publicUrl) {
        setError(signed.error ?? "Upload fehlgeschlagen.");
        return;
      }
      const res = await fetch(signed.url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!res.ok) {
        setError(`Upload fehlgeschlagen (${res.status}).`);
        return;
      }
      if (field === "src") setSrc(signed.publicUrl);
      else setPoster(signed.publicUrl);
    } catch {
      setError("Upload fehlgeschlagen.");
    } finally {
      setBusy(null);
      const input = field === "src" ? srcRef.current : posterRef.current;
      if (input) input.value = "";
    }
  }

  return (
    <form action={action} className={styles.galleryForm}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="src" value={src} />
      <input type="hidden" name="poster" value={poster} />

      <div className={styles.galleryUploads}>
        <label className={styles.field}>
          <span>Video (hochkant, 9:16)</span>
          <input
            ref={srcRef}
            type="file"
            accept="video/mp4,video/webm"
            disabled={busy !== null}
            onChange={(e) => e.target.files?.[0] && upload("src", e.target.files[0])}
          />
          {src && <small>{busy === "src" ? "Lädt …" : "Video gesetzt"}</small>}
        </label>

        <label className={styles.field}>
          <span>Vorschaubild</span>
          <input
            ref={posterRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy !== null}
            onChange={(e) => e.target.files?.[0] && upload("poster", e.target.files[0])}
          />
          {poster && <small>{busy === "poster" ? "Lädt …" : "Bild gesetzt"}</small>}
        </label>
      </div>

      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className={styles.posterPreview} />
      )}

      {(error || state.error) && (
        <p className={styles.error} role="alert">
          {error ?? state.error}
        </p>
      )}

      <button className="button button-red" disabled={pending || busy !== null}>
        {pending ? "Speichern …" : "Speichern"}
      </button>
    </form>
  );
}
