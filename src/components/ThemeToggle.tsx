"use client";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="ml-1 inline-flex items-center justify-center rounded-md border px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-pressed={theme === "dark"}
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden>{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
