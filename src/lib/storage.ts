import "server-only";
import { randomUUID } from "node:crypto";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.SUPABASE_S3_ENDPOINT;
const region = process.env.SUPABASE_S3_REGION;
const bucket = process.env.SUPABASE_S3_BUCKET;
const accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY;

export const storageConfigured = Boolean(
  endpoint && region && bucket && accessKeyId && secretAccessKey,
);

/** Supabase caps uploads per bucket; ours is set to 20 MB. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const UPLOAD_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

let client: S3Client | null = null;
function s3(): S3Client {
  if (!storageConfigured) throw new Error("Supabase S3 is not configured.");
  // forcePathStyle: Supabase serves buckets as a path, not a subdomain.
  client ??= new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
  });
  return client;
}

/**
 * A short-lived PUT url the browser uploads to directly. Routing the file
 * through a server action instead would cap it at Vercel's ~4.5 MB body limit.
 */
export async function presignUpload(contentType: string) {
  const ext = UPLOAD_TYPES[contentType];
  if (!ext) throw new Error("Unsupported type.");
  const key = `gallery/${randomUUID()}.${ext}`;
  const url = await getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 60 },
  );
  return { url, key, publicUrl: publicUrlFor(key) };
}

/** The bucket is public, so reads need no signature. */
export function publicUrlFor(key: string) {
  const base = endpoint!.replace(/\/storage\/v1\/s3\/?$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${key}`;
}

export async function deleteObject(key: string) {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** Recovers the object key from a public url, for deletes. */
export function keyFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}
