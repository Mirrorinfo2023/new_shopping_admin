// src/pages/Login.jsx
"use client"; // if using app router

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser, selectAuthStatus } from "@/redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const status = useSelector(selectAuthStatus);

  const [credentials, setCredentials] = useState({
    email: "admin@test.com",
    password: "Test@123",
    company_id: "67e920003c16eb613ed5e8a9",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await dispatch(loginUser(credentials)).unwrap();
      router.push("/dashboard/new");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err?.message || "Invalid email or password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-900 to-blue-600">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-[420px]">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Mirror</h2>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              value={credentials.email}
              onChange={handleInputChange}
              disabled={status === "loading"}
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 border-gray-300"
              value={credentials.password}
              onChange={handleInputChange}
              disabled={status === "loading"}
            />
            <button
              type="button"
              className="absolute top-10 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
              disabled={status === "loading"}
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-500" />
              ) : (
                <Eye size={20} className="text-gray-500" />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 mb-4 text-sm bg-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
