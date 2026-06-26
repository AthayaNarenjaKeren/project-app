import { useEffect, useState } from "react";
import axios from "axios";

function StokBarang() {
  const API_URL = "http://localhost:5001";
  const [barang, setBarang] = useState([]);

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(`${API_URL}/barang`).then((res) => {
      setBarang(res.data);
    });
  };

  const getKategori = (nama) => {
    if (nama.toLowerCase().includes("semen")) return "Material";
    if (nama.toLowerCase().includes("cat")) return "Cat";
    if (nama.toLowerCase().includes("pipa")) return "Pipa";
    if (nama.toLowerCase().includes("kayu")) return "Kayu";
    if (nama.toLowerCase().includes("paku")) return "Paku";
    if (
      nama.toLowerCase().includes("batu") ||
      nama.toLowerCase().includes("batako") ||
      nama.toLowerCase().includes("hebel")
    )
      return "Batu";
    if (nama.toLowerCase().includes("pasir")) return "Pasir";
    if (
      nama.toLowerCase().includes("keramik") ||
      nama.toLowerCase().includes("granit")
    )
      return "Keramik";
    if (
      nama.toLowerCase().includes("triplek") ||
      nama.toLowerCase().includes("multiplek") ||
      nama.toLowerCase().includes("gipsum")
    )
      return "Kayu";
    return "Lainnya";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Stok Gudang</h1>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800 text-sm">
              <th className="px-6 py-4 text-left font-bold">Nama Barang</th>
              <th className="px-6 py-4 text-center font-bold">Kategori</th>
              <th className="px-6 py-4 text-center font-bold">Stok</th>
              <th className="px-6 py-4 text-center font-bold">Status</th>
            </tr>
          </thead>

          <tbody>
            {barang.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  Belum ada data barang
                </td>
              </tr>
            ) : (
              barang.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition h-[64px]"
                >
                  <td className="px-6 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-semibold">
                        {item.nama_barang.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {item.nama_barang}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 text-center align-middle font-medium text-gray-700">
                    {getKategori(item.nama_barang)}
                  </td>

                  <td className="px-6 text-center align-middle font-semibold text-gray-800">
                    {item.stok}
                  </td>

                  <td className="px-6 text-center align-middle">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.stok <= 5
                          ? "bg-red-100 text-red-600"
                          : item.stok <= 10
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.stok <= 5
                        ? "⚠️ Stok Menipis"
                        : item.stok <= 10
                        ? "Stok Terbatas"
                        : "✅ Stok Aman"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StokBarang;
