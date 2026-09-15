"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import {
  CAPTION_FONTS, CAPTION_PRESETS, DEFAULT_KIT, LOGO_PRESETS, matchSpot, type BrandKit,
} from "@/lib/brand";
import { CAPTION_FONT_CSS } from "@/lib/caption-fonts";
import { cn } from "@/lib/utils";
import { CANVASES, MAX_LOGO_BYTES, type Canvas } from "@/lib/limits";
import { CaptionPreview } from "@/components/caption-preview";

type Draft = Omit<BrandKit, "org_id" | "locked" | "version">;

export function BrandKitForm({ kit, logoSrc, canEdit = true }:
  { kit: BrandKit | null; logoSrc?: string | null; canEdit?: boolean }) {
  const router = useRouter();
  const [d, setD] = useState<Draft>({ ...DEFAULT_KIT, ...(kit ?? {}) });
  const [previewCanvas, setPreviewCanvas] = useState<Canvas>("9:16");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Manual placement is an explicit mode. A preset snaps the item into place;
  // it only moves freely once "Manual" is picked or it is dragged in the preview
  // (which picks Manual by itself).
  const [logoManual, setLogoManual] = useState(() => !matchSpot(LOGO_PRESETS, d.logo_x, d.logo_y));
  const [captionManual, setCaptionManual] = useState(
    () => !matchSpot(CAPTION_PRESETS, d.caption_x, d.caption_y));

  const set =<K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      const r = await fetch("/api/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      toast.success("Brand kit saved. New clips will use it.");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    try {
      const r = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name, kind: "logo",
          contentType: file.type, size: file.size,
        }),
      });
      const { key, url, error } = await r.json();
      if (error) throw new Error(error);
      const put = await fetch(url, {
        method: "PUT", body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!put.ok) throw new Error("The upload was rejected. Try again.");
      set("logo_url", `storage://${key}`);
      toast.success("Logo uploaded. Save to apply it.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not upload that file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <fieldset disabled={!canEdit} className="space-y-6 disabled:opacity-70">
        <Card>
          <CardHeader><CardTitle className="text-base">Logo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Image</Label>
              <div className="flex items-center gap-3">
                <Input id="logo" type="file" accept="image/png,image/webp"
                       disabled={uploading}
                       onChange={(e) => {
                         const f = e.target.files?.[0];
                         if (!f) return;
                         if (f.size > MAX_LOGO_BYTES) {
                           toast.error("That logo is over 4MB.");
                           return;
                         }
                         void uploadLogo(f);
                       }} />
                {uploading && <Loader2 className="size-4 shrink-0 animate-spin" />}
              </div>
              <p className="text-muted-foreground text-xs">
                PNG or WebP, with a transparent background. Up to 4MB.
                {d.logo_url && " A logo is already set — choose a file to replace it."}
              </p>
            </div>

            <PositionOptions label="Position" presets={LOGO_PRESETS}
                             x={d.logo_x} y={d.logo_y} manual={logoManual}
                             manualHint="Drag the logo in the preview to place it anywhere."
                             onPreset={(x, y) => {
                               setLogoManual(false);
                               setD((p) => ({ ...p, logo_x: x, logo_y: y }));
                             }}
                             onManual={() => setLogoManual(true)} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider label="Size" value={d.logo_scale} min={0.04} max={0.4} step={0.01}
                      format={(v) => `${Math.round(v * 100)}% of width`}
                      onChange={(v) => set("logo_scale", v)} />
              <Slider label="Opacity" value={d.logo_opacity} min={0.1} max={1} step={0.05}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(v) => set("logo_opacity", v)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Brand colours</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-xs">
              Your palette. These do nothing on their own — they are the swatches
              offered wherever a colour is picked below, so a caption gets an
              exact brand colour instead of one chosen by eye from a colour wheel.
            </p>
            <Palette values={d.brand_colors ?? []}
                     onChange={(v) => set("brand_colors", v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Captions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Font">
                <Select value={d.caption_font} onValueChange={(v) => set("caption_font", v)}>
                  <SelectTrigger className="w-full" style={{ fontFamily: CAPTION_FONT_CSS[d.caption_font] }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAPTION_FONTS.map((f) => (
                      <SelectItem key={f} value={f} style={{ fontFamily: CAPTION_FONT_CSS[f] }}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

            </div>

            <PositionOptions label="Position" presets={CAPTION_PRESETS}
                             x={d.caption_x} y={d.caption_y} manual={captionManual}
                             manualHint="Drag the captions in the preview to place them anywhere."
                             onPreset={(x, y) => {
                               setCaptionManual(false);
                               setD((p) => ({ ...p, caption_x: x, caption_y: y }));
                             }}
                             onManual={() => setCaptionManual(true)} />

            <div className="grid gap-4 sm:grid-cols-3">
              <Colour label="Text" value={d.caption_primary} swatches={d.brand_colors ?? []}
                      onChange={(v) => set("caption_primary", v)} />
              <Colour label="Highlight" value={d.caption_highlight} swatches={d.brand_colors ?? []}
                      onChange={(v) => set("caption_highlight", v)} />
              <Colour label="Outline" value={d.caption_outline} swatches={d.brand_colors ?? []}
                      onChange={(v) => set("caption_outline", v)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider label="Text size" value={d.caption_font_scale} min={0.5} max={2} step={0.05}
                      format={(v) => `${v.toFixed(2)}×`}
                      onChange={(v) => set("caption_font_scale", v)} />
              <Slider label="Outline weight" value={d.caption_outline_w} min={0} max={20} step={1}
                      format={(v) => String(v)}
                      onChange={(v) => set("caption_outline_w", Math.round(v))} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="upper" className="text-sm">Uppercase</Label>
                <p className="text-muted-foreground text-xs">
                  Captions are set in capitals.
                </p>
              </div>
              <Switch id="upper" checked={d.caption_uppercase}
                      onCheckedChange={(v) => set("caption_uppercase", v)} />
            </div>
          </CardContent>
        </Card>


        {!canEdit ? (
          <p className="text-muted-foreground rounded-lg border p-3 text-xs">
            This is your workspace&apos;s brand kit. Only an owner or admin can
            change it — that is what keeps every clip looking the same.
          </p>
        ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" type="button"
                  onClick={() => {
                    setLogoManual(false); setCaptionManual(false);
                    setD((p) => ({ ...p,
                      logo_x: 0.95, logo_y: 0.95, caption_x: 0.5, caption_y: 0.86 }));
                  }}>
            Reset positions
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />} Save
          </Button>
          <p className="text-muted-foreground text-xs">
            Applies to every clip made from here on. Clips already rendered keep
            the styling they were made with.
          </p>
        </div>
        )}
      </fieldset>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={previewCanvas} onValueChange={(v) => setPreviewCanvas(v as Canvas)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CANVASES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <CaptionPreview kit={d} canvas={previewCanvas} logoSrc={logoSrc}
                            onChange={canEdit
                              ? (patch) => {
                                  // Dragging something in the preview is choosing Manual.
                                  if ("logo_x" in patch || "logo_y" in patch) setLogoManual(true);
                                  if ("caption_x" in patch || "caption_y" in patch) setCaptionManual(true);
                                  setD((prev) => ({ ...prev, ...patch }));
                                }
                              : undefined} />
            <p className="text-muted-foreground text-xs">
              Drawn with the same sizing rules the renderer uses, so what you see
              is where the text and logo land in the finished clip.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

/**
 * Where the logo or the captions sit: named presets plus "Manual".
 *
 * Presets and manual placement write the same x/y fractions the renderer reads,
 * so there is still one mechanism underneath. Manual is what makes free
 * movement a deliberate choice: a preset snaps the item into place, and it
 * moves freely only once Manual is picked -- or once it is dragged in the
 * preview, which switches to Manual by itself.
 */
function PositionOptions({ label, presets, x, y, manual, manualHint, onPreset, onManual }: {
  label: string;
  presets: { label: string; x: number; y: number }[];
  x: number | null; y: number | null;
  manual: boolean;
  manualHint: string;
  onPreset: (x: number, y: number) => void;
  onManual: () => void;
}) {
  const current = (manual ? null : matchSpot(presets, x, y)) ?? "Manual";
  const options = [...presets.map((p) => p.label), "Manual"];
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((name) => {
          const on = current === name;
          return (
            <button key={name} type="button" role="radio" aria-checked={on}
                    onClick={() => {
                      const p = presets.find((s) => s.label === name);
                      if (p) onPreset(p.x, p.y);
                      else onManual();
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      on ? "border-primary bg-primary text-white"
                         : "border-border text-muted-foreground hover:text-foreground bg-white hover:border-[#c0bfb8]")}>
              {name}
            </button>
          );
        })}
      </div>
      {current === "Manual" && (
        <p className="text-muted-foreground text-xs">{manualHint}</p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Colour({ label, value, swatches = [], onChange }: {
  label: string; value: string; swatches?: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} aria-label={label}
               onChange={(e) => onChange(e.target.value.toUpperCase())}
               className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent" />
        <Input value={value} spellCheck={false}
               onChange={(e) => onChange(e.target.value.toUpperCase())}
               className="font-mono text-xs" />
      </div>
      {swatches.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {swatches.map((c) => (
            <button key={c} type="button" title={`${label}: ${c}`}
                    aria-label={`Use ${c} for ${label.toLowerCase()}`}
                    onClick={() => onChange(c.toUpperCase())}
                    style={{ background: c }}
                    className={`size-5 rounded-sm border transition-transform hover:scale-110 ${
                      c.toUpperCase() === value.toUpperCase()
                        ? "ring-brand ring-2 ring-offset-1"
                        : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The workspace palette.
 *
 * Deliberately just a list of hex values with no names or roles attached.
 * A "primary/secondary/accent" scheme reads well until a company has five
 * colours or two primaries, and nothing in the renderer consumes the
 * distinction anyway -- what the picker needs is the set of colours that are
 * allowed to appear, and that is exactly what this is.
 */
const MAX_BRAND_COLOURS = 12;

function Palette({ values, onChange }:
  { values: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("#2563EB");
  const full = values.length >= MAX_BRAND_COLOURS;

  function add() {
    const hex = draft.toUpperCase();
    // Silently ignoring a duplicate is right here: the user's intent ("this
    // colour is one of ours") is already satisfied, so an error would be
    // pedantry about a state they already have.
    if (!values.some((v) => v.toUpperCase() === hex) && !full) onChange([...values, hex]);
  }

  return (
    <div className="space-y-3">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((c) => (
            <div key={c} className="group relative">
              <div style={{ background: c }}
                   className="size-10 rounded-md border shadow-sm" />
              <button type="button" aria-label={`Remove ${c}`}
                      onClick={() => onChange(values.filter((v) => v !== c))}
                      className="bg-background absolute -top-1.5 -right-1.5 grid size-4 place-items-center
                                 rounded-full border opacity-0 shadow transition-opacity
                                 group-hover:opacity-100 focus:opacity-100">
                <X className="size-2.5" />
              </button>
              <div className="text-muted-foreground mt-1 text-center font-mono text-[10px]">
                {c.replace("#", "")}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input type="color" value={draft} aria-label="New brand colour"
               onChange={(e) => setDraft(e.target.value)}
               className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent" />
        <Input value={draft} spellCheck={false} aria-label="New brand colour hex"
               onChange={(e) => setDraft(e.target.value.toUpperCase())}
               className="max-w-28 font-mono text-xs" />
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={full}>
          <Plus className="size-4" /> Add
        </Button>
        {full && (
          <span className="text-muted-foreground text-xs">
            {MAX_BRAND_COLOURS} is the limit.
          </span>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="text-muted-foreground font-mono text-xs">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             aria-label={label}
             onChange={(e) => onChange(Number(e.target.value))}
             className="accent-brand h-2 w-full cursor-pointer" />
    </div>
  );
}
