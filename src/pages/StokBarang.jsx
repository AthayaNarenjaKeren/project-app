import { useEffect, useState } from "react";
import axios from "axios";

function StokBarang() {
  const API_URL = "http://localhost:5001";
  const [barang, setBarang] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(`${API_URL}/barang`).then((res) => {
      setBarang(res.data);
    });
  };

  // 🔥 FUNGSI GET KATEGORI (pakai dari database, bukan tebak-tebakan)
  const getKategori = (item) => {
    return item.kategori || "Lainnya";
  };

  // 🔥 FILTER DATA
  const filteredBarang = barang.filter((item) => {
    const matchSearch = item.nama_barang
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchKategori =
      selectedKategori === "" || getKategori(item) === selectedKategori;
    return matchSearch && matchKategori;
  });

  // 🔥 HITUNG JUMLAH PER KATEGORI
  const kategoriCount = {};
  barang.forEach((item) => {
    const kategori = getKategori(item);
    if (!kategoriCount[kategori]) kategoriCount[kategori] = 0;
    kategoriCount[kategori]++;
  });

  const kategoriList = Object.keys(kategoriCount);

  // 🔥 WARNA UNTUK CARD KATEGORI
  const warnaKategori = {
    "Cat Avian": "bg-purple-100 border-purple-400 hover:bg-purple-200",
    Semen: "bg-blue-100 border-blue-400 hover:bg-blue-200",
    "Bahan Bangunan": "bg-green-100 border-green-400 hover:bg-green-200",
    Kayu: "bg-amber-100 border-amber-400 hover:bg-amber-200",
    Keramik: "bg-pink-100 border-pink-400 hover:bg-pink-200",
    Cat: "bg-red-100 border-red-400 hover:bg-red-200",
    "Pipa PVC": "bg-cyan-100 border-cyan-400 hover:bg-cyan-200",
    "Pipa Besi": "bg-slate-100 border-slate-400 hover:bg-slate-200",
    Paku: "bg-gray-100 border-gray-400 hover:bg-gray-200",
    Peralatan: "bg-orange-100 border-orange-400 hover:bg-orange-200",
    Listrik: "bg-yellow-100 border-yellow-400 hover:bg-yellow-200",
    Mortar: "bg-teal-100 border-teal-400 hover:bg-teal-200",
    Atap: "bg-indigo-100 border-indigo-400 hover:bg-indigo-200",
    Lainnya: "bg-gray-100 border-gray-400 hover:bg-gray-200",
  };

  const iconKategori = {
    "Cat Avian": "🎨",
    Semen: "🧱",
    "Bahan Bangunan": "🏗️",
    Kayu: "🪵",
    Keramik: "🪞",
    Cat: "🎨",
    "Pipa PVC": "🔧",
    "Pipa Besi": "🔩",
    Paku: "📌",
    Peralatan: "🔨",
    Listrik: "💡",
    Mortar: "🧱",
    Atap: "🏠",
    Lainnya: "📦",
  };

  // 🔥 GROUP DATA YANG SUDAH DI-FILTER
  const groupedBarang = {};
  filteredBarang.forEach((item) => {
    const kategori = getKategori(item);
    if (!groupedBarang[kategori]) groupedBarang[kategori] = [];
    groupedBarang[kategori].push(item);
  });

  // 🔥 FUNGSI GET STATUS STOK
  const getStatus = (stok) => {
    if (stok <= 5) {
      return { text: "⚠️ Stok Menipis", color: "bg-red-100 text-red-600" };
    } else if (stok <= 10) {
      return { text: "Stok Terbatas", color: "bg-yellow-100 text-yellow-600" };
    } else {
      return { text: "✅ Stok Aman", color: "bg-green-100 text-green-600" };
    }
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold text-base-content mb-8">Stok Gudang</h1>

      {/* 🔥 CARD KATEGORI - FILTER CEPAT (SAMA KAYA DATA BARANG) */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-base-content/60 mb-3">
          📂 Filter Kategori
        </h3>
        <div className="flex flex-wrap gap-3">
          {/* Card "Semua" */}
          <div
            onClick={() => {
              setSelectedKategori("");
            }}
            className={`cursor-pointer px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
              selectedKategori === ""
                ? "bg-primary text-primary-content border-primary shadow-md"
                : "bg-base-100 border-base-300 hover:border-primary hover:shadow-md text-base-content"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-bold text-sm">Semua</p>
                <p className="text-xs opacity-75">{barang.length} barang</p>
              </div>
            </div>
          </div>

          {/* Card per Kategori */}
          {kategoriList.map((kategori) => (
            <div
              key={kategori}
              onClick={() => {
                setSelectedKategori(kategori);
              }}
              className={`cursor-pointer px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
                selectedKategori === kategori
                  ? "bg-primary text-primary-content border-primary shadow-md"
                  : `${
                      warnaKategori[kategori] ||
                      "bg-base-100 border-base-300 hover:border-primary hover:shadow-md"
                    } text-base-content`
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {iconKategori[kategori] || "📦"}
                </span>
                <div>
                  <p className="font-bold text-sm">{kategori}</p>
                  <p className="text-xs opacity-75">
                    {kategoriCount[kategori]} barang
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH + FILTER AKTIF */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-1 min-w-[200px]"
        />
        {selectedKategori && (
          <button
            onClick={() => setSelectedKategori("")}
            className="btn btn-ghost btn-sm text-error"
          >
            ✕ Hapus Filter
          </button>
        )}
      </div>

      {/* TABLE - GROUPED BY KATEGORI (SAMA KAYA DATA BARANG) */}
      <div
        id="table-section"
        className="card bg-base-100 shadow-xl border border-base-300"
      >
        <div className="card-body p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-base-content">
              Daftar Stok Barang
            </h2>
            <span className="text-sm text-base-content/60">
              {selectedKategori
                ? `Kategori: ${selectedKategori}`
                : "Semua Kategori"}{" "}
              • Total: {filteredBarang.length} barang
            </span>
          </div>

          {Object.keys(groupedBarang).length === 0 ? (
            <p className="text-center text-base-content/40 py-8">
              Tidak ada barang ditemukan
            </p>
          ) : (
            Object.keys(groupedBarang).map((kategori) => (
              <div key={kategori} className="mb-8">
                {/* 🔥 HEADER KATEGORI - BG INDIGO-600 (SAMA KAYA DATA BARANG) */}
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl mb-4 flex justify-between items-center shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-2xl">
                      {iconKategori[kategori] || "📂"}
                    </span>
                    {kategori}
                    <span className="text-sm font-normal ml-2 opacity-80">
                      ({groupedBarang[kategori].length} barang)
                    </span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedKategori(kategori);
                        document
                          .getElementById("table-section")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                      className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none"
                    >
                      👁️ Lihat
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nama Barang</th>
                        <th>Stok</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedBarang[kategori].map((item) => {
                        const status = getStatus(item.stok);
                        return (
                          <tr key={item.id}>
                            <td className="font-semibold">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg font-semibold">
                                  {item.nama_barang.charAt(0)}
                                </div>
                                {item.nama_barang}
                              </div>
                            </td>
                            <td className="font-bold text-lg">{item.stok}</td>
                            <td>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}
                              >
                                {status.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StokBarang;
