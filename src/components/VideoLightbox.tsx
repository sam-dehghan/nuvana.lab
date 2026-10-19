"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./VideoLightbox.module.css";

type Props = {
  src: string;
  /** Still shown on the tile and as the video's poster. */
  poster?: string | null;
  label: string;
};

/**
 * A tile that opens its clip in a modal. Uses a native <dialog>, so focus is
 * trapped, Escape closes, and focus returns to the tile on close without any
 * of that being hand-rolled.
 */
export function VideoLightbox({ src, poster, label }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    dialogRef.current?.close();
  }, []);

  function openDialog() {
    setOpen(true);
    dialogRef.current?.showModal();
  }

  // The <video> only exists after the state flip renders, so start it here
  // rather than in the click handler, where the ref is still null.
  useEffect(() => {
    if (!open) return;
    // The click that opened the dialog counts as the gesture, so sound is allowed.
    void videoRef.current?.play().catch(() => {});
  }, [open]);

  // The dialog can also be closed by Escape, which bypasses our handler.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <button type="button" className={styles.trigger} onClick={openDialog} aria-label={`${label} abspielen`}>
        {poster ? (
          <Image src={poster} alt="" fill sizes="(max-width: 560px) 50vw, 320px" className={styles.poster} />
        ) : (
          <video src={src} className={styles.poster} muted playsInline preload="metadata" aria-hidden="true" />
        )}
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" focusable="false">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={label}
        // Clicking the backdrop lands on the dialog itself, not its contents.
        onClick={(e) => e.target === dialogRef.current && close()}
      >
        <div className={styles.frame}>
          <button type="button" className={styles.close} onClick={close} aria-label="Schließen">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {open && (
            <video
              ref={videoRef}
              src={src}
              poster={poster ?? undefined}
              controls
              playsInline
              preload="metadata"
              // Hides the download and cast entries in the native menu.
              controlsList="nodownload noremoteplayback noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className={styles.video}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
