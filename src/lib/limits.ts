// Every user-facing limit, in one place.
//
// These numbers were spread across a client constant, a form validator and
// nothing at all on the server. The browser copy is a courtesy -- it gives a
// good error before a long upload -- but it is NOT a limit: anyone can call the
// API directly. Each rule here must also be enforced somewhere the client
// cannot reach (a signed ContentLength, a route handler, or a DB trigger).

/** Largest source video, in bytes. Enforced by R2 via a signed ContentLength. */
export const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1GB

/** Largest overlay / music asset. */
export const MAX_ASSET_BYTES = 128 * 1024 * 1024; // 128MB

/** Longest source video, in seconds. Enforced in the worker after probing. */
export const MAX_SOURCE_SECONDS = 60 * 60; // 60 min

/** Longest search query. Anything past this is abuse, not a description. */
export const MAX_QUERY_CHARS = 300;

/** Bounds on a manual trim, in seconds. */
export const MIN_CLIP_SECONDS = 3;
export const MAX_CLIP_SECONDS = 180;

/** What each upload slot will accept. Checked against the declared MIME type. */
export const ACCEPTED = {
  main: ["video/"],
  overlay: ["video/", "image/"],
  music: ["audio/"],
} as const;

export type UploadKind = keyof typeof ACCEPTED;

export const maxBytesFor = (kind: string) =>
  kind === "main" ? MAX_UPLOAD_BYTES : MAX_ASSET_BYTES;

export function humanBytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(n % 1024 ** 3 === 0 ? 0 : 1)}GB`;
  return `${Math.round(n / 1024 ** 2)}MB`;
}

/** null when acceptable, otherwise a message safe to show a user. */
export function checkUpload(kind: string, size: number, contentType: string): string | null {
  const prefixes = ACCEPTED[kind as UploadKind];
  if (!prefixes) return `Unknown upload type ${kind}.`;

  if (!Number.isFinite(size) || size <= 0) return "That file looks empty.";
  const max = maxBytesFor(kind);
  if (size > max)
    return `That file is ${humanBytes(size)}. The limit is ${humanBytes(max)}.`;

  // A declared type is not proof of content, but it costs nothing to reject the
  // obvious cases before handing out a URL that can write to the bucket.
  const ct = (contentType || "").toLowerCase();
  if (!prefixes.some((p) => ct.startsWith(p)))
    return `That does not look like ${kind === "music" ? "an audio" : "a video"} file.`;

  return null;
}
