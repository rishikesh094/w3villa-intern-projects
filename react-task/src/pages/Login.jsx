import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwriter/auth";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [error, setError] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const session = await authService.login(formData.email, formData.password);
    console.log("✅ Login successful:", session);
toast.success("Login successful!");
    await fetchUser(); // 🔄 Update user context

    navigate("/"); // ✅ Redirect after context update
  } catch (err) {
    toast.error("Something went wrong!");
    console.error("❌ Login failed:", err);
    toast.error("Login failed. Please check your credentials.");
    setError("Invalid email or password.");
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign in to your account
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-white font-semibold hover:bg-indigo-700"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
