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

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Laporan Transaksi</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Tanggal</th>
              <th className="p-3">Barang</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {transaksi.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">
                  {new Date(item.tanggal).toLocaleString("id-ID")}
                </td>

                <td className="p-3">{item.nama_barang}</td>
                <td className="p-3">{item.jumlah}</td>
                <td className="p-3">
                  Rp{item.total_harga?.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Laporan;
