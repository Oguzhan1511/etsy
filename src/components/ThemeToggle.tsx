"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 shadow-lg z-50 bg-black/40 border border-white/10 text-white/70">
        <span className="w-4 h-4 opacity-0" />
      </button>
    );
  }

  const isDark = theme === "dark" || theme === "system";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 shadow-lg z-50 cursor-pointer bg-surface border border-border text-secondary hover:text-foreground hover:bg-hover"
      title="Toggle theme"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
