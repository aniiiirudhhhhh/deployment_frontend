import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CustomerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all transactions without pagination
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const historyRes = await api.get("/transactions/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const txns = Array.isArray(historyRes.data.transactions)
        ? historyRes.data.transactions
        : [];
      setTransactions(txns);
      setError("");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/dashboard");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/customer")}
        >
          Loyalty Program
        </h1>
        <nav className="flex items-center space-x-4 md:space-x-6">
          <button
            onClick={() => navigate("/customer")}
            className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-white font-semibold"
          >
            Dashboard
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-start">
        <div className="w-full max-w-5xl bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
            Transaction History
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-600">No transactions found.</p>
          ) : (
            <div
              className="grid gap-4 md:grid-cols-2"
              role="list"
              aria-label="Customer transaction history"
            >
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="border rounded-xl p-5 shadow-md bg-gradient-to-r from-indigo-50 to-blue-50 hover:shadow-xl transition"
                  role="listitem"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    Amount: <span className="text-indigo-600">₹{t.amount}</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Category:</strong> {t.category}
                  </p>
                  <p className="text-green-600 font-semibold">
                    + Earned Points: {t.earnedPoints}
                  </p>
                  <p className="text-red-600 font-semibold">
                    - Redeemed Points: {t.redeemedPoints}
                  </p>
                  <p className="text-blue-700 font-bold">Final Balance: {t.finalPoints}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerTransactions;
