"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Cookie helpers
function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
}
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
];

export default function Nav() {
  const pathname = usePathname();

  // Write current path into a cookie whenever it changes
  useEffect(() => {
    if (pathname) setCookie("lastPath", pathname);
  }, [pathname]);

  // Read the last path from the cookie
  const lastPath =
    typeof window !== "undefined" ? decodeURIComponent(getCookie("lastPath") || "") : "";

  return (
    <nav aria-label="Primary" className="text-sm">
      {links.map((l) => {
        const isActive = (pathname || lastPath) === l.href;
        return (
          <a
            key={l.href}
            href={l.href}
            aria-current={isActive ? "page" : undefined}
            className={`mr-3 inline-block pb-1 ${
              isActive ? "border-b-2" : "border-b-0"
            }`}
          >
            {l.label}
          </a>
        );
      })}
    </nav>
  );
}
