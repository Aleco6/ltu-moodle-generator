import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav"; 

// Google fonts setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LTU Moodle Generator",
  description: "Generates HTML + JS with inline CSS for Moodle",
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`} >
        <header className="border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
            <div aria-label="Student Number" className="font-mono text-sm">
              Student #: 19369305
            </div>
            <Nav />
          </div>
        </header>

        {/* Main content renders here */}
        <main className="flex-1">{children}</main>

        {/* Footer with your details */}
        <footer className="border-t">
          <div className="max-w-5xl mx-auto p-3 text-xs text-gray-600">
            © {new Date().getFullYear()} Alexander-James Anglias · Student #: 19369305 ·{" "}
            {new Date().toLocaleDateString()}
          </div>
        </footer>
      </body>
    </html>
  );
}

