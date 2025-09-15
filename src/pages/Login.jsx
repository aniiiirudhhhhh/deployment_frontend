import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api"; // axios instance

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = location.state || { role: "customer" };

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminId: "", // ✅ required for customer registration
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let payload = {};

      if (role === "admin") {
        if (mode === "login") {
          endpoint = "/auth/admin/login";
          payload = { email: formData.email, password: formData.password };
        } else {
          endpoint = "/auth/admin/register";
          payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };
        }
      } else {
        // ✅ customer
        if (mode === "login") {
          endpoint = "/auth/customer/login";
          payload = {
            email: formData.email,
            password: formData.password,
            adminId: formData.adminId,
          };
        } else {
          endpoint = "/auth/customer/register";
          payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            adminId: formData.adminId,
          };
        }
      }

      const { data } = await api.post(endpoint, payload);

      // ✅ Store in common keys
      localStorage.setItem("user", JSON.stringify({ ...data, role }));
      localStorage.setItem("token", data.token);

      // ✅ Redirect based on role
      if (role === "admin") {
        navigate("/business");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      console.error("Error during auth:", err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "login"
            ? `Login as ${role === "admin" ? "Admin" : "Customer"}`
            : `Register as ${role === "admin" ? "Admin" : "Customer"}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* ✅ Admin ID only for customers */}
          {role === "customer" && (
            <input
              type="text"
              name="adminId"
              placeholder="Business / Admin ID"
              value={formData.adminId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
