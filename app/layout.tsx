import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import "./globals.css";
import ColorBar from "@/components/ColorBar";

const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--font-pacifico" });

export const metadata: Metadata = {
  title: "Dave Keller + Product Designer + Austin Texas",
  description: "Dave Keller is a product designer in Austin, Texas",
  keywords: "Dave Keller, User Experience Designer, User Interface Designer, UX Designer, UI Designer, UX/UI",
  openGraph: {
    images: ["https://kidastro.com/imgs/thumbnail.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${pacifico.variable} bg-black text-white`}>
        <ColorBar />
        {children}
      </body>
    </html>
  );
}
