import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggle = () => {
    const newMode = !darkMode;
    localStorage.setItem("darkMode", String(newMode));
    document.documentElement.classList.toggle("dark", newMode);
    setDarkMode(newMode);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
      aria-label="Toggle dark mode"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
