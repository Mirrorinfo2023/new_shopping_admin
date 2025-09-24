"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [alert, setAlert] = useState({ open: false, type: false, message: null });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  // ✅ Separate validation function
  const validateForm = (username, password, captchaToken) => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!captchaToken) newErrors.captcha = "Please verify reCAPTCHA.";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username")?.trim();
    const password = formData.get("password")?.trim();

    // Client-side validation
    const newErrors = validateForm(username, password, captchaToken);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const reqData = { username, password, is_admin: 1, captchaToken };
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await axios.post(
        `${API_BASE_URL}/api/users/admin_login`,
        reqData
      );

      if (response.status === 200 && response.data.status === 200) {
        const userData = response.data.data;
        const token = response.data.token;

        // Save session
        sessionStorage.setItem("role", "user");
        sessionStorage.setItem("uid", userData.id);
        sessionStorage.setItem("email", userData.email);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("name", `${userData.first_name} ${userData.last_name}`);
        sessionStorage.setItem("mobile", userData.mobile);

        setAlert({ open: true, type: true, message: response.data.message });
        router.push("/dashboard/new");
      }
    } catch (err) {
      console.error(err);

      // If backend sends validation errors
      if (err.response?.data?.errors) {
        // Convert array of errors to object to show under fields if possible
        const fieldErrors = {};
        err.response.data.errors.forEach((message) => {
          if (message.toLowerCase().includes("username")) fieldErrors.username = message;
          else if (message.toLowerCase().includes("password")) fieldErrors.password = message;
          else fieldErrors.general = message;
        });
        setErrors(fieldErrors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-900 to-blue-600">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-[420px]">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Shopping Admin
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors.username
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              disabled={loading}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 pr-10 ${errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute top-8 right-3 text-gray-600 hover:text-gray-800 cursor-pointer mt-1"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Google reCAPTCHA */}
          <div>
            <Box sx={{ transform: "scale(.97)", transformOrigin: "0 0" }}>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={(value) => setCaptchaToken(value)}
              />
              {errors.captcha && (
                <Typography variant="caption" color="error">
                  {errors.captcha}
                </Typography>
              )}
            </Box>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-2 text-sm bg-red-100 text-red-600 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Forgot Password */}
          <p className="text-sm text-gray-500 text-center mt-2">
            Forgot password?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={() => router.replace("/forgot-password")}
            >
              Click here
            </span>
          </p>
        </form>
      </div>

      {/* ✅ Snackbar for alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.type ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

Login.noLayout = true;
export default Login;
