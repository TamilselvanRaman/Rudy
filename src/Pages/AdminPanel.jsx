import React, { useState } from "react";
import { FaChartBar, FaBoxOpen, FaSignOutAlt, FaBars } from "react-icons/fa";
import Dashboard from "../Components/SalesChart";
import ProjectEntry from "../Components/ProductEntry";
import ProductManagement from "../Components/ProductManagement"; // ← Make sure this file exists

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // default selected

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 max-w-full mx-auto bg-white shadow rounded-xl">
            <Dashboard />
          </div>
        );
      case "products":
        return (
          <div className="p-6 max-w-full mx-auto bg-white shadow rounded-xl">
            <ProjectEntry />
          </div>
        );
      case "productManagement":
        return (
          <div className="p-6 max-w-full mx-auto bg-white shadow rounded-xl">
            <ProductManagement />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-50`}
      >
        <div className="text-2xl font-bold text-center text-indigo-600">
          Admin Panel
        </div>
        <nav className="mt-10">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 w-full text-left rounded-md ${
              activeTab === "dashboard"
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-700 hover:bg-indigo-50"
            }`}
          >
            <FaChartBar />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("productManagement");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 w-full text-left rounded-md ${
              activeTab === "productManagement"
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-700 hover:bg-indigo-50"
            }`}
          >
            <FaBoxOpen />
            <span>Products Management</span>
          </button>

          <button
            onClick={() => {
              alert("Logging out...");
              // Add logout logic here
            }}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-red-100 rounded-md"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600"
          >
            <FaBars size={24} />
          </button>
          <h1 className="text-xl font-semibold text-indigo-600">
            Admin Dashboard
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminPanel;
