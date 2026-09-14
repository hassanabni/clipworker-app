import type { Canvas } from "@/lib/limits";

/**
 * Brand Kit shared vocabulary, and the caption geometry the preview draws with.
 *
 * The geometry here is a PORT of caption_geometry() in
 * clip-worker/worker/steps/captions.py. The two must agree: if the preview and
 * the renderer disagree, a customer locks a kit against a picture that is not
 * what they get, and they only find out after the fact. GEOMETRY_FIXTURES below
 * is the same table asserted in tests/test_captions_style.py -- keep both green.
 */

// Every family must exist in the worker image (the Dockerfile fails the build
// otherwise) AND in the brand_kits.caption_font CHECK constraint. Adding one
// means changing all three.
export const CAPTION_FONTS = [
  "Liberation Sans",
  "Liberation Serif",
  "DejaVu Sans",
  "DejaVu Serif",
  "DejaVu Sans Mono",
] as const;

export const CAPTION_POSITIONS = ["bottom", "middle", "top"] as const;
export const LOGO_POSITIONS = [
  "top_left", "top_right", "bottom_left", "bottom_right",
] as const;

export const LOGO_POSITION_LABEL: Record<string, string> = {
  top_left: "Top left",
  top_right: "Top right",
  bottom_left: "Bottom left",
  bottom_right: "Bottom right",
};

export type BrandKit = {
  org_id: string;
  logo_url: string | null;
  logo_position: string;
  logo_scale: number;
  logo_opacity: number;
  logo_margin: number;
  caption_font: string;
  caption_primary: string;
  caption_highlight: string;
  caption_outline: string;
  caption_outline_w: number;
  caption_position: string;
  caption_uppercase: boolean;
  caption_max_words: number | null;
  caption_font_scale: number;
  // Free placement as a fraction of the frame, 0..1. Null means "use the old
  // position preset", which is what every kit had before dragging existed.
  logo_x: number | null;
  logo_y: number | null;
  caption_x: number | null;
  caption_y: number | null;
  brand_colors: string[];
  default_canvas: Canvas;
  locked: boolean;
  version: number;
};

/** Matches the dataclass defaults in worker/models.py CaptionStyle / LogoSpec. */
export const DEFAULT_KIT: Omit<BrandKit, "org_id" | "locked" | "version"> = {
  logo_url: null,
  logo_position: "bottom_right",
  logo_scale: 0.14,
  logo_opacity: 0.9,
  logo_margin: 0.04,
  caption_font: "Liberation Sans",
  caption_primary: "#FFFFFF",
  caption_highlight: "#FED732",
  caption_outline: "#101010",
  caption_outline_w: 7,
  caption_position: "bottom",
  caption_uppercase: true,
  caption_max_words: null,
  caption_font_scale: 1.0,
  logo_x: 0.95,
  logo_y: 0.95,
  caption_x: 0.5,
  caption_y: 0.86,
  brand_colors: [],
  default_canvas: "9:16",
};

export const CANVAS_PX: Record<Canvas, [number, number]> = {
  "9:16": [1080, 1920],
  "4:5": [1080, 1350],
  "1:1": [1080, 1080],
  "16:9": [1920, 1080],
};

// --- caption geometry (port of captions.py) ---------------------------------
const REF_SHORT = 1080;
const REF_FONT = 80;
const REF_OUTLINE = 7;
const REF_MARGIN_LR = 70;
const REF_USABLE_W = REF_SHORT - 2 * REF_MARGIN_LR;
const REF_CHAR_BUDGET = 15;
const REF_MAX_WORDS = 4;

const K_MARGIN_V_TALL = 260 / 1920;
const K_MARGIN_V_SQUARE = 0.1;
const K_MARGIN_V_WIDE = 0.075;

export type Geometry = {
  fontSize: number;
  outlineW: number;
  marginLr: number;
  marginV: number;
  charBudget: number;
  maxWords: number;
};

/**
 * Python's round() is banker's rounding and JS's Math.round() is not; they
 * differ on exact .5 values. Every fixture below agrees under both, but match
 * Python's rule so a future value cannot silently diverge between preview and
 * render.
 */
function pyRound(n: number): number {
  const floor = Math.floor(n);
  const diff = n - floor;
  if (diff > 0.5) return floor + 1;
  if (diff < 0.5) return floor;
  return floor % 2 === 0 ? floor : floor + 1;
}

export function captionGeometry(
  canvasW: number,
  canvasH: number,
  opts: { fontScale?: number; outlineW?: number | null; maxWords?: number | null } = {},
): Geometry {
  const { fontScale = 1, outlineW = null, maxWords = null } = opts;
  const short = Math.min(canvasW, canvasH);
  const ratio = canvasH / canvasW;

  const k = ratio >= 1.2 ? K_MARGIN_V_TALL : ratio >= 0.9 ? K_MARGIN_V_SQUARE : K_MARGIN_V_WIDE;

  const marginLr = pyRound((REF_MARGIN_LR * canvasW) / REF_SHORT);
  const usable = canvasW - 2 * marginLr;

  return {
    fontSize: pyRound(((REF_FONT * short) / REF_SHORT) * fontScale),
    outlineW: outlineW ?? pyRound((REF_OUTLINE * short) / REF_SHORT),
    marginLr,
    marginV: pyRound(k * canvasH),
    charBudget: pyRound((REF_CHAR_BUDGET * usable) / REF_USABLE_W),
    maxWords:
      maxWords ??
      Math.min(8, Math.max(REF_MAX_WORDS, pyRound((REF_MAX_WORDS * usable) / REF_USABLE_W))),
  };
}

/**
 * The same table asserted in clip-worker/tests/test_captions_style.py. If this
 * file and captions.py ever drift, one of the two test suites goes red.
 */
export const GEOMETRY_FIXTURES: Record<Canvas, Geometry> = {
  "9:16": { fontSize: 80, outlineW: 7, marginLr: 70, marginV: 260, charBudget: 15, maxWords: 4 },
  "4:5": { fontSize: 80, outlineW: 7, marginLr: 70, marginV: 183, charBudget: 15, maxWords: 4 },
  "1:1": { fontSize: 80, outlineW: 7, marginLr: 70, marginV: 108, charBudget: 15, maxWords: 4 },
  "16:9": { fontSize: 80, outlineW: 7, marginLr: 124, marginV: 81, charBudget: 27, maxWords: 7 },
};

/**
 * A brand_kits row -> the `brand` object the worker expects on a job.
 *
 * The kit is denormalised onto each job rather than looked up at render time,
 * so a queued job renders with the kit as it was when it was filed and the
 * whole render input is visible in one jsonb cell. This mapper is the only
 * place the column names and the worker's field names meet -- keep it in step
 * with BrandKit / CaptionStyle / LogoSpec in worker/models.py.
 *
 * Numerics are coerced: PostgREST can hand back `numeric` columns as strings,
 * and the worker would then be comparing a string against a float.
 */
export function kitToJobBrand(kit: BrandKit | null) {
  const k = kit ?? ({ ...DEFAULT_KIT } as BrandKit);
  return {
    kit_version: kit?.version ?? 1,
    caption: {
      font: k.caption_font,
      primary: k.caption_primary,
      highlight: k.caption_highlight,
      outline: k.caption_outline,
      outline_w: k.caption_outline_w === null ? null : Number(k.caption_outline_w),
      position: k.caption_position,
      uppercase: Boolean(k.caption_uppercase),
      max_words: k.caption_max_words === null ? null : Number(k.caption_max_words),
      font_scale: Number(k.caption_font_scale),
      x: k.caption_x === null || k.caption_x === undefined ? null : Number(k.caption_x),
      y: k.caption_y === null || k.caption_y === undefined ? null : Number(k.caption_y),
    },
    logo: {
      // "" rather than null: the worker treats an empty url as "no logo" and
      // skips the whole compositing branch.
      url: k.logo_url ?? "",
      position: k.logo_position,
      scale: Number(k.logo_scale),
      opacity: Number(k.logo_opacity),
      margin: Number(k.logo_margin),
      x: k.logo_x === null || k.logo_x === undefined ? null : Number(k.logo_x),
      y: k.logo_y === null || k.logo_y === undefined ? null : Number(k.logo_y),
    },
  };
}

/**
 * Position presets, expressed as the SAME x/y fractions dragging produces.
 *
 * Presets and free placement are therefore one mechanism rather than two code
 * paths: picking a preset just moves the handle, and nudging the handle just
 * leaves the preset behind. That is also why there can be nine of them instead
 * of the original four corners -- they cost nothing to add.
 *
 * Logo fractions are a share of the available TRAVEL (0 = flush to the edge),
 * so 0.05 leaves a small inset. Caption fractions are the position of the text's
 * CENTRE within the frame, so they sit further in.
 */
export const LOGO_SPOTS: { label: string; x: number; y: number }[] = [
  { label: "Top left",      x: 0.05, y: 0.05 },
  { label: "Top centre",    x: 0.5,  y: 0.05 },
  { label: "Top right",     x: 0.95, y: 0.05 },
  { label: "Middle left",   x: 0.05, y: 0.5  },
  { label: "Centre",        x: 0.5,  y: 0.5  },
  { label: "Middle right",  x: 0.95, y: 0.5  },
  { label: "Bottom left",   x: 0.05, y: 0.95 },
  { label: "Bottom centre", x: 0.5,  y: 0.95 },
  { label: "Bottom right",  x: 0.95, y: 0.95 },
];

export const CAPTION_SPOTS: { label: string; x: number; y: number }[] = [
  { label: "Top left",      x: 0.28, y: 0.14 },
  { label: "Top centre",    x: 0.5,  y: 0.14 },
  { label: "Top right",     x: 0.72, y: 0.14 },
  { label: "Middle left",   x: 0.28, y: 0.5  },
  { label: "Centre",        x: 0.5,  y: 0.5  },
  { label: "Middle right",  x: 0.72, y: 0.5  },
  { label: "Bottom left",   x: 0.28, y: 0.86 },
  { label: "Bottom centre", x: 0.5,  y: 0.86 },
  { label: "Bottom right",  x: 0.72, y: 0.86 },
];

/** Which preset the current x/y is sitting on, or null once it has been dragged. */
export function matchSpot(
  spots: { label: string; x: number; y: number }[],
  x: number | null, y: number | null,
): string | null {
  if (x === null || y === null) return null;
  const near = (a: number, b: number) => Math.abs(a - b) < 0.02;
  return spots.find((s) => near(s.x, x) && near(s.y, y))?.label ?? null;
}
