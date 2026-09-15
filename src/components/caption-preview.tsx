"use client";

import { useRef, useState } from "react";
import { CANVAS_PX, captionGeometry, type BrandKit } from "@/lib/brand";
import { CAPTION_FONT_CSS, captionFontWeight } from "@/lib/caption-fonts";
import type { Canvas } from "@/lib/limits";

type Draft = Omit<BrandKit, "org_id" | "locked" | "version">;

/**
 * What a clip will actually look like -- and, when `onChange` is given, the
 * place you position things.
 *
 * Everything is laid out as a FRACTION of the canvas and multiplied by the
 * rendered box, using the same captionGeometry() the worker uses. That is the
 * whole point: someone sets their brand up against this picture, so if the
 * preview flatters it the mistake only shows up in a finished clip.
 *
 * Placement maps 1:1 onto what the renderer does:
 *   logo    -> ffmpeg  overlay=x=(main_w-overlay_w)*fx : y=(main_h-overlay_h)*fy
 *   caption -> ASS     \pos(fx*PlayResX, fy*PlayResY) with a centred anchor
 * so the logo fraction is a share of the TRAVEL (it can never leave the frame)
 * while the caption fraction is the position of its centre.
 *
 * The one honest difference: fonts here are the browser's, the renderer's come
 * from the worker image. Same families, so layout and colour are exact and the
 * typeface is approximate.
 */
export function CaptionPreview({ kit, canvas, logoSrc, onChange }: {
  kit: Draft;
  canvas: Canvas;
  /** Signed URL for the real logo. Without it the box is a plain placeholder. */
  logoSrc?: string | null;
  onChange?: (patch: Partial<Draft>) => void;
}) {
  const [cw, ch] = CANVAS_PX[canvas];
  const box = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<null | "logo" | "caption" | "logo-size" | "text-size">(null);
  // Click to select, like every editor: nothing is decorated until you pick it,
  // so the preview shows the clip rather than a page of controls sitting on top
  // of the thing you are judging.
  const [selected, setSelected] = useState<null | "logo" | "caption">(null);

  const geo = captionGeometry(cw, ch, {
    fontScale: kit.caption_font_scale,
    outlineW: kit.caption_outline_w,
    maxWords: kit.caption_max_words,
  });

  // Fit the canvas inside a fixed box so switching ratio doesn't resize the panel.
  const BOX_W = 260, BOX_H = 320;
  const scale = Math.min(BOX_W / cw, BOX_H / ch);
  const w = cw * scale, h = ch * scale;

  const editable = Boolean(onChange);
  const logoFx = kit.logo_x ?? 0.95;
  const logoFy = kit.logo_y ?? 0.95;
  const capFx = kit.caption_x ?? 0.5;
  const capFy = kit.caption_y ?? 0.86;

  const logoW = kit.logo_scale * cw * scale;
  // The renderer scales the logo by WIDTH and lets height follow the image
  // (ffmpeg `scale={w}:-1`), so the preview has to do the same or the box you
  // drag is not the shape you get. Measured from the image once it loads;
  // until then fall back to a square, which is closer than a guess.
  const [logoAspect, setLogoAspect] = useState(1);
  const logoH = logoW / logoAspect;
  const fontPx = geo.fontSize * scale;

  const clamp = (n: number) => Math.min(1, Math.max(0, n));

  function onPointerMove(e: React.PointerEvent) {
    if (!drag || !onChange || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;

    if (drag === "logo") {
      // Fraction of the available TRAVEL, matching the ffmpeg expression.
      const travelX = Math.max(1, w - logoW), travelY = Math.max(1, h - logoH);
      onChange({ logo_x: clamp((px - logoW / 2) / travelX),
                 logo_y: clamp((py - logoH / 2) / travelY) });
    } else if (drag === "caption") {
      onChange({ caption_x: clamp(px / w), caption_y: clamp(py / h) });
    } else if (drag === "logo-size") {
      // Any corner handle: the pointer's distance from the logo's centre sets
      // its size, on whichever axis is further out, and the image keeps its
      // proportions -- the way a corner handle works in any image editor.
      const cxp = logoFx * Math.max(1, w - logoW) + logoW / 2;
      const cyp = logoFy * Math.max(1, h - logoH) + logoH / 2;
      const half = Math.max(Math.abs(px - cxp), Math.abs(py - cyp) * logoAspect);
      onChange({ logo_scale: Math.min(0.4, Math.max(0.04, (half * 2) / w)) });
    } else if (drag === "text-size") {
      const cyp = capFy * h;
      const next = (Math.abs(py - cyp) * 2) / (geo.fontSize * scale) * kit.caption_font_scale;
      onChange({ caption_font_scale: Math.min(2, Math.max(0.5, next)) });
    }
  }

  const words = ["THIS", "IS", "YOUR", "CAPTION", "STYLE", "IN", "A", "REAL", "FRAME"];
  const shown = words.slice(0, geo.maxWords);
  const highlightAt = Math.min(1, shown.length - 1);

  return (
    <div className="space-y-2">
      <div className="flex justify-center" style={{ height: BOX_H }}>
        <div
          ref={box}
          onPointerDown={() => editable && setSelected(null)}
          onPointerMove={onPointerMove}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
          className="relative overflow-hidden rounded-lg border select-none"
          style={{
            width: w, height: h, touchAction: "none",
            // A neutral stand-in for footage: real video is busy, and a flat
            // white ground would make any light caption look readable.
            background:
              "repeating-linear-gradient(45deg,#3f3f46 0 10px,#52525b 10px 20px)",
          }}
        >
          {kit.logo_url && (
            <div
              onPointerDown={(e) => {
                if (!editable) return;
                e.preventDefault(); e.stopPropagation();
                setSelected("logo"); setDrag("logo");
              }}
              className={`absolute ${editable ? "cursor-move" : ""} ${
                selected === "logo" ? SELECTED_FRAME : ""}`}
              style={{
                left: logoFx * Math.max(0, w - logoW),
                top: logoFy * Math.max(0, h - logoH),
                width: logoW, height: logoH,
                opacity: kit.logo_opacity,
              }}
            >
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt="" draggable={false}
                     onLoad={(e) => {
                       const el = e.currentTarget;
                       if (el.naturalWidth && el.naturalHeight)
                         setLogoAspect(el.naturalWidth / el.naturalHeight);
                     }}
                     className="pointer-events-none size-full object-contain" />
              ) : (
                <div className="size-full rounded-[2px] bg-white/85" />
              )}
              {/* Only on the selected item -- a permanent marker sits on top of
                  the very thing you are trying to judge. */}
              {editable && selected === "logo" && (
                <CornerHandles onGrab={() => setDrag("logo-size")} />
              )}
            </div>
          )}

          <div
            onPointerDown={(e) => {
              if (!editable) return;
              e.preventDefault(); e.stopPropagation();
              setSelected("caption"); setDrag("caption");
            }}
            className={`absolute ${editable ? "cursor-move" : ""} ${
              selected === "caption" ? SELECTED_FRAME : ""}`}
            style={{
              left: capFx * w,
              top: capFy * h,
              transform: "translate(-50%, -50%)",
              // maxWidth, not width: the box then shrink-wraps the words, so the
              // resize handle sits ON the text instead of floating at the corner
              // of an invisible full-width block.
              maxWidth: w - geo.marginLr * 2 * scale,
              fontFamily: `${CAPTION_FONT_CSS[kit.caption_font] ?? `"${kit.caption_font}"`}, system-ui, sans-serif`,
              fontSize: fontPx,
              fontWeight: captionFontWeight(kit.caption_font),
              lineHeight: 1.15,
              // libass strokes the glyph; -webkit-text-stroke is the nearest CSS.
              WebkitTextStroke: `${Math.max(geo.outlineW * scale * 0.5, 0.4)}px ${kit.caption_outline}`,
              paintOrder: "stroke fill",
            }}
          >
            <div className="flex flex-wrap items-end justify-center gap-x-[0.25em] gap-y-[0.1em] text-center">
              {shown.map((word, i) => (
                <span key={i} style={{
                  color: i === highlightAt ? kit.caption_highlight : kit.caption_primary,
                  transform: i === highlightAt ? "scale(1.12)" : undefined,
                  display: "inline-block",
                }}>
                  {kit.caption_uppercase ? word : word.toLowerCase()}
                </span>
              ))}
            </div>
            {editable && selected === "caption" && (
              <CornerHandles onGrab={() => setDrag("text-size")} />
            )}
          </div>
        </div>
      </div>

      {editable && (
        <p className="text-muted-foreground text-center text-xs">
          {selected
            ? "Drag to move it, or pull any corner to make it bigger or smaller. Click the background to deselect."
            : "Click the logo or the caption to select it."}
        </p>
      )}
    </div>
  );
}

/** The selection frame: a thin white border with a faint dark edge, so it reads on light and dark footage. */
const SELECTED_FRAME =
  "outline outline-[1.5px] outline-white shadow-[0_0_0_2.5px_rgba(0,0,0,0.2)]";

/** Four white corner handles on the selected item, like an image editor's crop frame. */
function CornerHandles({ onGrab }: { onGrab: () => void }) {
  const corners = [
    "-left-[5px] -top-[5px] cursor-nwse-resize",
    "-right-[5px] -top-[5px] cursor-nesw-resize",
    "-left-[5px] -bottom-[5px] cursor-nesw-resize",
    "-right-[5px] -bottom-[5px] cursor-nwse-resize",
  ];
  return (
    <>
      {corners.map((pos) => (
        <span key={pos} title="Drag to resize"
              onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onGrab(); }}
              className={`absolute ${pos} size-[10px] rounded-full bg-white
                          shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.35)]`} />
      ))}
    </>
  );
}
