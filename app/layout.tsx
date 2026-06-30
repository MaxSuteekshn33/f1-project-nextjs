import type { Metadata } from "next";
import {
  Inter,
  Archivo,
  Archivo_Narrow,
  JetBrains_Mono,
  Saira,
  Space_Mono,
  Orbitron,
} from "next/font/google";
import "./globals.css";

const inter        = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400","500","600"] });
const archivo      = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["400","600","800","900"] });
const archivoNarrow = Archivo_Narrow({ variable: "--font-archivo-narrow", subsets: ["latin"], weight: ["400","600","700"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400","500","700"] });
const saira        = Saira({ variable: "--font-saira", subsets: ["latin"], weight: ["400","500","600","700","800"] });
const spaceMono    = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400","700"] });
const orbitron     = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["700","900"] });

const BASE_URL = "https://f1-project-nextjs.vercel.app";

export const metadata: Metadata = {
  title: "The F1 Project — GOAT Debates, Driver Profiles & Beginner Guides",
  description: "Simulate 100,000 F1 races. Debate the GOAT. Explore 19 legendary drivers. The F1 Project settles arguments with data.",
  metadataBase: new URL(BASE_URL),
  icons: { icon: "/Charles_Flavicon.jpeg", apple: "/Charles_Flavicon.jpeg" },
  openGraph: {
    title: "The F1 Project — Who is the F1 GOAT?",
    description: "Simulate 100,000 races between F1 legends. Senna vs Hamilton. Schumacher vs Verstappen. The data doesn't lie.",
    url: BASE_URL,
    siteName: "The F1 Project",
    images: [
      {
        url: "/Charles_Flavicon.jpeg",
        width: 1254,
        height: 1254,
        alt: "The F1 Project — Charles Leclerc",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "The F1 Project — Who is the F1 GOAT?",
    description: "Simulate 100,000 races between F1 legends. The data doesn't lie.",
    images: ["/Charles_Flavicon.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${archivoNarrow.variable} ${jetbrainsMono.variable} ${saira.variable} ${spaceMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
