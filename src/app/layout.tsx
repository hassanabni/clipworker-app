import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { WhatsAppButton } from "@/components/whatsapp-button";
import "./globals.css";

// The two families the Figma uses. Newsreader carries every display heading
// (including its italic, which the design leans on for emphasis); Plus Jakarta
// Sans carries all UI and body copy.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "clipworker — say what your clip is about",
  description:
    "Upload the whole video and describe the moment you want. It finds it, crops to the speaker, and burns in captions — no scrubbing for timestamps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
