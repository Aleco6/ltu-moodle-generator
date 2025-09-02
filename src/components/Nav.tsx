"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },           // Tabs = homepage
  { href: "/about", label: "About" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
];

export default function Nav() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  // close mobile menu when route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="relative flex items-center gap-2">
      {/* Hamburger (always visible; add md:hidden later if desired) */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="primary-menu-popover"
        onClick={() => setMenuOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md border px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Desktop menu */}
      <nav aria-label="Primary" className="flex items-center gap-3">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`px-2 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                active ? "font-semibold underline underline-offset-4" : ""
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle from provider */}
      <ThemeToggle />

      {/* Mobile popover */}
      <div
        id="primary-menu-popover"
        className={`absolute right-0 top-full mt-2 w-56 rounded-lg border bg-white dark:bg-neutral-900 shadow-lg p-2 ${
          menuOpen ? "" : "hidden"
        } z-50`}
      >
        <nav aria-label="Primary Mobile" className="flex flex-col">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  active ? "font-semibold underline underline-offset-4" : ""
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
