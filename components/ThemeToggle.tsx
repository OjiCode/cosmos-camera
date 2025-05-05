"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.toggleButton} focus-visible-ring`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className={`${styles.icon} ${styles.sunIcon}`} />
      ) : (
        <MoonIcon className={`${styles.icon} ${styles.moonIcon}`} />
      )}
    </button>
  );
};
