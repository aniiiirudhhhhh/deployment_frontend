import React, { useEffect, useState, useMemo } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Search, Users, Star, Crown, Gem, Info } from "lucide-react";

const TierManagement = () => {
  const [tierRules, setTierRules] = useState([]);
  const [form, setForm] = useState({
    tierName: "Silver",
    minPoints: "",
    multiplier: 1,
    benefits: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customers, setCustomers] = useState([]);
  const [updatingTierFor, setUpdatingTierFor] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTierRules();
    fetchCustomers();
  }, []);

  const fetchTierRules = async () => {
    try {
      const res = await API.get("/admin/policy/tier", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTierRules(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load tier rules");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customer/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.minPoints) {
      alert("Minimum points is required");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        tierName: form.tierName,
        minPoints: Number(form.minPoints),
        multiplier: Number(form.multiplier),
        benefits: form.benefits,
      };
      const res = await API.post("/admin/policy/tier", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message || "Tier rule saved");
      fetchTierRules();
      setForm({ tierName: "Silver", minPoints: "", multiplier: 1, benefits: "" });
    } catch (err) {
      alert("Error saving tier rule");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerTierChange = (customerId, newTier) => {
    setCustomers((prev) =>
      prev.map((c) => (c._id === customerId ? { ...c, tier: newTier } : c))
    );
  };

  const saveCustomerTier = async (customerId, tier) => {
    setUpdatingTierFor(customerId);
    try {
      await API.put(
        `/customer/${customerId}/tier`,
        { tier },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Customer tier updated successfully");
      fetchCustomers();
    } catch (err) {
      alert("Failed to update customer tier");
    } finally {
      setUpdatingTierFor(null);
    }
  };

  // Tier priority map
  const tierPriority = {
    Platinum: 3,
    Gold: 2,
    Silver: 1,
    "": 0,
  };

  const filteredCustomers = useMemo(() => {
    let list = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "name") {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "tier") {
      list = list.sort(
        (a, b) => tierPriority[b.tier || ""] - tierPriority[a.tier || ""]
      );
    }

    return list;
  }, [customers, search, sortBy]);

  const totalCustomers = customers.length;
  const silverCount = customers.filter((c) => c.tier === "Silver").length;
  const goldCount = customers.filter((c) => c.tier === "Gold").length;
  const platinumCount = customers.filter((c) => c.tier === "Platinum").length;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4 md:mb-0">
          Tier Management
        </h1>
        <button
          onClick={() => navigate("/business")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
        >
          Dashboard
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full">
        <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
          <Users className="text-indigo-600" size={28} />
          <div>
            <p className="text-gray-500 text-sm">Total Customers</p>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
          <Star className="text-gray-500" size={28} />
          <div>
            <p className="text-gray-500 text-sm">Silver</p>
            <p className="text-2xl font-bold">{silverCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
          <Crown className="text-yellow-500" size={28} />
          <div>
            <p className="text-gray-500 text-sm">Gold</p>
            <p className="text-2xl font-bold">{goldCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
          <Gem className="text-purple-600" size={28} />
          <div>
            <p className="text-gray-500 text-sm">Platinum</p>
            <p className="text-2xl font-bold">{platinumCount}</p>
          </div>
        </div>
      </div>

      {/* Tier Rules */}
      <section className="mb-16 w-full">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Tier Rules</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {tierRules.length === 0 ? (
          <p>No tier rules defined yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {tierRules.map((rule) => (
              <div
                key={rule.tierName}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition mb-4 lg:mb-0"
              >
                <h3 className="text-2xl font-bold text-indigo-600 mb-3">
                  {rule.tierName}
                </h3>
                <p className="text-gray-700 mb-1">
                  Min Points: <strong>{rule.minPoints}</strong>
                </p>
                <p className="text-gray-700 mb-1">
                  Multiplier: <strong>{rule.multiplier}</strong>
                </p>
                <p className="text-gray-700">{rule.benefits || "N/A"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Form Section */}
      <section className="mb-16 w-full">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Add / Edit Tier Rule</h2>
        <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div>
            <label className="block text-sm font-semibold mb-2">Tier Name</label>
            <select
              name="tierName"
              value={form.tierName}
              onChange={handleChange}
              className="border p-3 w-full rounded"
            >
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Minimum Points</label>
            <input
              type="number"
              name="minPoints"
              value={form.minPoints}
              onChange={handleChange}
              className="border p-3 w-full rounded"
              placeholder="e.g., 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center">
              Multiplier <Info className="w-4 h-4 ml-2 text-gray-400" />
            </label>
            <input
              type="number"
              name="multiplier"
              value={form.multiplier}
              onChange={handleChange}
              step="0.1"
              min="1"
              className="border p-3 w-full rounded"
              placeholder="e.g., 1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Benefits</label>
            <input
              type="text"
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              className="border p-3 w-full rounded"
              placeholder="Enter tier benefits"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 w-full"
            >
              {loading ? "Saving..." : "Save Tier Rule"}
            </button>
          </div>
        </div>
      </section>

      {/* Customers Table */}
      <section className="w-full">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Customers & Tiers</h2>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center bg-white px-4 py-3 rounded shadow w-full md:w-1/3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 w-full outline-none"
            />
          </div>
          <div className="w-full md:w-auto">
            <label className="mr-2 text-sm font-semibold">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-3 rounded w-full md:w-auto"
            >
              <option value="name">Name</option>
              <option value="tier">Tier</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow w-full">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-sm font-semibold">Current Tier</th>
                <th className="px-6 py-3 text-sm font-semibold">Update Tier</th>
                <th className="px-6 py-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 break-words">{customer.name}</td>
                  <td className="px-6 py-3 break-words">{customer.email}</td>
                  <td className="px-6 py-3">
                    {customer.tier ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.tier === "Silver"
                            ? "bg-gray-200 text-gray-800"
                            : customer.tier === "Gold"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-purple-200 text-purple-800"
                        }`}
                      >
                        {customer.tier}
                      </span>
                    ) : (
                      "No tier"
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={customer.tier || ""}
                      onChange={(e) =>
                        handleCustomerTierChange(customer._id, e.target.value)
                      }
                      className="border p-2 rounded w-full"
                    >
                      <option value="">No tier</option>
                      {tierRules.map((rule) => (
                        <option key={rule.tierName} value={rule.tierName}>
                          {rule.tierName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      disabled={updatingTierFor === customer._id}
                      onClick={() => saveCustomerTier(customer._id, customer.tier)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 w-full"
                    >
                      {updatingTierFor === customer._id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TierManagement;
