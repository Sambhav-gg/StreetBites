import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Link } from "react-router-dom";
import { MdAddBusiness } from "react-icons/md";
import { FaStore, FaChartBar, FaCog, FaReceipt } from "react-icons/fa";
import axios from "axios";
import VendorStallCard from "../shared/VendorStallCard";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { name: "Your Stalls", icon: <FaStore />, route: "/vendor/dashboard" },
  { name: "Orders", icon: <FaReceipt />, route: "/vendor/orders" },
  { name: "Analytics", icon: <FaChartBar />, route: "/vendor/analytics" },
  { name: "Settings", icon: <FaCog />, route: "/vendor/settings" },
];

const VendorHomePage = () => {
  const [userStalls, setUserStalls] = useState([]);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const res = await axios.get("/api/stalls/vendor", {
          withCredentials: true,
        });
        setUserStalls(res.data); // Set fetched stalls
      } catch (err) {
        console.error("Failed to fetch vendor stalls", err);
      }
    };

    fetchStalls();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Vendor Panel</h2>
        <nav className="space-y-4">
          {sidebarItems.map((item, idx) => (
            <Link
              to={item.route}
              key={idx}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-500 transition"
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          ))}

          {/* 🔒 Locked Promote Feature */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-400 cursor-not-allowed select-none">
            🔒 <span>Promote Your Stalls</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Your Stalls</h1>
            <Link
              to="/vendor/stalls/add"
              className="bg-red-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-red-600 transition"
            >
              + Add Stall
            </Link>
          </div>

          {userStalls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MdAddBusiness className="text-5xl text-red-400 mb-4" />
              <p className="text-lg mb-4">You haven't added any stalls yet.</p>
              <Link
                to="/vendor/stalls/add"
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Add Stall
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userStalls.map((stall) => (
                <VendorStallCard
                  key={stall._id}
                  stall={stall}
                  onEdit={(stall) =>
                    navigate(`/vendor/stalls/${stall._id}/edit`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorHomePage;
