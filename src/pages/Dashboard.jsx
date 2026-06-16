function Dashboard() {
  const cards = [
    {
      title: "Total Barang",
      value: "250",
      icon: "📦",
      bg: "bg-purple-100",
      note: "8.5% naik dari kemarin",
      color: "text-green-500",
    },
    {
      title: "Total Transaksi",
      value: "102",
      icon: "🧾",
      bg: "bg-yellow-100",
      note: "1.3% naik minggu ini",
      color: "text-green-500",
    },
    {
      title: "Total Penjualan",
      value: "Rp8.900.000",
      icon: "📈",
      bg: "bg-green-100",
      note: "4.3% turun dari kemarin",
      color: "text-red-500",
    },
    {
      title: "Stok Menipis",
      value: "8",
      icon: "⏰",
      bg: "bg-orange-100",
      note: "Perlu segera restock",
      color: "text-green-500",
    },
  ];

  const transactions = [
    {
      barang: "Semen Tiga Roda",
      lokasi: "Gudang Utama",
      tanggal: "09.05.2026 - 10.30 WIB",
      jumlah: "10 Sak",
      total: "Rp650.000",
      status: "Terjual",
    },
    {
      barang: "Cat Avian",
      lokasi: "Rak Cat",
      tanggal: "09.05.2026 - 11.20 WIB",
      jumlah: "2 Kaleng",
      total: "Rp240.000",
      status: "Terjual",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* CARD */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >
            {/* accent line */}
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
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Detail Penjualan
          </h2>

          <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>Mei</option>
            <option>Juni</option>
          </select>
        </div>

        <div className="h-72 flex items-end gap-3 pt-6">
          {[70, 95, 130, 100, 160, 120, 200, 140, 175, 150, 220, 180].map(
            (item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-700 via-blue-500 to-blue-300 rounded-t-xl hover:opacity-90 transition"
                  style={{ height: `${item}px` }}
                ></div>
                <p className="text-xs text-gray-400 mt-2">
                  {index + 1} Mei
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Detail Transaksi Kasir
            </h2>
            <p className="text-sm text-gray-400">
              Riwayat transaksi penjualan terbaru
            </p>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            + Tambah
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left px-4">Barang</th>
                <th className="text-left px-4">Lokasi</th>
                <th className="text-left px-4">Tanggal</th>
                <th className="text-left px-4">Jumlah</th>
                <th className="text-left px-4">Total</th>
                <th className="text-left px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item, index) => (
                <tr
                  key={index}
                  className="bg-gray-50 hover:bg-blue-50 transition rounded-xl shadow-sm"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-bold">
                        {item.barang.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.barang}
                        </p>
                        <p className="text-xs text-gray-400">
                          SKU: 00{index + 1}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 text-gray-600">{item.lokasi}</td>

                  <td className="px-4 text-gray-600">
                    <div>
                      <p>{item.tanggal.split(" - ")[0]}</p>
                      <p className="text-xs text-gray-400">
                        {item.tanggal.split(" - ")[1]}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 text-gray-700 font-medium">
                    {item.jumlah}
                  </td>

                  <td className="px-4 font-semibold text-gray-800">
                    {item.total}
                  </td>

                  <td className="px-4">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;