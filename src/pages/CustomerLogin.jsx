import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);      // toggle login/register
  const [name, setName] = useState("");              // only for register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");        // only for register
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let res;
      if (isLogin) {
        // Customer login (no adminId needed!)
        res = await API.post("/auth/customer/login", { email, password });
      } else {
        // Customer register (adminId required)
        res = await API.post("/auth/customer/register", { name, email, password, adminId });
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/customer"); // Redirect to /customer after login/register
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Customer Login" : "Customer Registration"}
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!isLogin && (
          <>
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              className="border p-2 mb-4 w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </>
        )}

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          className="border p-2 mb-4 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          className="border p-2 mb-4 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Only show Admin ID input for registration */}
        {!isLogin && (
          <>
            <label className="block mb-2 font-semibold">Admin ID</label>
            <input
              type="text"
              className="border p-2 mb-6 w-full rounded"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              placeholder="Enter your Admin's ID"
            />
          </>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded text-white font-semibold ${
            isLogin ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {isLogin ? "Login as Customer" : "Register as Customer"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setName("");
              setEmail("");
              setPassword("");
              setAdminId("");
            }}
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default CustomerLogin;
