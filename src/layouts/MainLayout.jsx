import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout() {
  return (
    <div className="flex bg-base-200 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8 bg-base-200 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
