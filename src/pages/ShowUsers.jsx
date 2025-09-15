import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { UserCheck, Search } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/customer/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeColor = (points) => {
    if (points > 500) return "bg-green-500";
    if (points > 200) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* ✅ Navbar */}
      <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Reward Management System</h1>
        <nav className="space-x-4">
          <button
            onClick={() => navigate("/business")}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-10 h-10 text-purple-500" />
            Registered Customers
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Loading/Error */}
        {loading && <p className="text-gray-600">Loading customers...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {filteredCustomers.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg
              className="w-32 h-32 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>No customers match your search.</p>
          </div>
        )}

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-purple-500 cursor-pointer"
              onClick={() => navigate(`/business/users/${customer._id}`)}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {customer.name}
              </h2>
              <p className="text-gray-700 mb-2">{customer.email}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-700 font-medium">Points Balance</p>
                <span
                  className={`px-3 py-1 text-white rounded-full font-semibold shadow-md ${getBadgeColor(
                    customer.pointsBalance
                  )}`}
                >
                  {customer.pointsBalance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;
