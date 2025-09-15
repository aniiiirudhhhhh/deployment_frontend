import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const POINTS_EXPIRY_WARNING_DAYS = 30;

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [lifetimeSpend, setLifetimeSpend] = useState(0);
  const [tier, setTier] = useState("No tier assigned");
  const [expiringPoints, setExpiringPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const calculateActivePoints = (pointsHistory) => {
    if (!pointsHistory) return 0;
    const now = new Date();
    return pointsHistory
      .filter((p) => !p.redeemed && new Date(p.expiresAt) > now)
      .reduce((sum, p) => sum + p.points, 0);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, transactionsRes] = await Promise.all([
          api.get("/customer/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/transactions/history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const profileData = profileRes.data;

        setProfile(profileData);
        setPointsBalance(calculateActivePoints(profileData.pointsHistory));
        setTier(profileData.tier || "No tier assigned");
        setExpiringPoints(calculateExpiringPoints(profileData.pointsHistory));

        const transactions = transactionsRes.data.transactions || [];
        const totalSpend = transactions.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        );
        setLifetimeSpend(totalSpend);

        setError("");
      } catch (err) {
        console.error("Error fetching profile or transactions:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

      {/* Profile Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-white rounded-2xl p-6 md:p-8 shadow-lg mt-4 mb-6">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
            Customer Profile
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading profile...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : profile ? (
            <div className="text-gray-800 space-y-4">
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Tier:</strong> {tier}
              </p>
              <p>
                <strong>Points Balance:</strong> {pointsBalance}
              </p>
              {expiringPoints > 0 && (
                <p className="text-red-600 font-semibold">
                  ⚠️ You have <strong>{expiringPoints}</strong> points expiring
                  within {POINTS_EXPIRY_WARNING_DAYS} days!
                </p>
              )}
              <p>
                <strong>Lifetime Spend:</strong> ₹
                {lifetimeSpend.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No profile data available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
