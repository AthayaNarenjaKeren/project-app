import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const DataBarang = lazy(() => import("./pages/DataBarang"));
const Kasir = lazy(() => import("./pages/Kasir"));
const StokBarang = lazy(() => import("./pages/StokBarang"));
const Laporan = lazy(() => import("./pages/Laporan"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold">
            Loading halaman...
          </div>
        }
      >
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-barang" element={<DataBarang />} />
            <Route path="/kasir" element={<Kasir />} />
            <Route path="/stok-barang" element={<StokBarang />} />
            <Route path="/laporan" element={<Laporan />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;