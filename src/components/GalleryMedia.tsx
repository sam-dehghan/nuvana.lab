"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Path to a muted clip in /public, e.g. "/video/reel-1.mp4". */
  video?: string | null;
  /** Still shown before the clip loads, and on its own when there is no clip. */
  src?: string | null;
  sizes: string;
};

/**
 * A gallery cell. Plays the clip when there is one, otherwise shows the still.
 * Playback is driven from an effect rather than the autoplay attribute, so a
 * visitor who prefers reduced motion never sees a frame move.
 */
export function GalleryMedia({ video, src, sizes }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (motionOk) void el.play().catch(() => {});
    else el.pause();
  }, [motionOk, video]);

  if (!video) {
    return src ? <Image src={src} alt="" fill sizes={sizes} /> : null;
  }

  return (
    <video
      ref={ref}
      src={video}
      poster={src ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
