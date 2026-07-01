import { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";

function Dashboard() {
  const API_URL = "http://localhost:5001";
  const [barang, setBarang] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [totalBarang, setTotalBarang] = useState(0);
  const [totalStok, setTotalStok] = useState(0);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [stokMenipis, setStokMenipis] = useState(0);
  const [barangMenipis, setBarangMenipis] = useState([]);
  const [showNotif, setShowNotif] = useState(true);

  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("daily");

  // 🔥 STATE UNTUK DATA BULAN INI (untuk card Total Transaksi & Total Penjualan)
  const [transaksiBulanIni, setTransaksiBulanIni] = useState([]);
  const [totalPenjualanBulanIni, setTotalPenjualanBulanIni] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const resBarang = await axios.get(`${API_URL}/barang`);
      const dataBarang = resBarang.data;
      setBarang(dataBarang);
      setTotalBarang(dataBarang.length);
      setTotalStok(dataBarang.reduce((sum, item) => sum + item.stok, 0));

      const menipis = dataBarang.filter((item) => item.stok <= 5);
      setStokMenipis(menipis.length);
      setBarangMenipis(menipis);

      const resTransaksi = await axios.get(`${API_URL}/transaksi`);
      const dataTransaksi = resTransaksi.data;
      setTransaksi(dataTransaksi);

      // 🔥 FILTER TRANSAKSI BULAN INI
      const now = new Date();
      const bulanIni = now.getMonth();
      const tahunIni = now.getFullYear();

      const transaksiBulanIniFilter = dataTransaksi.filter((item) => {
        const tanggal = new Date(item.tanggal);
        return tanggal.getMonth() === bulanIni && tanggal.getFullYear() === tahunIni;
      });

      setTransaksiBulanIni(transaksiBulanIniFilter);

      const totalBulanIni = transaksiBulanIniFilter.reduce(
        (sum, item) => sum + (item.total_harga || 0),
        0
      );
      setTotalPenjualanBulanIni(totalBulanIni);

      // Total semua (untuk yang lain)
      const total = dataTransaksi.reduce(
        (sum, item) => sum + (item.total_harga || 0),
        0
      );
      setTotalPenjualan(total);

      processChartData(dataTransaksi, selectedMonth, selectedYear, viewType);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const processChartData = (data, month, year, type) => {
    if (type === "daily") {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyTotals = Array(daysInMonth).fill(0);

      data.forEach((item) => {
        const date = new Date(item.tanggal);
        if (date.getMonth() === month && date.getFullYear() === year) {
          const day = date.getDate() - 1;
          dailyTotals[day] += item.total_harga || 0;
        }
      });

      const maxValue = Math.max(...dailyTotals, 1);
      const scaledData = dailyTotals.map((value, index) => ({
        value: value,
        height: Math.max((value / maxValue) * 200, 5),
        label: value > 0 ? `Rp${value.toLocaleString("id-ID")}` : "",
        date: `${index + 1} ${
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des",
          ][month]
        }`,
      }));

      setChartData(scaledData);
    } else {
      const monthlyTotals = Array(12).fill(0);

      data.forEach((item) => {
        const date = new Date(item.tanggal);
        if (date.getFullYear() === year) {
          const monthIndex = date.getMonth();
          monthlyTotals[monthIndex] += item.total_harga || 0;
        }
      });

      const maxValue = Math.max(...monthlyTotals, 1);
      const scaledData = monthlyTotals.map((value, index) => ({
        value: value,
        height: Math.max((value / maxValue) * 200, 5),
        label: value > 0 ? `Rp${value.toLocaleString("id-ID")}` : "",
        date: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ][index],
      }));

      setChartData(scaledData);
    }
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    processChartData(transaksi, month, selectedYear, viewType);
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    processChartData(transaksi, selectedMonth, year, viewType);
  };

  const handleViewChange = (type) => {
    setViewType(type);
    processChartData(transaksi, selectedMonth, selectedYear, type);
  };

  const cards = [
    {
      title: "Total Barang",
      value: totalBarang,
      icon: "📦",
      bg: "bg-purple-100",
      note: "Data terbaru",
      color: "text-green-500",
    },
    {
      title: "Total Transaksi (Bulan Ini)",
      value: transaksiBulanIni.length,
      icon: "🧾",
      bg: "bg-yellow-100",
      note: `${transaksiBulanIni.length} transaksi bulan ini`,
      color: "text-green-500",
    },
    {
      title: "Total Penjualan (Bulan Ini)",
      value: `Rp${totalPenjualanBulanIni.toLocaleString("id-ID")}`,
      icon: "📈",
      bg: "bg-green-100",
      note: "Pendapatan bulan ini",
      color: "text-green-500",
    },
    {
      title: "Stok Menipis",
      value: stokMenipis,
      icon: "⏰",
      bg: "bg-orange-100",
      note: stokMenipis > 0 ? "⚠️ Segera restock!" : "Semua aman ✅",
      color: stokMenipis > 0 ? "text-red-500" : "text-green-500",
    },
  ];

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const totalChartValue = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* NOTIFIKASI */}
      {barangMenipis.length > 0 && showNotif && (
        <Notification
          barangMenipis={barangMenipis}
          onClose={() => setShowNotif(false)}
        />
      )}

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* CARD */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>

            <div className="flex justify-between items-start mt-2">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-800">
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.bg} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm`}
              >
                {card.icon}
              </div>
            </div>

            <p className={`text-sm mt-5 ${card.color}`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Detail Penjualan -{" "}
              {viewType === "daily" ? "Per Hari" : "Per Bulan"}
            </h2>
            <p className="text-sm text-gray-400">
              Total pendapatan bulan {monthNames[selectedMonth]} {selectedYear}:{" "}
              <span className="font-bold text-blue-600">
                Rp{totalChartValue.toLocaleString("id-ID")}
              </span>
            </p>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange("daily")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewType === "daily"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📅 Per Hari
              </button>
              <button
                onClick={() => handleViewChange("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewType === "monthly"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📊 Per Bulan
              </button>
            </div>

            {viewType === "daily" && (
              <select
                onChange={handleMonthChange}
                value={selectedMonth}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
              </select>
            )}

            <select
              onChange={handleYearChange}
              value={selectedYear}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        <div className="h-72 flex items-end gap-1 pt-6">
          {chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
            <div className="w-full text-center text-gray-400">
              Belum ada data penjualan untuk periode ini
            </div>
          ) : (
            chartData.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
              >
                <div className="relative w-full">
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                    {item.label || "Rp0"}
                  </div>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.value > 0
                        ? "bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 cursor-pointer"
                        : "bg-gray-200"
                    }`}
                    style={{ height: `${Math.max(item.height, 4)}px` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {viewType === "daily" ? index + 1 : item.date}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-4 px-2">
          <span>
            {viewType === "daily"
              ? `Awal ${monthNames[selectedMonth]} ${selectedYear}`
              : `Awal ${selectedYear}`}
          </span>
          <span>
            {viewType === "daily"
              ? `Akhir ${monthNames[selectedMonth]} ${selectedYear}`
              : `Akhir ${selectedYear}`}
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Detail Transaksi Kasir
            </h2>
            <p className="text-sm text-gray-400">
              Riwayat transaksi penjualan terbaru
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/laporan")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Lihat Semua →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 text-left rounded-l-xl">Barang</th>
                <th className="p-4 text-left">Tanggal</th>
                <th className="p-4 text-left">Jumlah</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left rounded-r-xl">Status</th>
              </tr>
            </thead>

            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Belum ada transaksi
                  </td>
                </tr>
              ) : (
                transaksi.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-bold">
                          {item.nama_barang.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.nama_barang}
                          </p>
                          <p className="text-xs text-gray-400">
                            SKU: 00{item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      <div>
                        <p>
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.tanggal).toLocaleTimeString("id-ID")}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">{item.jumlah}</td>

                    <td className="p-4 font-semibold text-gray-800">
                      Rp{(item.total_harga || 0).toLocaleString("id-ID")}
                    </td>

                    <td className="p-4">
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Terjual
                      </span>
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

export default Dashboard;