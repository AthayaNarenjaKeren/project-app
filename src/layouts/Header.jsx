import { useState, useEffect } from "react";

function Header() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="h-24 bg-base-100 flex items-center justify-between px-8 border-b border-base-300">
      <div className="bg-base-200 rounded-full px-6 py-3 w-96 text-base-content/70">
        Cari barang atau transaksi...
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-base-content">
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
        </div>

        <div className="text-right">
          <h3 className="font-semibold text-base-content">Admin Toko</h3>
          <p className="text-base-content/60 text-sm">Flora Banguntama</p>
        </div>

        <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}

export default Header;
