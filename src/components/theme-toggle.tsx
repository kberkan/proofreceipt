"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <button className="rounded-2xl border border-gray-300 px-4 py-2 text-sm dark:border-gray-700">
        Theme
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-black transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}