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

      const now = new Date();
      const bulanIni = now.getMonth();
      const tahunIni = now.getFullYear();

      const transaksiBulanIniFilter = dataTransaksi.filter((item) => {
        const tanggal = new Date(item.tanggal);
        return (
          tanggal.getMonth() === bulanIni && tanggal.getFullYear() === tahunIni
        );
      });

      setTransaksiBulanIni(transaksiBulanIniFilter);

      const totalBulanIni = transaksiBulanIniFilter.reduce(
        (sum, item) => sum + (item.total_harga || 0),
        0
      );
      setTotalPenjualanBulanIni(totalBulanIni);

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
    <div className="p-6 bg-base-200 min-h-screen">
      {barangMenipis.length > 0 && showNotif && (
        <Notification
          barangMenipis={barangMenipis}
          onClose={() => setShowNotif(false)}
        />
      )}

      <h1 className="text-3xl font-bold mb-8 text-base-content">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden relative"
          >
            <div className="card-body p-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="flex justify-between items-start mt-2">
                <div>
                  <p className="text-base-content/60 text-sm">{card.title}</p>
                  <h2 className="text-3xl font-bold mt-2 text-base-content">
                    {card.value}
                  </h2>
                </div>
                <div
                  className={`${card.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl`}
                >
                  {card.icon}
                </div>
              </div>
              <p className={`text-sm mt-5 ${card.color}`}>{card.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-semibold text-base-content">
                Detail Penjualan -{" "}
                {viewType === "daily" ? "Per Hari" : "Per Bulan"}
              </h2>
              <p className="text-sm text-base-content/60">
                Total pendapatan bulan {monthNames[selectedMonth]}{" "}
                {selectedYear}:{" "}
                <span className="font-bold text-primary">
                  Rp{totalChartValue.toLocaleString("id-ID")}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap mb-6">
            <div className="join">
              <button
                onClick={() => handleViewChange("daily")}
                className={`join-item btn btn-sm ${
                  viewType === "daily" ? "btn-primary" : "btn-outline"
                }`}
              >
                📅 Per Hari
              </button>

              <button
                onClick={() => handleViewChange("monthly")}
                className={`join-item btn btn-sm ${
                  viewType === "monthly" ? "btn-primary" : "btn-outline"
                }`}
              >
                📊 Per Bulan
              </button>
            </div>

            {viewType === "daily" && (
              <select className="select select-bordered select-sm">
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
                <select className="select select-bordered select-sm"></select>
              </select>
            )}

            <select
              onChange={handleYearChange}
              value={selectedYear}
              className="select select-bordered select-sm"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        <div className="h-80 flex items-end gap-2 pt-6">
          {chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
            <div className="w-full h-full flex flex-col justify-center items-center text-base-content/50">
              <div className="text-6xl mb-3">📊</div>

              <h3 className="font-semibold">Belum Ada Data Penjualan</h3>

              <p className="text-sm">
                Lakukan transaksi terlebih dahulu untuk melihat grafik
                penjualan.
              </p>
            </div>
          ) : (
            chartData.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
              >
                <div className="relative w-full">
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-base-300 text-base-content text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                    {item.label || "Rp0"}
                  </div>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.value > 0
                        ? "bg-gradient-to-t from-primary to-primary/60 hover:from-primary/80 hover:to-primary/40 cursor-pointer"
                        : "bg-base-300"
                    }`}
                    style={{ height: `${Math.max(item.height, 4)}px` }}
                  ></div>
                </div>
                <p className="text-xs text-base-content/40 mt-2">
                  {viewType === "daily" ? index + 1 : item.date}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between text-xs text-base-content/40 mt-4 px-2">
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
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-base-content">
                Detail Transaksi Kasir
              </h2>
              <p className="text-sm text-base-content/60">
                Riwayat transaksi penjualan terbaru
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/laporan")}
              className="btn btn-primary btn-sm"
            >
              Lihat Semua →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Barang</th>
                <th>Tanggal</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-base-content/40"
                  >
                    Belum ada transaksi
                  </td>
                </tr>
              ) : (
                transaksi.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg font-bold">
                          {item.nama_barang.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-base-content">
                            {item.nama_barang}
                          </p>
                          <p className="text-xs text-base-content/40">
                            SKU: 00{item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </p>
                        <p className="text-xs text-base-content/40">
                          {new Date(item.tanggal).toLocaleTimeString("id-ID")}
                        </p>
                      </div>
                    </td>
                    <td>{item.jumlah}</td>
                    <td className="font-semibold">
                      Rp{(item.total_harga || 0).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <span className="badge badge-success">Terjual</span>
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
