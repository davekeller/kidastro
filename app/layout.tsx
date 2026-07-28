import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ColorBar from "@/components/ColorBar";
import Starfield from "@/components/Starfield";
import NorthernLights from "@/components/NorthernLights";
import ControlCenter from "@/components/control-center/ControlCenter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kidastro.com"),
  title: {
    default: "Dave Keller — Lead Product Designer & Design Engineer",
    template: "%s — Dave Keller",
  },
  description:
    "Design engineer and lead product designer with 15+ years shipping hard, technical products — AI, quantum, and data science. Figma expert, prototyping and shipping production code with agentic coding — Claude Code and Codex.",
  keywords: [
    "product designer",
    "design engineer",
    "front-end engineer",
    "lead product designer",
    "UX designer",
    "Figma",
    "design systems",
    "AI product design",
    "agentic coding",
    "Claude Code",
    "Codex",
    "portfolio",
    "Dave Keller",
  ],
  authors: [{ name: "Dave Keller", url: "https://kidastro.com" }],
  creator: "Dave Keller",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Dave Keller — Portfolio",
    locale: "en_US",
    title: "Dave Keller — Lead Product Designer & Design Engineer",
    description:
      "15+ years shipping hard, technical products — AI, quantum, and data science. Figma expert and design engineer, prototyping and shipping in code with Claude Code and Codex.",
    images: [
      {
        url: "/imgs/strangeworks/strange1.png",
        width: 2640,
        height: 912,
        alt: "Aura — AI-assisted optimization workflow app designed by Dave Keller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dave Keller — Lead Product Designer & Design Engineer",
    description:
      "Design engineer and Figma expert — 15+ years shipping hard, technical products with agentic coding (Claude Code and Codex).",
    images: ["/imgs/strangeworks/strange1.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bricolage.variable} antialiased`}>
        <div className="site-chrome">
          <NorthernLights />
          <Starfield />
          <ColorBar />
        </div>
        {children}
        <ControlCenter />
      </body>
    </html>
  );
}
