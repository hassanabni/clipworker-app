import { Bebas_Neue, Inter, Montserrat, Poppins, Roboto } from "next/font/google";

/**
 * The browser copies of the five caption faces, for the brand kit preview and
 * the font picker.
 *
 * next/font renames every family to a hashed name, so the preview cannot just
 * say font-family: "Montserrat" -- it has to use the name these objects hand
 * back. The worker image installs the same families from Ubuntu's packages
 * (Poppins from Google Fonts), and captions render with Bold on, so the preview
 * loads the 700 weight to match. Bebas Neue ships as a single heavy weight.
 */
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["700"], display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["700"], display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["700"], display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", display: "swap" });

export const CAPTION_FONT_CSS: Record<string, string> = {
  Montserrat: montserrat.style.fontFamily,
  Poppins: poppins.style.fontFamily,
  Inter: inter.style.fontFamily,
  Roboto: roboto.style.fontFamily,
  "Bebas Neue": bebas.style.fontFamily,
};

/** The CSS weight that matches the rendered caption for a family. */
export const captionFontWeight = (family: string) => (family === "Bebas Neue" ? 400 : 700);
