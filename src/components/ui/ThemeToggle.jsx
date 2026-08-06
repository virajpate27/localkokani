// src/components/ui/ThemeToggle.jsx
"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, isLoaded } = useTheme();

  if (!isLoaded) {
    // Reserve the same space to avoid layout shift while theme loads
    return <div className={`w-11 h-11 rounded-full ${className}`} />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`w-11 h-11 rounded-full flex items-center justify-center dark:bg-gray-800 dark:bg-gray-800 hover:bg-secondary hover:text-white dark:hover:bg-secondary transition-colors ${className}`}
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );
}