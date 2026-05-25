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
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-10">
        GudangKasir
      </h1>

      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-4 rounded-2xl transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;