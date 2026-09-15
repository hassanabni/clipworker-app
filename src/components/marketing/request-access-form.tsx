"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * A fixed list rather than Intl.DisplayNames: Node's ICU and the browser's name
 * some regions differently ("Hong Kong" vs "Hong Kong SAR China"), which breaks
 * hydration of the server-rendered <select>.
 */
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
  "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus",
  "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const label = "mb-[8px] block text-[15px] leading-[22px] font-semibold tracking-[0.2px] text-[#1b1c1a]";
const field =
  "w-full rounded-[6px] border border-[#d9dce1] bg-[#f5f6f8] px-[14px] text-[16px] text-[#1b1c1a] " +
  "outline-none transition-colors placeholder:text-[#9ca3af] focus:border-primary focus:bg-white " +
  "focus:ring-3 focus:ring-primary/15";

function Req() {
  return <span aria-hidden className="text-[#e11d48]">*</span>;
}

export function RequestAccessForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [sent, setSent] = useState({ first: "", email: "" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: document.referrer }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      setSent({ first: data.first_name ?? "", email: data.email ?? "" });
      setStatus("done");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-start gap-[16px] rounded-[20px] bg-white p-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] md:p-[44px]">
        <CircleCheck className="text-primary size-[40px]" />
        <h2 className="font-display text-[32px] leading-[40px]">Thanks{sent.first ? `, ${sent.first}` : ""}.</h2>
        <p className="text-muted-foreground text-[16px] leading-[26px]">
          We&apos;ve got your request. Someone from the team will reach out
          {sent.email ? <> at <strong className="text-foreground font-semibold">{sent.email}</strong></> : null} to
          set up your demo.
        </p>
        <Link href="/product" className="text-primary text-[14px] font-semibold hover:underline">
          Meanwhile, see what Mira does →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}
          className="flex flex-col gap-[22px] rounded-[20px] bg-white p-[28px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] md:p-[44px]">
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-[22px] sm:grid-cols-2">
        <div>
          <label htmlFor="ra-first" className={label}>First Name<Req /></label>
          <input id="ra-first" name="first_name" required maxLength={100} autoComplete="given-name"
                 className={`${field} h-[50px]`} />
        </div>
        <div>
          <label htmlFor="ra-last" className={label}>Last Name<Req /></label>
          <input id="ra-last" name="last_name" required maxLength={100} autoComplete="family-name"
                 className={`${field} h-[50px]`} />
        </div>
      </div>

      <div>
        <label htmlFor="ra-email" className={label}>Email<Req /></label>
        <input id="ra-email" name="email" type="email" required maxLength={320} autoComplete="email"
               placeholder="you@company.com" className={`${field} h-[50px]`} />
      </div>

      <div className="grid gap-[22px] sm:grid-cols-2">
        <div>
          <label htmlFor="ra-phone" className={label}>Phone Number</label>
          <input id="ra-phone" name="phone" type="tel" maxLength={40} autoComplete="tel"
                 className={`${field} h-[50px]`} />
        </div>
        <div>
          <label htmlFor="ra-country" className={label}>Country</label>
          <select id="ra-country" name="country" defaultValue="" autoComplete="country-name"
                  className={`${field} h-[50px] appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22><path d=%22M1 1.5l5 5 5-5%22 fill=%22none%22 stroke=%22%2345464c%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px_8px] bg-[position:right_14px_center] bg-no-repeat pr-[36px]`}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ra-more" className={label}>Tell us more about you</label>
        <textarea id="ra-more" name="message" rows={4} maxLength={4000}
                  placeholder="Your company, your team, and what you'd like to use Mira for."
                  className={`${field} resize-y py-[12px] leading-[24px]`} />
      </div>

      <p className="text-muted-foreground text-[14px] leading-[23px]">
        By submitting this form, you agree to clipworker storing and processing
        your information to respond to your request. Please review our{" "}
        <Link href="/privacy" className="text-foreground underline underline-offset-2">Privacy Policy</Link>{" "}
        for more information.
      </p>

      {status === "error" && (
        <p role="alert" className="rounded-[6px] bg-[#fef2f2] px-[14px] py-[10px] text-[14px] leading-[22px] text-[#b91c1c]">
          {error}{" "}
          <span className="text-[#7f1d1d]">You can also email us at {CONTACT_EMAIL}.</span>
        </p>
      )}

      <div>
        <button type="submit" disabled={status === "sending"}
                className="rounded-[6px] bg-[#111827] px-[40px] py-[15px] text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
          {status === "sending" ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
