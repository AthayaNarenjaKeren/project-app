import { useEffect, useState } from "react";
import axios from "axios";

function DataBarang() {
  const API_URL = "http://localhost:5001";

  const [barang, setBarang] = useState([]);
  const [form, setForm] = useState({
    nama_barang: "",
    harga: "",
    stok: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(`${API_URL}/barang`).then((res) => {
      setBarang(res.data);
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
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      axios
        .put(`${API_URL}/barang/${editId}`, {
          nama_barang: form.nama_barang,
          harga: Number(form.harga),
          stok: Number(form.stok),
        })
        .then((res) => {
          setMessage(res.data.message);
          getBarang();
          resetForm();
        });
    } else {
      axios
        .post(`${API_URL}/barang`, {
          nama_barang: form.nama_barang,
          harga: Number(form.harga),
          stok: Number(form.stok),
        })
        .then((res) => {
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

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Data Barang</h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {editId ? "Edit Barang" : "Tambah Barang"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
          <input
            type="text"
            name="nama_barang"
            placeholder="Nama Barang"
            value={form.nama_barang}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="number"
            name="harga"
            placeholder="Harga"
            value={form.harga}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="number"
            name="stok"
            placeholder="Stok"
            value={form.stok}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <button className="bg-blue-500 text-white rounded-xl font-semibold">
            {editId ? "Update" : "Tambah"}
          </button>
        </form>

        {editId && (
          <button
            onClick={resetForm}
            className="mt-4 bg-gray-200 px-5 py-2 rounded-xl"
          >
            Batal Edit
          </button>
        )}

        {message && (
          <p className="mt-4 font-semibold text-green-600">{message}</p>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">
          Daftar Barang Toko Bangunan
        </h2>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 text-gray-600">
              <th className="p-4 text-left rounded-l-xl">Nama Barang</th>
              <th className="p-4 text-left">Harga</th>
              <th className="p-4 text-left">Stok</th>
              <th className="p-4 text-left rounded-r-xl">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {barang.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-4 font-semibold">{item.nama_barang}</td>
                <td className="p-4">
                  Rp{Number(item.harga).toLocaleString("id-ID")}
                </td>
                <td className="p-4">{item.stok}</td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
  );
}

export default DataBarang;

