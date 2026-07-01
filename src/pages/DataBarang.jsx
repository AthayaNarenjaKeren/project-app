import { useEffect, useState } from "react";
import axios from "axios";

function DataBarang() {
  const API_URL = "http://localhost:5001";

  const [barang, setBarang] = useState([]);
  const [groupedBarang, setGroupedBarang] = useState({});
  const [form, setForm] = useState({
    nama_barang: "",
    harga: "",
    stok: "",
    kategori: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  // 🔥 STATE UNTUK PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔥 STATE UNTUK POPUP TAMBAH STOK
  const [showStokModal, setShowStokModal] = useState(false);
  const [stokItem, setStokItem] = useState(null);
  const [stokTambahan, setStokTambahan] = useState("");

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(`${API_URL}/barang`).then((res) => {
      const data = res.data;
      setBarang(data);

      const grouped = {};
      data.forEach((item) => {
        const kategori = item.kategori || "Lainnya";
        if (!grouped[kategori]) grouped[kategori] = [];
        grouped[kategori].push(item);
      });
      setGroupedBarang(grouped);
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      nama_barang: "",
      harga: "",
      stok: "",
      kategori: "",
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataBaru = {
      nama_barang: form.nama_barang,
      harga: Number(form.harga),
      stok: Number(form.stok),
      kategori: form.kategori || "Lainnya",
    };

    if (editId) {
      axios.put(`${API_URL}/barang/${editId}`, dataBaru).then((res) => {
        setMessage(res.data.message);
        getBarang();
        resetForm();
      });
    } else {
      axios.post(`${API_URL}/barang`, dataBaru).then((res) => {
        setMessage(res.data.message);
        getBarang();
        resetForm();
      });
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      nama_barang: item.nama_barang,
      harga: item.harga,
      stok: item.stok,
      kategori: item.kategori || "",
    });
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus barang ini?")) {
      axios.delete(`${API_URL}/barang/${id}`).then((res) => {
        setMessage(res.data.message);
        getBarang();
      });
    }
  };

  // 🔥 FUNGSI UNTUK BUKA POPUP TAMBAH STOK
  const handleBukaModalStok = (item) => {
    setStokItem(item);
    setStokTambahan("");
    setShowStokModal(true);
  };

  // 🔥 FUNGSI UNTUK SIMPAN TAMBAH STOK
  const handleTambahStok = () => {
    const tambahan = Number(stokTambahan);
    if (!tambahan || tambahan <= 0) {
      alert("Masukkan angka yang valid (minimal 1)");
      return;
    }

    const stokBaru = stokItem.stok + tambahan;

    axios
      .put(`${API_URL}/barang/${stokItem.id}`, {
        nama_barang: stokItem.nama_barang,
        harga: stokItem.harga,
        stok: stokBaru,
        kategori: stokItem.kategori,
      })
      .then((res) => {
        setMessage(`✅ Stok ${stokItem.nama_barang} berhasil ditambah ${tambahan} (total: ${stokBaru})`);
        getBarang();
        setShowStokModal(false);
        setStokItem(null);
        setStokTambahan("");
      })
      .catch((err) => {
        setMessage("❌ Gagal menambah stok");
        console.log(err);
      });
  };

  const handleDeleteKategori = (kategori) => {
    const barangDiKategori = barang.filter(
      (item) => item.kategori === kategori
    );
    if (barangDiKategori.length === 0) return;

    if (
      confirm(
        `Yakin ingin menghapus SEMUA barang di kategori "${kategori}" (${barangDiKategori.length} barang)?`
      )
    ) {
      const promises = barangDiKategori.map((item) =>
        axios.delete(`${API_URL}/barang/${item.id}`)
      );
      Promise.all(promises).then(() => {
        setMessage(
          `✅ Semua barang di kategori "${kategori}" berhasil dihapus`
        );
        getBarang();
      });
    }
  };

  const handleExportKategori = (kategori) => {
    const barangDiKategori = barang.filter(
      (item) => item.kategori === kategori
    );
    if (barangDiKategori.length === 0) return;

    let csv = "Nama Barang,Harga,Stok,Kategori\n";
    barangDiKategori.forEach((item) => {
      csv += `${item.nama_barang},${item.harga},${item.stok},${item.kategori}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kategori}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleTambahKeKategori = (kategori) => {
    setForm({
      nama_barang: "",
      harga: "",
      stok: "",
      kategori: kategori,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLihatSemua = (kategori) => {
    setSelectedKategori(kategori);
    document
      .getElementById("table-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // 🔥 FILTER DATA
  const filteredBarang = barang.filter((item) => {
    const matchSearch = item.nama_barang
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchKategori =
      selectedKategori === "" || item.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  // 🔥 PAGINATION - HITUNG TOTAL HALAMAN
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBarang.slice(indexOfFirstItem, indexOfLastItem);

  // 🔥 GROUP DATA YANG SUDAH DI-PAGINATION
  const groupedCurrentItems = {};
  currentItems.forEach((item) => {
    const kategori = item.kategori || "Lainnya";
    if (!groupedCurrentItems[kategori]) groupedCurrentItems[kategori] = [];
    groupedCurrentItems[kategori].push(item);
  });

  // 🔥 FUNGSI PAGINATION
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 🔥 HITUNG JUMLAH PER KATEGORI UNTUK CARD
  const kategoriCount = {};
  barang.forEach((item) => {
    const kategori = item.kategori || "Lainnya";
    if (!kategoriCount[kategori]) kategoriCount[kategori] = 0;
    kategoriCount[kategori]++;
  });

  const kategoriList = Object.keys(kategoriCount);

  // 🔥 WARNA UNTUK CARD KATEGORI
  const warnaKategori = {
    "Cat Avian": "bg-purple-100 border-purple-400 hover:bg-purple-200",
    "Semen": "bg-blue-100 border-blue-400 hover:bg-blue-200",
    "Bahan Bangunan": "bg-green-100 border-green-400 hover:bg-green-200",
    "Kayu": "bg-amber-100 border-amber-400 hover:bg-amber-200",
    "Keramik": "bg-pink-100 border-pink-400 hover:bg-pink-200",
    "Cat": "bg-red-100 border-red-400 hover:bg-red-200",
    "Pipa PVC": "bg-cyan-100 border-cyan-400 hover:bg-cyan-200",
    "Pipa Besi": "bg-slate-100 border-slate-400 hover:bg-slate-200",
    "Paku": "bg-gray-100 border-gray-400 hover:bg-gray-200",
    "Peralatan": "bg-orange-100 border-orange-400 hover:bg-orange-200",
    "Listrik": "bg-yellow-100 border-yellow-400 hover:bg-yellow-200",
    "Mortar": "bg-teal-100 border-teal-400 hover:bg-teal-200",
    "Atap": "bg-indigo-100 border-indigo-400 hover:bg-indigo-200",
    "Lainnya": "bg-gray-100 border-gray-400 hover:bg-gray-200",
  };

  const iconKategori = {
    "Cat Avian": "🎨",
    "Semen": "🧱",
    "Bahan Bangunan": "🏗️",
    "Kayu": "🪵",
    "Keramik": "🪞",
    "Cat": "🎨",
    "Pipa PVC": "🔧",
    "Pipa Besi": "🔩",
    "Paku": "📌",
    "Peralatan": "🔨",
    "Listrik": "💡",
    "Mortar": "🧱",
    "Atap": "🏠",
    "Lainnya": "📦",
  };

  const daftarKategori = [
    "Cat Avian",
    "Semen",
    "Bahan Bangunan",
    "Kayu",
    "Keramik",
    "Cat",
    "Pipa PVC",
    "Pipa Besi",
    "Paku",
    "Peralatan",
    "Listrik",
    "Mortar",
    "Atap",
    "Lainnya",
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Data Barang</h1>

      {/* FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editId ? "Edit Barang" : "Tambah Barang"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
          <input
            type="text"
            name="nama_barang"
            placeholder="Nama Barang"
            value={form.nama_barang}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            required
          />

          <input
            type="number"
            name="harga"
            placeholder="Harga"
            value={form.harga}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            required
          />

          <input
            type="number"
            name="stok"
            placeholder="Stok"
            value={form.stok}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            required
          />

          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            required
          >
            <option value="">Pilih Kategori</option>
            {daftarKategori.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>

          <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-medium shadow-md hover:opacity-90 transition col-span-4 py-3">
            {editId ? "Update" : "Tambah"}
          </button>
        </form>

        {editId && (
          <button
            onClick={resetForm}
            className="mt-4 text-sm text-gray-500 hover:text-gray-800"
          >
            Batal Edit
          </button>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-600 rounded-xl">
            {message}
          </div>
        )}
      </div>

      {/* 🔥 CARD KATEGORI - FILTER CEPAT */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          📂 Filter Kategori
        </h3>
        <div className="flex flex-wrap gap-3">
          {/* Card "Semua" */}
          <div
            onClick={() => {
              setSelectedKategori("");
              setCurrentPage(1);
            }}
            className={`cursor-pointer px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
              selectedKategori === ""
                ? "bg-blue-500 text-white border-blue-600 shadow-md"
                : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-md text-gray-700"
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
                setCurrentPage(1);
              }}
              className={`cursor-pointer px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
                selectedKategori === kategori
                  ? "bg-blue-500 text-white border-blue-600 shadow-md"
                  : `${warnaKategori[kategori] || "bg-gray-100 border-gray-300 hover:border-blue-400 hover:shadow-md"} text-gray-700`
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{iconKategori[kategori] || "📦"}</span>
                <div>
                  <p className="font-bold text-sm">{kategori}</p>
                  <p className="text-xs opacity-75">{kategoriCount[kategori]} barang</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH + ITEMS PER PAGE */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-w-[200px]"
        />

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-500">Tampil:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div id="table-section" className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Daftar Barang Toko Bangunan
          </h2>
          <span className="text-sm text-gray-400">
            {selectedKategori ? `Kategori: ${selectedKategori}` : "Semua Kategori"} • Total: {filteredBarang.length} barang
          </span>
        </div>

        {Object.keys(groupedCurrentItems).length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            Tidak ada barang ditemukan
          </p>
        ) : (
          Object.keys(groupedCurrentItems).map((kategori) => (
            <div key={kategori} className="mb-8">
              {/* HEADER KATEGORI */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-3 rounded-xl mb-4 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-2xl">{iconKategori[kategori] || "📂"}</span>
                  {kategori}
                  <span className="text-sm font-normal ml-2 opacity-80">
                    ({groupedCurrentItems[kategori].length} barang)
                  </span>
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleTambahKeKategori(kategori)}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    ➕ Tambah
                  </button>
                  <button
                    onClick={() => handleLihatSemua(kategori)}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    👁️ Lihat
                  </button>
                  <button
                    onClick={() => handleExportKategori(kategori)}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    📥 Export
                  </button>
                  <button
                    onClick={() => handleDeleteKategori(kategori)}
                    className="bg-red-500/50 hover:bg-red-500/70 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-4 text-left rounded-l-xl">
                        Nama Barang
                      </th>
                      <th className="p-4 text-left">Harga</th>
                      <th className="p-4 text-left">Stok</th>
                      <th className="p-4 text-left rounded-r-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCurrentItems[kategori].map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="p-4 font-semibold text-gray-800">
                          {item.nama_barang}
                        </td>
                        <td className="p-4 text-gray-600">
                          Rp{Number(item.harga).toLocaleString("id-ID")}
                        </td>
                        <td className="p-4 text-gray-600">{item.stok}</td>
                        <td className="p-4 flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleBukaModalStok(item)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                          >
                            + Stok
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        {/* 🔥 PAGINATION */}
        {filteredBarang.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Menampilkan {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredBarang.length)} dari{" "}
              {filteredBarang.length} barang
            </p>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                ⬅️ Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Next ➡️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 MODAL / POPUP TAMBAH STOK */}
      {showStokModal && stokItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Tambah Stok
            </h3>
            <p className="text-gray-500 mb-4">
              Tambah stok untuk{" "}
              <span className="font-bold">{stokItem.nama_barang}</span>
              <br />
              <span className="text-sm">
                Stok saat ini: <strong>{stokItem.stok}</strong>
              </span>
            </p>

            <input
              type="number"
              placeholder="Masukkan jumlah tambahan..."
              value={stokTambahan}
              onChange={(e) => setStokTambahan(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              autoFocus
              min="1"
            />

            <div className="flex gap-3">
              <button
                onClick={handleTambahStok}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
              >
                ✅ Tambah
              </button>
              <button
                onClick={() => {
                  setShowStokModal(false);
                  setStokItem(null);
                  setStokTambahan("");
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataBarang;