// src/pages/vendors/[id].jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditVendor() {
  const router = useRouter();
  const { id } = router.query;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) return;
    const fetchVendor = async () => {
      try {
        const res = await fetch(`/api/vendors/${id}`);
        const data = await res.json();
        if (data.success) {
          setVendor(data.vendor);
        }
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validation rules
  const validateForm = () => {
    let newErrors = {};

    if (!vendor.vendorName?.trim()) newErrors.vendorName = "Vendor name is required";
    if (!vendor.businessName?.trim()) newErrors.businessName = "Business name is required";

    if (!vendor.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!vendor.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(vendor.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (vendor.gstNumber && !/^[0-9A-Z]{15}$/.test(vendor.gstNumber)) {
      newErrors.gstNumber = "Invalid GST number (15 characters, alphanumeric)";
    }

    if (vendor.aadharNumber && !/^\d{12}$/.test(vendor.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar must be 12 digits";
    }

    if (vendor.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(vendor.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    // Address validation (optional but recommended)
    if (!vendor.address?.street) newErrors.street = "Street is required";
    if (!vendor.address?.city) newErrors.city = "City is required";
    if (!vendor.address?.state) newErrors.state = "State is required";
    if (!vendor.address?.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(vendor.address.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!vendor.address?.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("❌ Validation failed:", errors);
      return;
    }

    try {
      const res = await fetch(`/api/vendors/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });

      const data = await res.json();
      if (data.success) {
        alert("Vendor updated successfully!");
        router.push("/vendor");
      } else {
        alert("Failed to update vendor");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!vendor) return <p className="p-6">Vendor not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Vendor</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Vendor Name */}
        <div>
          <label className="block font-medium">Vendor Name</label>
          <input
            type="text"
            name="vendorName"
            value={vendor.vendorName || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.vendorName && <p className="text-red-500 text-sm">{errors.vendorName}</p>}
        </div>

        {/* Business Name */}
        <div>
          <label className="block font-medium">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={vendor.businessName || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={vendor.email || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={vendor.phone || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Address */}
        <h2 className="text-lg font-semibold mt-4">Address</h2>
        {["street", "city", "state", "pincode", "country"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={vendor.address?.[field] || ""}
              onChange={(e) =>
                setVendor((prev) => ({
                  ...prev,
                  address: { ...prev.address, [field]: e.target.value },
                }))
              }
              className="border px-3 py-2 w-full rounded"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        {/* GST */}
        <div>
          <label className="block font-medium">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={vendor.gstNumber || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.gstNumber && <p className="text-red-500 text-sm">{errors.gstNumber}</p>}
        </div>

        {/* Aadhar */}
        <div>
          <label className="block font-medium">Aadhar Number</label>
          <input
            type="text"
            name="aadharNumber"
            value={vendor.aadharNumber || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.aadharNumber && <p className="text-red-500 text-sm">{errors.aadharNumber}</p>}
        </div>

        {/* PAN */}
        <div>
          <label className="block font-medium">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={vendor.panNumber || ""}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {errors.panNumber && <p className="text-red-500 text-sm">{errors.panNumber}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={vendor.status || "active"}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Vendor
        </button>
      </form>
    </div>
  );
}
