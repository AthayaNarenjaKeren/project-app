import { useEffect, useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

function Notification({ barangMenipis, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto hilang setelah 8 detik
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible || barangMenipis.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-5 animate-slide-in">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-red-700 text-sm">
                ⚠️ Stok Menipis!
              </h4>
              <p className="text-red-600 text-sm mt-1">
                {barangMenipis.length} barang hampir habis:
              </p>
              <ul className="mt-2 space-y-1">
                {barangMenipis.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-sm text-red-600 flex justify-between">
                    <span>{item.nama_barang}</span>
                    <span className="font-bold">Stok: {item.stok}</span>
                  </li>
                ))}
                {barangMenipis.length > 5 && (
                  <li className="text-xs text-gray-500">
                    +{barangMenipis.length - 5} barang lainnya
                  </li>
                )}
              </ul>
              <button
                onClick={() => {
                  window.location.href = "/stok-barang";
                }}
                className="mt-3 text-xs bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                Lihat Semua →
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;