import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../api";
import {
  UserCircle,
  ChevronDown,
  Menu,
  X,
  Users,
  BarChart3,
  Layers,
  ShieldCheck,
} from "lucide-react";

const Business = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const profileRef = useRef(null);

  useEffect(() => {
    fetchPolicy();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/policy", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicy(res.data);
      setError("");
    } catch (err) {
      setPolicy(null);
      setError("No policy found. Create a new policy to get started!");
    } finally {
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileMenuOpen(false);
    navigate("/dashboard");
  };

  const navLinks = [
    { name: "Policy", path: "/business/policy" },
    { name: "Customers", path: "/business/users" },
    { name: "Tier Management", path: "/business/tiers" },
    { name: "Analytics", path: "/business/analytics" },
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-extrabold text-indigo-700 cursor-pointer tracking-wide"
            onClick={() => navigate("/business")}
          >
            Reward Management System
          </h1>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "relative text-indigo-700 font-semibold pb-1 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-indigo-700 after:left-0 after:bottom-0"
                    : "text-gray-600 hover:text-indigo-700 transition font-medium"
                }
              >
                {name}
              </NavLink>
            ))}

            {/* Profile dropdown */}
            <div className="relative ml-6" ref={profileRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                aria-haspopup="true"
                aria-expanded={profileMenuOpen}
              >
                <UserCircle className="w-8 h-8 text-indigo-600" />
                <span className="font-semibold text-gray-700">{user?.name || "Admin"}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg border-t border-gray-100">
            <ul className="flex flex-col space-y-2 py-4 px-6">
              {navLinks.map(({ name, path }) => (
                <li key={name}>
                  <NavLink
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "block text-indigo-700 font-semibold border-l-4 border-indigo-700 pl-3 py-2"
                        : "block text-gray-700 hover:text-indigo-700 transition"
                    }
                  >
                    {name}
                  </NavLink>
                </li>
              ))}
              <li className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left text-gray-700 hover:text-indigo-700 transition px-3 py-2"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto p-6 flex flex-col space-y-10">
        {/* Welcome */}
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome,
            <span className="text-indigo-600 ml-2">{user?.name || "Business"}</span>
          </h2>
          {user?._id && (
            <p className="text-sm text-gray-500 mb-4">
              <strong>Business ID:</strong> {user._id}
            </p>
          )}
          <p className="text-gray-600 text-lg max-w-xl">
            Manage your rewards program, customers, tier rules, and analytics to grow your business.
          </p>
        </section>

        {/* Policy Section */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          {loading ? (
            <p className="text-gray-500">Loading policy...</p>
          ) : error ? (
            <div className="text-yellow-900 bg-yellow-100 border border-yellow-300 p-4 rounded-2xl flex flex-col max-w-md">
              <p>{error}</p>
              <button
                onClick={() => navigate("/business/policy")}
                className="mt-4 self-start bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl hover:opacity-90 transition shadow-md"
              >
                Create New Policy
              </button>
            </div>
          ) : policy ? (
            <>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-600" /> Current Reward Policy
              </h3>
              <dl className="grid grid-cols-2 gap-y-3 gap-x-10 max-w-xl">
                <dt className="font-medium text-gray-700">Name:</dt>
                <dd className="text-gray-900">{policy.policyName}</dd>
                <dt className="font-medium text-gray-700">Description:</dt>
                <dd className="text-gray-900">{policy.description}</dd>
                <dt className="font-medium text-gray-700">Base Points:</dt>
                <dd className="text-gray-900">{policy.basePointsPerUnit}</dd>
                <dt className="font-medium text-gray-700">Redemption Rate:</dt>
                <dd className="text-gray-900">{policy.redemptionRate}</dd>
                <dt className="font-medium text-gray-700">Minimum Redeem Points:</dt>
                <dd className="text-gray-900">{policy.minRedeemPoints}</dd>
              </dl>
              <button
                onClick={() => navigate("/business/policy")}
                className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition shadow-md"
              >
                Edit Policy
              </button>
            </>
          ) : null}
        </section>

        {/* Sections Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customers Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" /> Registered Customers
            </h3>
            <p className="flex-grow text-gray-700 mb-6">
              View and manage your registered customers.
            </p>
            <button
              onClick={() => navigate("/business/users")}
              className="self-start bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition shadow-md"
            >
              View Customers
            </button>
          </div>

          {/* Tier Management Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-600" /> Tier Management
            </h3>
            <p className="flex-grow text-gray-700 mb-6">
              Manage tier rules like Silver, Gold, Platinum with multipliers and benefits.
            </p>
            <button
              onClick={() => navigate("/business/tiers")}
              className="self-start bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition shadow-md"
            >
              Edit Tier Rules
            </button>
          </div>

          {/* Analytics Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" /> Analytics Dashboard
            </h3>
            <p className="flex-grow text-gray-700 mb-6">
              Track insights and performance of your loyalty program.
            </p>
            <button
              onClick={() => navigate("/business/analytics")}
              className="self-start bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition shadow-md"
            >
              View Analytics
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Business;
