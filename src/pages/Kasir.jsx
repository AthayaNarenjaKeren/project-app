import { useEffect, useState } from "react";
import axios from "axios";

function Kasir() {
  const API_URL = "http://localhost:5001";

  const [barang, setBarang] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(`${API_URL}/barang`).then((res) => {
      setBarang(res.data);
    });
  };

  const tambahKeCart = (item) => {
    const itemDiCart = cart.find((cartItem) => cartItem.id === item.id);
    const qtySaatIni = itemDiCart ? itemDiCart.qty : 0;

    if (qtySaatIni + 1 > item.stok) {
      setMessageType("error");
      setMessage(`Stok ${item.nama_barang} tidak mencukupi (tersisa ${item.stok})`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (itemDiCart) {
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
    const item = cart.find((item) => item.id === id);
    const barangAsli = barang.find((b) => b.id === id);

    if (item.qty + 1 > barangAsli.stok) {
      setMessageType("error");
      setMessage(`Stok ${barangAsli.nama_barang} tidak mencukupi (tersisa ${barangAsli.stok})`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

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
      setMessageType("error");
      setMessage("Keranjang masih kosong");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setMessage("");
    
    try {
      for (const item of cart) {
        await axios.post(`${API_URL}/transaksi`, {
          nama_barang: item.nama_barang,
          jumlah: item.qty,
        });
      }

      setMessageType("success");
      setMessage("✅ Transaksi berhasil! Stok otomatis berkurang.");
      setCart([]);
      getBarang();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessageType("error");
      if (error.response) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Transaksi gagal, cek koneksi server");
      }
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const filteredBarang = barang.filter((item) =>
    item.nama_barang.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 FUNGSI GET ICON/GAMBAR UNTUK KARTU BARANG
  const getIcon = (nama) => {
    if (nama.includes('Cat') || nama.includes('Avian') || nama.includes('No Drop') || nama.includes('Avitex')) return '🎨';
    if (nama.includes('Semen') || nama.includes('Mortar')) return '🧱';
    if (nama.includes('Kayu') || nama.includes('Triplek') || nama.includes('Multiplek') || nama.includes('Gipsum')) return '🪵';
    if (nama.includes('Paku')) return '📌';
    if (nama.includes('Pipa') || nama.includes('Dop')) return '🔧';
    if (nama.includes('Keramik') || nama.includes('Granit') || nama.includes('Mosaic')) return '🪞';
    if (nama.includes('Lampu') || nama.includes('Kabel') || nama.includes('Saklar') || nama.includes('Stop') || nama.includes('Fitting')) return '💡';
    if (nama.includes('Besi') || nama.includes('Siku')) return '🔩';
    if (nama.includes('Batu') || nama.includes('Batako') || nama.includes('Hebel')) return '🪨';
    if (nama.includes('Pasir')) return '🏖️';
    if (nama.includes('Gerinda') || nama.includes('Bor') || nama.includes('Gergaji') || nama.includes('Obeng') || nama.includes('Tang')) return '🔨';
    if (nama.includes('Meteran') || nama.includes('Neraca') || nama.includes('Timbangan')) return '📏';
    if (nama.includes('Genteng') || nama.includes('Asbes') || nama.includes('Seng')) return '🏠';
    if (nama.includes('Palu')) return '🔨';
    if (nama.includes('Ember')) return '🪣';
    if (nama.includes('Kuas') || nama.includes('Roller') || nama.includes('Thinner')) return '🖌️';
    if (nama.includes('Cangkul') || nama.includes('Sekop')) return '⛏️';
    if (nama.includes('Yolko') || nama.includes('Boyo') || nama.includes('Ve')) return '🧪';
    return '📦';
  };

  // 🔥 FUNGSI GET WARNA BACKGROUND UNTUK KARTU
  const getBgColor = (nama) => {
    if (nama.includes('Cat') || nama.includes('Avian') || nama.includes('No Drop')) return 'bg-purple-100';
    if (nama.includes('Semen') || nama.includes('Mortar')) return 'bg-blue-100';
    if (nama.includes('Kayu') || nama.includes('Triplek') || nama.includes('Multiplek')) return 'bg-amber-100';
    if (nama.includes('Paku')) return 'bg-gray-200';
    if (nama.includes('Pipa')) return 'bg-cyan-100';
    if (nama.includes('Keramik') || nama.includes('Granit')) return 'bg-pink-100';
    if (nama.includes('Lampu') || nama.includes('Kabel') || nama.includes('Saklar')) return 'bg-yellow-100';
    if (nama.includes('Besi')) return 'bg-slate-200';
    if (nama.includes('Batu') || nama.includes('Batako') || nama.includes('Hebel')) return 'bg-stone-200';
    if (nama.includes('Pasir')) return 'bg-orange-100';
    if (nama.includes('Gerinda') || nama.includes('Bor') || nama.includes('Gergaji')) return 'bg-red-100';
    if (nama.includes('Genteng') || nama.includes('Asbes') || nama.includes('Seng')) return 'bg-indigo-100';
    return 'bg-blue-50';
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Kasir Penjualan
      </h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Daftar Barang */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Daftar Barang</h2>

            <input
              type="text"
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-xl px-5 py-3 outline-none w-72"
            />
          </div>

          <div className="grid grid-cols-3 gap-5 max-h-[500px] overflow-y-auto">
            {filteredBarang.length === 0 && (
              <div className="col-span-3 text-center text-gray-400 py-10">
                Tidak ada barang ditemukan
              </div>
            )}
            
            {filteredBarang.map((item) => (
              <div
                key={item.id}
                onClick={() => tambahKeCart(item)}
                className={`bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer transition hover:border-blue-500 hover:shadow-md ${
                  item.stok === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {/* 🔥 GAMBAR/ICON DENGAN WARNA BACKGROUND */}
                <div className={`${getBgColor(item.nama_barang)} rounded-xl flex items-center justify-center text-6xl mb-4 h-28`}>
                  {getIcon(item.nama_barang)}
                </div>

                <h3 className="font-bold text-gray-800 text-center">
                  {item.nama_barang}
                </h3>

                <p className="text-blue-500 font-semibold mt-2 text-center">
                  Rp{Number(item.harga).toLocaleString("id-ID")}
                </p>

                <p className={`text-sm mt-1 text-center ${item.stok <= 5 ? "text-red-500 font-semibold" : "text-gray-500"}`}>
                  Stok: {item.stok} {item.stok <= 5 && "⚠️"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Keranjang */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col h-[600px]">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Keranjang Belanja</h2>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {cart.length === 0 && (
              <p className="text-gray-400 text-center py-10">
                Belum ada barang dipilih.
              </p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-100 pb-4"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getIcon(item.nama_barang)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.nama_barang}</h3>
                      <p className="text-sm text-gray-500">
                        Rp{Number(item.harga).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => hapusItem(item.id)}
                    className="text-red-500 font-bold text-xl hover:text-red-700"
                  >
                    ×
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => kurangQty(item.id)}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-lg font-semibold"
                    >
                      -
                    </button>

                    <span className="font-bold min-w-[30px] text-center text-gray-800">{item.qty}</span>

                    <button
                      onClick={() => tambahQty(item.id)}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-lg font-semibold"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-gray-800">
                    Rp{Number(item.harga * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <div className="flex justify-between text-gray-500 mb-3">
              <span>Subtotal</span>
              <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-2xl font-bold mb-6 text-gray-800">
              <span>Total</span>
              <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
            </div>

            <button
              onClick={prosesBayar}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition"
            >
              Bayar Sekarang
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-xl ${
                messageType === "success" 
                  ? "bg-green-100 text-green-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kasir;