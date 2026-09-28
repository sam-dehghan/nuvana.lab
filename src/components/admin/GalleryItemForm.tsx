"use client";

import { useActionState, useRef, useState } from "react";
import { saveItem, signUpload, type GalleryState } from "@/app/admin/gallery/actions";
import type { GalleryItem } from "@/lib/content";
import styles from "@/app/admin/admin.module.css";

const MAX_BYTES = 20 * 1024 * 1024;

export function GalleryItemForm({ item }: { item: GalleryItem }) {
  const [state, action, pending] = useActionState<GalleryState, FormData>(saveItem, {});
  const [src, setSrc] = useState(item.src ?? "");
  const [video, setVideo] = useState(item.video ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const srcRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  async function upload(field: "src" | "video", file: File) {
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
      // Straight to Supabase; the file never goes through the server.
      const res = await fetch(signed.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!res.ok) {
        setError(`Upload fehlgeschlagen (${res.status}).`);
        return;
      }
      if (field === "src") setSrc(signed.publicUrl);
      else setVideo(signed.publicUrl);
    } catch {
      setError("Upload fehlgeschlagen.");
    } finally {
      setBusy(null);
      const input = field === "src" ? srcRef.current : videoRef.current;
      if (input) input.value = "";
    }
  }

  return (
    <form action={action} className={styles.galleryForm}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="src" value={src} />
      <input type="hidden" name="video" value={video} />

      {item.kind === "tile" && (
        <label className={styles.field}>
          <span>Titel</span>
          <input name="label" defaultValue={item.label} maxLength={60} />
        </label>
      )}

      <div className={styles.galleryUploads}>
        <label className={styles.field}>
          <span>{item.kind === "reel" ? "Video (9:16)" : "Video (16:9)"}</span>
          <input
            ref={videoRef}
            type="file"
            accept="video/mp4,video/webm"
            disabled={busy !== null}
            onChange={(e) => e.target.files?.[0] && upload("video", e.target.files[0])}
          />
          {video && <small>{busy === "video" ? "Lädt …" : "Video gesetzt"}</small>}
        </label>

        <label className={styles.field}>
          <span>Vorschaubild</span>
          <input
            ref={srcRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy !== null}
            onChange={(e) => e.target.files?.[0] && upload("src", e.target.files[0])}
          />
          {src && <small>{busy === "src" ? "Lädt …" : "Bild gesetzt"}</small>}
        </label>
      </div>

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
