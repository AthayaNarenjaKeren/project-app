import { useEffect, useState } from "react";
import axios from "axios";

function Laporan() {
  const [transaksi, setTransaksi] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/transaksi")
      .then((response) => {
        setTransaksi(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const grandTotal = transaksi.reduce(
    (sum, item) => sum + (item.total_harga || 0),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Laporan Transaksi
      </h1>

      {/* Total Pendapatan */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6 rounded-xl shadow-md mb-6">
        <p className="text-sm opacity-80">Total Pendapatan</p>
        <p className="text-3xl font-bold">
          Rp{grandTotal.toLocaleString("id-ID")}
        </p>
        <p className="text-sm opacity-80 mt-1">
          {transaksi.length} transaksi tercatat
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 text-left rounded-l-xl">Tanggal</th>
                <th className="p-4 text-left">Barang</th>
                <th className="p-4 text-left">Jumlah</th>
                <th className="p-4 text-left rounded-r-xl">Total</th>
              </tr>
            </thead>

            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-400">
                    Belum ada transaksi
                  </td>
                </tr>
              ) : (
                transaksi.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-4 text-gray-600">
                      {new Date(item.tanggal).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {item.nama_barang}
                    </td>
                    <td className="p-4 text-gray-600">{item.jumlah}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      Rp{(item.total_harga || 0).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Laporan;
