'use client';

import React, { useState } from "react";
import { useRouter } from "next/router";

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!validateEmail(email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            // API call simulation (replace with your actual API)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("Password reset link sent to your email.");
            router.push("/"); // redirect to login page
        } catch (err) {
            alert("Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-900 to-blue-600">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-[420px]">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
                    Forgot Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </div>

                    {/* Back to login */}
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Remember your password?{" "}
                        <span
                            className="text-indigo-600 cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

ForgotPassword.noLayout = true;
export default ForgotPassword;
