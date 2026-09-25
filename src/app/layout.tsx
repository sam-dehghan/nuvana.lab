import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const archivo = localFont({
  src: "../fonts/archivo-latin-wdth-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});

const title = "nuvana.lab | Branding & Personal Branding aus Düsseldorf";
const description =
  "Markenidentität, Personal Branding und Content aus einer Hand. nuvana.lab entwickelt Marken, die man wiedererkennt. Jetzt kostenloses Erstgespräch vereinbaren.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | nuvana.lab" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "de_DE", siteName: "nuvana.lab", title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
