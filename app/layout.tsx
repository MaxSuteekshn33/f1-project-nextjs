import type { Metadata } from "next";
import {
  Inter,
  Archivo,
  Archivo_Narrow,
  JetBrains_Mono,
  Saira,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400","500","600"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["400","600","800","900"] });
const archivoNarrow = Archivo_Narrow({ variable: "--font-archivo-narrow", subsets: ["latin"], weight: ["400","600","700"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400","500","700"] });
const saira = Saira({ variable: "--font-saira", subsets: ["latin"], weight: ["400","500","600","700","800"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400","700"] });

export const metadata: Metadata = {
  title: "The F1 Project — GOAT Debates, Driver Profiles & Beginner Guides",
  description: "Explore F1 history, debate the GOAT, discover legendary drivers and learn the sport with The F1 Project.",
  icons: { icon: "/favicon-32.png", apple: "/favicon-192.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${archivoNarrow.variable} ${jetbrainsMono.variable} ${saira.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
