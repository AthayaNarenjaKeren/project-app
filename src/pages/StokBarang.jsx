import { useState } from "react";

function StokBarang() {
  const [stok, setStok] = useState([
    {
      nama: "Semen Tiga Roda",
      kategori: "Material",
      stok: 50,
    },
    {
      nama: "Cat Avian",
      kategori: "Cat",
      stok: 20,
    },
    {
      nama: "Pipa PVC",
      kategori: "Pipa",
      stok: 35,
    },
  ]);

  const tambahStok = (index) => {
    const dataBaru = [...stok];
    dataBaru[index].stok += 1;
    setStok(dataBaru);
  };

  const kurangStok = (index) => {
    const dataBaru = [...stok];

    if (dataBaru[index].stok > 0) {
      dataBaru[index].stok -= 1;
      setStok(dataBaru);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Stok Gudang
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 text-left">Nama Barang</th>
              <th className="p-4 text-left">Kategori</th>
              <th className="p-4 text-left">Stok</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {stok.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100"
              >
                <td className="p-4">{item.nama}</td>

                <td className="p-4">{item.kategori}</td>

                <td className="p-4 font-bold">
                  {item.stok}
                </td>

                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => tambahStok(index)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    +
                  </button>

                  <button
                    onClick={() => kurangStok(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    -
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

export default StokBarang;