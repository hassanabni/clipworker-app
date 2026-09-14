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

/** Largest brand logo. A logo is a small mark, not artwork. */
export const MAX_LOGO_BYTES = 4 * 1024 * 1024; // 4MB

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
  // PNG and WebP only: ffmpeg cannot decode SVG without librsvg, and a logo
  // needs an alpha channel to composite as a mark rather than a white box.
  logo: ["image/png", "image/webp"],
} as const;

export type UploadKind = keyof typeof ACCEPTED;

export const maxBytesFor = (kind: string) =>
  kind === "main" ? MAX_UPLOAD_BYTES
  : kind === "logo" ? MAX_LOGO_BYTES
  : MAX_ASSET_BYTES;

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
    return `That does not look like ${DESCRIBES[kind as UploadKind] ?? "the right kind of"} file.`;

  return null;
}

const DESCRIBES: Record<UploadKind, string> = {
  main: "a video",
  overlay: "a video or image",
  music: "an audio",
  logo: "a PNG or WebP image",
};

/**
 * Output shapes. The worker owns the pixel dimensions (worker/config.py CANVAS);
 * these are the names that travel in the job payload, and they must match its
 * keys exactly or the job fails with "unsupported aspect ratio".
 */
/**
 * How many reels one upload can produce. The judge already ranks and
 * de-duplicates several distinct moments; this is how many of them get cut.
 *
 * DEFAULT_CLIP_COUNT is 1 while renders are being verified end to end. The
 * product intent is 5 -- change this one constant when you are happy with the
 * output, and both the form and the API default move together.
 */
export const MAX_CLIP_COUNT = 5;
export const DEFAULT_CLIP_COUNT = 1;

export const CANVASES = ["9:16", "4:5", "1:1", "16:9"] as const;
export type Canvas = (typeof CANVASES)[number];

export const CANVAS_LABEL: Record<Canvas, string> = {
  "9:16": "Vertical — Reels, TikTok, Shorts",
  "4:5": "Portrait — feed posts",
  "1:1": "Square — feed posts",
  "16:9": "Wide — YouTube, LinkedIn, screens",
};

export const isCanvas = (v: unknown): v is Canvas =>
  typeof v === "string" && (CANVASES as readonly string[]).includes(v);
