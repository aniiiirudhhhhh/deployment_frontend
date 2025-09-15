import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let res;

      if (isLogin) {
        // 🔹 Login API
        res = await API.post("/auth/admin/login", { email, password });

        // Save token & user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));

        // 👉 Directly navigate after login (no payment)
        navigate("/business");
      } else {
        // 🔹 Register API
        res = await API.post("/auth/admin/register", { name, email, password });

        // Save token & user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));

        // 👉 Start payment only for new registration
        await startPayment();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isLogin ? "Login failed" : "Registration failed")
      );
    }
  };

  // 🔹 Razorpay Payment
  const startPayment = async () => {
    try {
      // 1) Create order from backend
      const { data } = await API.post("/api/create-order", {
        amountInRupees: 2, // Example subscription amount
      });

      // 2) Load Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Reward Management System",
        description: "Admin Subscription Payment",
        order_id: data.id,
        handler: async function (response) {
          try {
            // 3) Verify payment with backend
            const verifyRes = await API.post("/api/verify-payment", response);
            if (verifyRes.data.ok) {
              alert("✅ Payment successful!");
              navigate("/business");
            } else {
              alert("❌ Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("❌ Error verifying payment");
          }
        },
        prefill: {
          name: name || "Admin User",
          email: email,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Payment initiation failed");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Admin Login" : "Admin Registration"}
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
              required={!isLogin}
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
          className="border p-2 mb-6 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`w-full py-3 rounded text-white font-semibold ${
            isLogin
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-green-600 hover:bg-green-700"
          } transition`}
        >
          {isLogin ? "Login as Admin" : "Register as Admin"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setName("");
              setEmail("");
              setPassword("");
            }}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
