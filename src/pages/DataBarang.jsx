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
        setMessage(
          `✅ Stok ${stokItem.nama_barang} berhasil ditambah ${tambahan} (total: ${stokBaru})`
        );
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

  // 🔥 WARNA UNTUK CARD KATEGORI (tetap dipakai buat card filter)
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
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-4xl font-bold text-base-content mb-8">Data Barang</h1>

      {/* ============================================================
          🔥 FORM - TAMBAH BARANG VERSION 2 (MODERN)
          ============================================================ */}
      <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
        <div className="card-body p-8">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                {editId ? "Edit Barang" : "Tambah Barang"}
              </h2>
              <p className="text-base-content/60 text-sm mt-1">
                {editId
                  ? "Ubah data barang yang sudah ada."
                  : "Tambahkan barang baru ke dalam inventaris."}
              </p>
            </div>
            {editId && (
              <button
                onClick={resetForm}
                className="btn btn-ghost btn-sm text-error"
              >
                ✕ Batal Edit
              </button>
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Nama Barang */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">
                    Nama Barang
                  </span>
                </label>
                <input
                  type="text"
                  name="nama_barang"
                  placeholder="Contoh: Semen Tiga Roda"
                  value={form.nama_barang}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              {/* Harga */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">
                    Harga
                  </span>
                </label>
                <input
                  type="number"
                  name="harga"
                  placeholder="Contoh: 65000"
                  value={form.harga}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              {/* Stok */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">
                    Stok
                  </span>
                </label>
                <input
                  type="number"
                  name="stok"
                  placeholder="Contoh: 50"
                  value={form.stok}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              {/* Kategori */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">
                    Kategori
                  </span>
                </label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  className="select select-bordered w-full focus:select-primary"
                  required
                >
                  <option disabled value="">
                    Pilih kategori...
                  </option>
                  {daftarKategori.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TOMBOL */}
            <div className="md:col-span-2 flex justify-end mt-6">
              <button type="submit" className="btn btn-primary px-8">
                {editId ? "✏️ Update Barang" : "➕ Tambah Barang"}
              </button>
            </div>
          </form>

          {/* PESAN SUKSES */}
          {message && (
            <div className="alert alert-success mt-4">
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 CARD KATEGORI - FILTER CEPAT */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-base-content/60 mb-3">
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
                setCurrentPage(1);
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

      {/* SEARCH + ITEMS PER PAGE */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-1 min-w-[200px]"
        />

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-base-content/60">Tampil:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="select select-bordered"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* ============================================================
          TABLE
          ============================================================ */}
      <div
        id="table-section"
        className="card bg-base-100 shadow-xl border border-base-300"
      >
        <div className="card-body p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-base-content">
              Daftar Barang Toko Bangunan
            </h2>
            <span className="text-sm text-base-content/60">
              {selectedKategori
                ? `Kategori: ${selectedKategori}`
                : "Semua Kategori"}{" "}
              • Total: {filteredBarang.length} barang
            </span>
          </div>

          {Object.keys(groupedCurrentItems).length === 0 ? (
            <p className="text-center text-base-content/40 py-8">
              Tidak ada barang ditemukan
            </p>
          ) : (
            Object.keys(groupedCurrentItems).map((kategori) => (
              <div key={kategori} className="mb-8">
                {/* 🔥 HEADER KATEGORI - VERSI PREMIUM (INDIGO GRADASI) */}
                {/* 🔥 HEADER KATEGORI - BG INDIGO-600, TULISAN PUTIH */}
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl mb-4 flex justify-between items-center shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-2xl">
                      {iconKategori[kategori] || "📂"}
                    </span>
                    {kategori}
                    <span className="text-sm font-normal ml-2 opacity-80">
                      ({groupedCurrentItems[kategori].length} barang)
                    </span>
                  </h3>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTambahKeKategori(kategori)}
                      className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none"
                    >
                      ➕ Tambah
                    </button>
                    <button
                      onClick={() => handleLihatSemua(kategori)}
                      className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none"
                    >
                      👁️ Lihat
                    </button>
                    <button
                      onClick={() => handleExportKategori(kategori)}
                      className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none"
                    >
                      📥 Export
                    </button>
                    <button
                      onClick={() => handleDeleteKategori(kategori)}
                      className="btn btn-sm bg-red-500/40 hover:bg-red-500/60 text-white border-none"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nama Barang</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedCurrentItems[kategori].map((item) => (
                        <tr key={item.id}>
                          <td className="font-semibold">{item.nama_barang}</td>
                          <td>
                            Rp{Number(item.harga).toLocaleString("id-ID")}
                          </td>
                          <td>{item.stok}</td>
                          <td className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleEdit(item)}
                              className="btn btn-warning btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleBukaModalStok(item)}
                              className="btn btn-success btn-sm"
                            >
                              + Stok
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-error btn-sm"
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
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-300">
              <p className="text-sm text-base-content/60">
                Menampilkan {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, filteredBarang.length)} dari{" "}
                {filteredBarang.length} barang
              </p>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`btn btn-sm ${
                    currentPage === 1 ? "btn-disabled" : "btn-ghost"
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
                        className={`btn btn-sm ${
                          currentPage === pageNum ? "btn-primary" : "btn-ghost"
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
                  className={`btn btn-sm ${
                    currentPage === totalPages ? "btn-disabled" : "btn-ghost"
                  }`}
                >
                  Next ➡️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 MODAL / POPUP TAMBAH STOK */}
      {showStokModal && stokItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-base-300">
            <h3 className="text-2xl font-bold text-base-content mb-2">
              Tambah Stok
            </h3>
            <p className="text-base-content/60 mb-4">
              Tambah stok untuk{" "}
              <span className="font-bold text-base-content">
                {stokItem.nama_barang}
              </span>
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
              className="input input-bordered w-full mb-4"
              autoFocus
              min="1"
            />

            <div className="flex gap-3">
              <button
                onClick={handleTambahStok}
                className="btn btn-success flex-1"
              >
                ✅ Tambah
              </button>
              <button
                onClick={() => {
                  setShowStokModal(false);
                  setStokItem(null);
                  setStokTambahan("");
                }}
                className="btn btn-ghost flex-1"
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
