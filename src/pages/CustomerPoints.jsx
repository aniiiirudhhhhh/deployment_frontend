import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const POINTS_EXPIRY_WARNING_DAYS = 30;

const CustomerPoints = () => {
  const [pointsBalance, setPointsBalance] = useState(0);
  const [tier, setTier] = useState("No tier assigned");
  const [tierBenefits, setTierBenefits] = useState("");
  const [pointsExpiryDays, setPointsExpiryDays] = useState(0);
  const [expiringPoints, setExpiringPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New state for exact days until points expire
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(null);
  // Map for tier benefits fetched from backend
  const [tierBenefitsMap, setTierBenefitsMap] = useState({});

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const calculateExpiringPoints = (pointsHistory) => {
    if (!pointsHistory) return 0;
    const now = new Date();
    return pointsHistory
      .filter(
        (p) =>
          !p.redeemed &&
          new Date(p.expiresAt) > now &&
          (new Date(p.expiresAt) - now) / (1000 * 60 * 60 * 24) <=
            POINTS_EXPIRY_WARNING_DAYS
      )
      .reduce((sum, p) => sum + p.points, 0);
  };

  // New: Calculate exact days until soonest points expire
  const calculateDaysUntilExpiry = (pointsHistory) => {
    if (!pointsHistory || pointsHistory.length === 0) return null;
    const now = new Date();
    const validPoints = pointsHistory.filter(
      (p) => !p.redeemed && new Date(p.expiresAt) > now
    );
    if (validPoints.length === 0) return null;
    const daysList = validPoints.map((p) =>
      Math.ceil((new Date(p.expiresAt) - now) / (1000 * 60 * 60 * 24))
    );
    return Math.min(...daysList);
  };

  // Fetch tier benefits map from backend policy controller
  const fetchTierBenefits = async (adminId) => {
  try {
    const res = await api.get(`/admin/policy/customer-tier-rules/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const map = {};
    res.data.tierRules?.forEach(rule => {
      map[rule.tierName] = rule.benefits || "No benefits defined.";
    });
    setTierBenefitsMap(map);
  } catch (err) {
    console.error("Failed to fetch tier benefits:", err);
  }
};

  useEffect(() => {
    const fetchPointsInfo = async () => {
      try {
        setLoading(true);
        const res = await api.get("/customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setPointsBalance(data.points || data.pointsBalance || 0);
        setTier(data.tier || "No tier assigned");
        setPointsExpiryDays(data.pointsExpiryDays || 365);
        setExpiringPoints(calculateExpiringPoints(data.pointsHistory));
        setDaysUntilExpiry(calculateDaysUntilExpiry(data.pointsHistory));

        if (data.adminId) {
          await fetchTierBenefits(data.adminId);
        }

        setError("");
      } catch (err) {
        console.error("Error fetching points info:", err);
        setError("Failed to load points and tier information.");
      } finally {
        setLoading(false);
      }
    };

    fetchPointsInfo();
  }, [token]);

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
      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">
            Your Points & Tier Information
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-indigo-900 mb-4">
                Points Available: <span>{pointsBalance}</span>
              </p>

              {/* Expiring Points Warning with exact days */}
              {expiringPoints > 0 && daysUntilExpiry !== null && (
                <p className="text-red-600 font-semibold mb-4">
                  ⚠️ You have <strong>{expiringPoints}</strong> points expiring in{" "}
                  <strong>{daysUntilExpiry}</strong> day{daysUntilExpiry > 1 ? "s" : ""}!
                </p>
              )}

              <p className="text-xl font-semibold mb-2">Tier: {tier}</p>
              <p className="text-gray-700">
                {tierBenefitsMap[tier] || "No benefits available for this tier."}
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerPoints;
