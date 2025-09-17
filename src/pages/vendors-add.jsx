"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

const VendorAdd = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    vendorName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
    businessType: "individual",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    },
  });

  const [kycFiles, setKycFiles] = useState({
    aadharFront: "front.jpg",
    aadharBack: "back.jpg",
    panCard: "pan.jpg",
    gstCertificate: "gst.jpg",
    businessLicense: "license.jpg",
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.vendorName.trim()) newErrors.vendorName = "Vendor name is required";
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.gstNumber.trim()) newErrors.gstNumber = "GST number is required";
    if (!formData.panNumber.trim()) newErrors.panNumber = "PAN number is required";
    if (!formData.aadharNumber.trim()) newErrors.aadharNumber = "Aadhar number is required";

    // Address
    Object.entries(formData.address).forEach(([key, value]) => {
      if (!value.trim()) newErrors[`address.${key}`] = `${key} is required`;
    });

    // Bank Details
    Object.entries(formData.bankDetails).forEach(([key, value]) => {
      if (!value.trim()) newErrors[`bankDetails.${key}`] = `${key} is required`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- CHANGE HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; 
    }

    try {
      const payload = {
        ...formData,
        kycDocuments: kycFiles,
      };

      console.log("Submitting vendor data:", payload);

      const response = await axios.post("/api/vendors/create", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        alert("Vendor created successfully!");
        router.push("/vendor");
      } else {
        alert("Failed to create vendor. Please check details.");
      }
    } catch (err) {
      console.error("Error creating vendor:", err.response?.data || err);
      alert("Failed to create vendor. Check console for details.");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      <Card className="max-w-5xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Add Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "vendorName",
                "businessName",
                "email",
                "phone",
                "password",
                "businessType",
                "gstNumber",
                "panNumber",
                "aadharNumber",
              ].map((field) => (
                <div key={field}>
                  <Label>{field}</Label>
                  <Input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Address */}
            <h2 className="text-xl font-semibold text-gray-700">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData.address).map((key) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <Input
                    name={`address.${key}`}
                    value={formData.address[key]}
                    onChange={handleChange}
                  />
                  {errors[`address.${key}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`address.${key}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Bank Details */}
            <h2 className="text-xl font-semibold text-gray-700">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData.bankDetails).map((key) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <Input
                    name={`bankDetails.${key}`}
                    value={formData.bankDetails[key]}
                    onChange={handleChange}
                  />
                  {errors[`bankDetails.${key}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`bankDetails.${key}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* KYC Documents */}
            <h2 className="text-xl font-semibold text-gray-700">
              KYC Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(kycFiles).map(([key, value]) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <Input
                    type="text"
                    name={key}
                    value={value}
                    onChange={(e) =>
                      setKycFiles((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Create Vendor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAdd;
