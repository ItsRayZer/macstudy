import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "../components/ui";
import { ThemeSync } from "../components/theme-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MacStudy",
    template: "%s | MacStudy",
  },
  description:
    "Premium study companion for MGU BCA 3rd semester: track progress, revise smart, ace every exam.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MacStudy",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// Runs before first paint so the saved theme applies with no flash.
// Reads the zustand persist payload written by lib/store.ts ("macstudy-store").
const THEME_INIT = `(function(){try{var s=localStorage.getItem("macstudy-store");var t="dark";if(s){var p=JSON.parse(s);if(p&&p.state&&p.state.theme==="light"){t="light";}}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      <body className="min-h-dvh">
        <ThemeSync />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4 pb-24 pt-6">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
