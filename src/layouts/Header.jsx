function Header() {
    return (
      <header className="h-24 bg-white flex items-center justify-between px-8 border-b border-gray-200">
        <div className="bg-gray-100 rounded-full px-6 py-3 w-96 text-gray-500">
          Cari barang atau transaksi...
        </div>
  
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h3 className="font-semibold text-gray-800">
              Admin Toko
            </h3>
  
            <p className="text-gray-400 text-sm">
              Flora Banguntama
            </p>
          </div>
  
          <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </header>
    );
  }
  
  export default Header;