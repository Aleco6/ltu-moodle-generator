// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Nav from "@/components/Nav";            
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import Breadcrumbs from "@/components/Breadcrumbs";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LTU Moodle Generator",
  description: "Generates HTML + JS with inline CSS for Moodle",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [{ name: "Alexander-James Anglias" }],
  creator: "Alexander-James Anglias",
  other: { "color-scheme": "light dark" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0b0b0b" media="(prefers-color-scheme: dark)" />
        {/* Prevent theme flash: set dark class before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try{const ls=localStorage.getItem('theme');const cookie=(document.cookie.match(/(?:^|; )theme=([^;]+)/)||[])[1];const pref=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;const t=(ls||cookie||'system');const dark=(t==='dark'||(t==='system'&&pref));document.documentElement.classList.toggle('dark',!!dark);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-black dark:bg-[#0b0b0b] dark:text-white`}
      >
        <ThemeProvider>
         
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-yellow-300 focus:text-black focus:px-3 focus:py-2"
          >
            Skip to main content
          </a>

          {/* Header */}
          <header role="banner" className="border-b bg-white/70 dark:bg-black/30 border-neutral-200 dark:border-neutral-800 backdrop-blur transition-colors">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                <div aria-label="Student Number" className="font-mono text-sm">
                  Student #: 19369305
                </div>
                <Link href="/" className="text-sm font-semibold hover:underline underline-offset-4">
                  
                </Link>
              </div>
              <Nav />
            </div>
          </header>

          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Main */}
          <main id="content" role="main" className="flex-1">
            <div className="max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8">{children}</div>
          </main>

          {/* Footer */}
          <footer role="contentinfo" className="border-t bg-white/60 dark:bg-black/30 border-neutral-200 dark:border-neutral-800 backdrop-blur transition-colors">
            <div className="max-w-5xl mx-auto p-3 text-xs text-neutral-600 dark:text-neutral-300 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
              <span>© {year} Alexander-James Anglias</span>
              <span className="hidden md:inline">•</span>
              <span>Student #: 19369305</span>
              <span className="hidden md:inline">•</span>
              <time dateTime={new Date().toISOString()}>{today}</time>
              <span className="ml-auto">
                <Link href="/about" className="underline underline-offset-2 hover:no-underline">
                  About
                </Link>
              </span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
