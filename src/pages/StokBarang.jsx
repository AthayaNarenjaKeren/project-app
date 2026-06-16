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
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Stok Gudang
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow-md">

        <table className="w-full border-collapse">

          {/* HEADER */}
          <thead>
            <tr className="bg-gray-100 text-gray-800 text-sm">
              <th className="px-6 py-4 text-left font-bold">
                Nama Barang
              </th>
              <th className="px-6 py-4 text-center font-bold">
                Kategori
              </th>
              <th className="px-6 py-4 text-center font-bold">
                Stok
              </th>
              <th className="px-6 py-4 text-center font-bold">
                Aksi
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {stok.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-blue-50 transition h-[64px]"
              >
                {/* NAMA */}
                <td className="px-6 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-semibold">
                      {item.nama.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-800">
                      {item.nama}
                    </span>
                  </div>
                </td>

                {/* KATEGORI */}
                <td className="px-6 text-center align-middle font-medium text-gray-700">
                  {item.kategori}
                </td>

                {/* STOK */}
                <td className="px-6 text-center align-middle font-semibold text-gray-800">
                  {item.stok}
                </td>

                {/* AKSI */}
                <td className="px-6 align-middle">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => tambahStok(index)}
                      className="bg-blue-500 hover:bg-blue-600 active:bg-blue-500 focus:outline-none text-white w-8 h-8 rounded-md font-bold transition flex items-center justify-center"
                    >
                      +
                    </button>

                    <button
                      onClick={() => kurangStok(index)}
                      className="bg-blue-100 hover:bg-blue-200 active:bg-blue-100 focus:outline-none text-blue-600 w-8 h-8 rounded-md font-bold transition flex items-center justify-center"
                    >
                      -
                    </button>
                  </div>
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