import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { ArrowLeft, DollarSign, Gift, RefreshCcw, TrendingUp } from "lucide-react";

const TransHistory = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/transactions/customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(res.data.customer);
        setTransactions(res.data.transactions);
        setError("");
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [customerId, token]);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-700 font-semibold transition mb-6 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Customers
      </button>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-purple-700">
          {customer?.name || "Customer"}'s Transactions
        </h1>
        <p className="text-gray-600 mt-2">
          A detailed history of purchases, earned & redeemed points.
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Loader & Errors */}
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
        {transactions.length === 0 && !loading && (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}

        {/* Transactions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 font-semibold text-lg text-purple-700">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  ₹{t.amount}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="mb-2 text-gray-700">
                <strong className="text-yellow-500">Category:</strong> {t.category}
              </p>
              <p className="mb-2 flex items-center gap-2 text-gray-700">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <strong>Earned:</strong> {t.earnedPoints}
              </p>
              <p className="mb-2 flex items-center gap-2 text-gray-700">
                <RefreshCcw className="w-4 h-4 text-red-500" />
                <strong>Redeemed:</strong> {t.redeemedPoints}
              </p>
              <p className="mb-2 flex items-center gap-2 text-gray-700">
                <Gift className="w-4 h-4 text-purple-500" />
                <strong>Final Balance:</strong> {t.finalPoints}
              </p>

              <p className="text-xs opacity-60 mt-3 text-right text-gray-500">
                {new Date(t.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransHistory;
