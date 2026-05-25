import { useEffect, useState } from "react";
import axios from "axios";

function Kasir() {
  const API_URL = "http://localhost:5001";

  const [barang, setBarang] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(`${API_URL}/barang`).then((res) => {
      setBarang(res.data);
    });
  };

  const tambahKeCart = (item) => {
    const sudahAda = cart.find((cartItem) => cartItem.id === item.id);

    if (sudahAda) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const tambahQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const kurangQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const hapusItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalHarga = cart.reduce(
    (total, item) => total + item.harga * item.qty,
    0
  );

  const prosesBayar = async () => {
    if (cart.length === 0) {
      setMessage("Keranjang masih kosong");
      return;
    }

    try {
      for (const item of cart) {
        await axios.post(`${API_URL}/transaksi`, {
          nama_barang: item.nama_barang,
          jumlah: item.qty,
        });
      }

      setMessage("Transaksi berhasil, stok otomatis berkurang");
      setCart([]);
      getBarang();
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Transaksi gagal");
      }
    }
  };

  const filteredBarang = barang.filter((item) =>
    item.nama_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Kasir Penjualan
      </h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Daftar Barang</h2>

            <input
              type="text"
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-xl px-5 py-3 outline-none w-72"
            />
          </div>

          <div className="grid grid-cols-3 gap-5">
            {filteredBarang.map((item) => (
              <div
                key={item.id}
                onClick={() => tambahKeCart(item)}
                className="border border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="h-28 bg-blue-50 rounded-xl flex items-center justify-center text-5xl mb-4">
                  📦
                </div>

                <h3 className="font-bold text-gray-800">
                  {item.nama_barang}
                </h3>

                <p className="text-blue-500 font-semibold mt-2">
                  Rp{Number(item.harga).toLocaleString("id-ID")}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Stok: {item.stok}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Keranjang</h2>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cart.length === 0 && (
              <p className="text-gray-400">Belum ada barang dipilih.</p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-100 pb-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{item.nama_barang}</h3>
                    <p className="text-sm text-gray-500">
                      Rp{Number(item.harga).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <button
                    onClick={() => hapusItem(item.id)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => kurangQty(item.id)}
                      className="bg-gray-100 px-3 py-1 rounded-lg"
                    >
                      -
                    </button>

                    <span className="font-bold">{item.qty}</span>

                    <button
                      onClick={() => tambahQty(item.id)}
                      className="bg-gray-100 px-3 py-1 rounded-lg"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold">
                    Rp{Number(item.harga * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-5">
            <div className="flex justify-between text-gray-500 mb-3">
              <span>Subtotal</span>
              <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-2xl font-bold mb-6">
              <span>Total</span>
              <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
            </div>

            <button
              onClick={prosesBayar}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              Bayar Sekarang
            </button>

            {message && (
              <p className="mt-4 font-semibold text-green-600">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kasir;