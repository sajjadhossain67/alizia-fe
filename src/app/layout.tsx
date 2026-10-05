import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { ThemeProvider, ThemeScript } from "../components/ui/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alizia AI — Frontier Multimodal Intelligence",
  description:
    "Frontier multimodal AI and verifiable agent platform with deep reasoning, autonomous workflows, and hybrid search.",
  icons: {
    icon: "/favicon.svg",
    apple: "/assets/alizia-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-accent="gemini"
      dir="ltr"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased bg-[var(--color-background)] text-[var(--color-on-surface)] transition-colors duration-200">
        <ThemeProvider>
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
