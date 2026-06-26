import { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Cek localStorage atau preferensi sistem
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    
    // Cek preferensi sistem (dark/light)
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = (isDark) => {
    setTheme(isDark ? "dark" : "light");
  };

  return { theme, toggleTheme };
};

export default useTheme;