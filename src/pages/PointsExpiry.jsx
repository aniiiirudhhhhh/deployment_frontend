import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Clock, UserCheck } from "lucide-react";

const PointsExpiry = () => {
  const [expiringPointsList, setExpiringPointsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [minPointsFilter, setMinPointsFilter] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpiringPoints();
  }, []);

  const fetchExpiringPoints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions/points-expiry", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpiringPointsList(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load expiring points");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = expiringPointsList.filter(
    (p) => p.expiringPoints >= minPointsFilter
  );

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-purple-100 via-white to-blue-100 p-8 overflow-y-auto">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            className="text-blue-700 hover:text-blue-900 transition flex items-center gap-1 font-medium"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Clock className="w-9 h-9 text-purple-600 animate-pulse" />
            Points Expiry Management
          </h1>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border">
          <label className="text-gray-800 font-semibold">Show points ≥</label>
          <input
            type="number"
            value={minPointsFilter}
            onChange={(e) => setMinPointsFilter(Number(e.target.value))}
            className="border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none p-2 rounded-lg w-28 text-center text-gray-900 font-medium"
            min={0}
          />
        </div>

        {/* Loader / Error */}
        {loading && (
          <p className="text-gray-600 animate-pulse text-lg">Loading...</p>
        )}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Empty State */}
        {filteredList.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 text-lg font-medium">
              No customers have points expiring soon.
            </p>
          </div>
        )}

        {/* Expiring Points List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(({ customerId, name, email, expiringPoints }) => (
            <div
              key={customerId}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border-l-4 border-purple-600 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-6 h-6 text-purple-700" />
                  <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                </div>
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> {email}
                </p>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                  {expiringPoints} Points
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsExpiry;
