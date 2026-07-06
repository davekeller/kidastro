import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ColorBar from "@/components/ColorBar";
import Starfield from "@/components/Starfield";
import NorthernLights from "@/components/NorthernLights";

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
  title: "Dave Keller — Lead Product Designer & Design Engineer",
  description: "Dave Keller — design engineer / lead product designer. 15+ years designing and shipping front-ends for hard, technical AI and data products.",
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
      </body>
    </html>
  );
}
