import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Award, CreditCard, Users, BarChart3,
  RefreshCw, Target
} from "lucide-react";
import API from "../api"; 
import { useNavigate } from "react-router-dom"; // ✅ added

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topCustomers, setTopCustomers] = useState([]);
  const [loadingTopCustomers, setLoadingTopCustomers] = useState(false);

  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    fetchSummary();
    fetchTopCustomers();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/policy/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCustomers = async () => {
    try {
      setLoadingTopCustomers(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/customer/top", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopCustomers(res.data.slice(0,5));
    } catch (err) {} 
    finally {
      setLoadingTopCustomers(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 border border-white/20">
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center text-green-500 text-sm font-semibold animate-pulse">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{trend}%
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="ml-4 text-lg text-gray-600 animate-pulse">Loading analytics...</p>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center shadow-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <RefreshCw className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchSummary}
              className="mt-2 text-red-700 hover:text-red-800 font-medium underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  if (!summary) return null;

  const barData = [
    { name: "Total Transactions", value: summary.totalTransactions, fill: "#6366f1" },
    { name: "Points Issued", value: summary.totalPointsIssued, fill: "#22c55e" },
    { name: "Points Redeemed", value: summary.totalPointsRedeemed, fill: "#ef4444" },
    { name: "Outstanding Points", value: summary.outstandingPoints, fill: "#3b82f6" },
  ];

  const pieData = [
    { name: "Points Issued", value: summary.totalPointsIssued, fill: "#22c55e" },
    { name: "Points Redeemed", value: summary.totalPointsRedeemed, fill: "#ef4444" },
    { name: "Outstanding", value: summary.outstandingPoints, fill: "#3b82f6" },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold">{label || payload[0].payload.name}</p>
          <p className="text-blue-300">Value: {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = pieData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-300">{data.value.toLocaleString()} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 animate-gradient-x">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 animate-text-shimmer mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Comprehensive overview of your reward policy performance</p>
            </div>

            {/*  Dashboard  */}
            <div className="flex gap-4">
              <button
                onClick={fetchSummary}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5 mr-2 animate-spin-slow" />
                Refresh Data
              </button>

              <button
                onClick={() => navigate("/business")}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Transactions" value={summary.totalTransactions} icon={CreditCard} color="#6366f1" trend="12.5" />
          <StatCard title="Points Issued" value={summary.totalPointsIssued} icon={Award} color="#22c55e" trend="8.3" />
          <StatCard title="Points Redeemed" value={summary.totalPointsRedeemed} icon={Users} color="#ef4444" trend="15.2" />
          <StatCard title="Outstanding Points" value={summary.outstandingPoints} icon={TrendingUp} color="#3b82f6" trend="5.7" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="xl:col-span-2">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mr-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
                  <p className="text-gray-600">Detailed breakdown of key metrics</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} stroke="#ffffff" strokeWidth={2}>
                      {barData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Points Distribution</h2>
                  <p className="text-gray-600">Current allocation breakdown</p>
                </div>
              </div>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" stroke="#ffffff" strokeWidth={3}>
                      {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers Leaderboard */}
        <div className="max-w-7xl mx-auto p-6 mt-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">🏆 Top Customers Leaderboard</h2>
          {loadingTopCustomers ? (
            <p>Loading leaderboard...</p>
          ) : topCustomers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Tier</th>
                    <th className="text-center p-4">Total Spent</th>
                    <th className="text-center p-4">Points Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map(({ customerId, name, email, tier, totalSpent, totalPoints }, idx) => (
                    <tr key={customerId} className={`border-b border-gray-200 hover:bg-blue-50 transition ${idx===0 ? "bg-yellow-50 font-bold" : idx===1 ? "bg-gray-100 font-semibold" : idx===2 ? "bg-gray-50 font-semibold" : ""}`}>
                      <td className="p-4">{idx===0 ? "🥇 " : idx===1 ? "🥈 " : idx===2 ? "🥉 " : ""}{name}</td>
                      <td className="p-4">{email}</td>
                      <td className="p-4">{tier}</td>
                      <td className="text-center p-4">₹{totalSpent?.toFixed(2)}</td>
                      <td className="text-center p-4">{totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
