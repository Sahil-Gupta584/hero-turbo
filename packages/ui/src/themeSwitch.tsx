'use client'
import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { LuSunMedium } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null; // avoid rendering until theme is ready

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded"
    >
      {theme === 'dark' ? <LuSunMedium /> : <IoMoonOutline />}
    </button>
  );
}
