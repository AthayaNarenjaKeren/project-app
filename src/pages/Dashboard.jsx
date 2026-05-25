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
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-4 gap-7 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">{card.title}</p>
                <h2 className="text-2xl font-bold mt-5 text-gray-800 whitespace-nowrap">
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.bg} min-w-14 h-14 rounded-full flex items-center justify-center text-2xl`}
              >
                {card.icon}
              </div>
            </div>

            <p className={`text-sm mt-7 ${card.color}`}>{card.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Detail Penjualan</h2>

          <select className="border border-gray-200 rounded-lg px-5 py-2 text-gray-400">
            <option>Mei</option>
            <option>Juni</option>
          </select>
        </div>

        <div className="h-72 flex items-end gap-4 border-t border-gray-100 pt-8">
          {[70, 95, 130, 100, 160, 120, 200, 140, 175, 150, 220, 180].map(
            (item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-xl"
                  style={{ height: `${item}px` }}
                ></div>
                <p className="text-xs text-gray-400 mt-3">{index + 1} Mei</p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Detail Transaksi Kasir
        </h2>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 text-gray-600">
              <th className="p-4 text-left rounded-l-xl">Nama Barang</th>
              <th className="p-4 text-left">Lokasi</th>
              <th className="p-4 text-left">Tanggal - Waktu</th>
              <th className="p-4 text-left">Jumlah</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left rounded-r-xl">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="p-4">{item.barang}</td>
                <td className="p-4">{item.lokasi}</td>
                <td className="p-4">{item.tanggal}</td>
                <td className="p-4">{item.jumlah}</td>
                <td className="p-4">{item.total}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-600 px-5 py-2 rounded-full text-sm font-semibold">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
