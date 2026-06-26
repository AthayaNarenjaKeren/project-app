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
    <aside className="w-72 bg-white min-h-screen px-6 py-8 border-r border-gray-100 flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide leading-tight">
          GudangKasir
        </h1>
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
