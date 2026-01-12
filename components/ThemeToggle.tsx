'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() =>
  setTheme(resolvedTheme === "dark" ? "light" : "dark")
}
      className="relative w-9 h-9 text-black rounded-lg border border-gray-200 dark:border-gray-700   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {resolvedTheme !== "dark" ? <Sun className="h-4 w-4  rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      :<Moon className="absolute h-4 w-4 text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
    </button>
  );
}