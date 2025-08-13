// ✅ src/components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

const Layout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Routes where sidebar/topbar should be hidden
  const hideLayoutForRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password"
  ];
  const shouldHideLayout = hideLayoutForRoutes.includes(location.pathname);

  if (shouldHideLayout) {
    // Render only the page content + footer without sidebar/topbar
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={user?.role} />
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
