"use client";

import { useActionState, useRef, useState } from "react";
import { saveClient, type ClientState } from "@/app/admin/clients/actions";
import { signUpload } from "@/app/admin/gallery/actions";
import type { Client } from "@/lib/content";
import styles from "@/app/admin/admin.module.css";

const MAX_BYTES = 20 * 1024 * 1024;

export function ClientForm({ item }: { item: Client }) {
  const [state, action, pending] = useActionState<ClientState, FormData>(saveClient, {});
  const [logo, setLogo] = useState(item.logo ?? "");
  const [photo, setPhoto] = useState(item.photo ?? "");
  const [scale, setScale] = useState(item.scale);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  async function upload(field: "logo" | "photo", file: File) {
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
      if (field === "logo") setLogo(signed.publicUrl);
      else setPhoto(signed.publicUrl);
    } catch {
      setError("Upload fehlgeschlagen.");
    } finally {
      setBusy(null);
      const input = field === "logo" ? logoRef.current : photoRef.current;
      if (input) input.value = "";
    }
  }

  return (
    <form action={action} className={styles.galleryForm}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="logo" value={logo} />
      <input type="hidden" name="photo" value={photo} />

      <label className={styles.field}>
        <span>Name</span>
        <input name="name" defaultValue={item.name} maxLength={80} />
      </label>

      <div className={styles.galleryUploads}>
        <label className={styles.field}>
          <span>Logo (PNG oder SVG mit transparentem Hintergrund)</span>
          <input
            ref={logoRef}
            type="file"
            accept="image/png,image/webp,image/avif,image/jpeg,image/svg+xml"
            disabled={busy !== null}
            onChange={(e) => e.target.files?.[0] && upload("logo", e.target.files[0])}
          />
          {logo && <small>{busy === "logo" ? "Lädt …" : "Logo gesetzt"}</small>}
        </label>

        <label className={styles.field}>
          <span>Projektfoto (Rückseite)</span>
          <input
            ref={photoRef}
            type="file"
            accept="image/png,image/webp,image/avif,image/jpeg"
            disabled={busy !== null}
            onChange={(e) => e.target.files?.[0] && upload("photo", e.target.files[0])}
          />
          {photo && <small>{busy === "photo" ? "Lädt …" : "Foto gesetzt"}</small>}
        </label>
      </div>

      <div className={styles.field}>
        <span>Größe: {scale}%</span>
        <input
          type="range"
          name="scale"
          min={40}
          max={160}
          step={5}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />
        <small>Schieb, bis das Logo in der Kachel sitzt. 100% ist die Standardgröße.</small>
      </div>

      {/* Same shape and rules as the tile on the site, so what you see here is what ships. */}
      <div className={styles.logoPreview} style={{ ["--logo-scale" as string]: scale / 100 }}>
        {logo ? (
          // Not next/image: the preview points straight at the uploaded url.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" />
        ) : (
          <span>Logo folgt</span>
        )}
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
