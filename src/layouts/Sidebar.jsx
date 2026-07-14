import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaCashRegister,
  FaWarehouse,
  FaChartBar,
} from "react-icons/fa";

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Data Barang", path: "/data-barang", icon: <FaBox /> },
    { name: "Kasir", path: "/kasir", icon: <FaCashRegister /> },
    { name: "Stok Barang", path: "/stok-barang", icon: <FaWarehouse /> },
    { name: "Laporan", path: "/laporan", icon: <FaChartBar /> },
  ];

  return (
    <aside className="w-72 bg-base-100 min-h-screen px-6 py-8 border-r border-base-300 flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-wide leading-tight">
          GudangKasir
        </h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
