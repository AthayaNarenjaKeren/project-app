import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl grid grid-cols-2 overflow-hidden">
        <div className="bg-blue-500 text-white p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Flora Banguntama</h1>
        </div>

        <div className="p-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;