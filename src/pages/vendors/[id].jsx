// src/pages/vendors/[id].jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { 
  ArrowLeft, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  IdCard, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Save,
  Shield,
  BadgeCheck
} from "lucide-react";

export default function EditVendor() {
  const router = useRouter();
  const { id } = router.query;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchVendor = async () => {
      try {
        const res = await fetch(`${BASE_URL}vendors/${id}`);
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (field, value) => {
    setVendor((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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

    // Address validation
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
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}vendors/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Vendor updated successfully!");
        setTimeout(() => {
          router.push("/vendor");
        }, 2000);
      } else {
        setErrors({ submit: "Failed to update vendor. Please try again." });
      }
    } catch (err) {
      console.error("Update failed:", err);
      setErrors({ submit: "Network error. Please check your connection." });
    } finally {
      setSaving(false);
    }
  };

  // Custom UI Components
  const InputField = ({ label, name, value, onChange, type = "text", icon: Icon, placeholder, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'active' ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/vendor")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Vendors
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Vendor
              </h1>
              <p className="text-gray-600 mt-2">Update vendor information and details</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={vendor.status} />
              <div className="text-sm text-gray-500">Vendor ID: {id}</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Success!</p>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Basic Information */}
          <SectionCard title="Basic Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Vendor Name"
                name="vendorName"
                value={vendor.vendorName}
                onChange={handleChange}
                icon={User}
                placeholder="Enter vendor's full name"
                required
              />
              <InputField
                label="Business Name"
                name="businessName"
                value={vendor.businessName}
                onChange={handleChange}
                icon={Building}
                placeholder="Enter business name"
                required
              />
            </div>
          </SectionCard>

          {/* Contact Information */}
          <SectionCard title="Contact Information" icon={Mail}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={vendor.email}
                onChange={handleChange}
                icon={Mail}
                placeholder="vendor@example.com"
                required
              />
              <InputField
                label="Phone Number"
                name="phone"
                value={vendor.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="10-digit phone number"
                required
              />
            </div>
          </SectionCard>

          {/* Address Information */}
          <SectionCard title="Address Information" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Street Address"
                name="street"
                value={vendor.address?.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Street and building number"
                required
              />
              <InputField
                label="City"
                name="city"
                value={vendor.address?.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="City"
                required
              />
              <InputField
                label="State"
                name="state"
                value={vendor.address?.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                placeholder="State"
                required
              />
              <InputField
                label="Pincode"
                name="pincode"
                value={vendor.address?.pincode}
                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                placeholder="6-digit pincode"
                required
              />
              <div className="md:col-span-2">
                <InputField
                  label="Country"
                  name="country"
                  value={vendor.address?.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  placeholder="Country"
                  required
                />
              </div>
            </div>
          </SectionCard>

          {/* Legal Documents */}
          <SectionCard title="Legal Documents" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="GST Number"
                name="gstNumber"
                value={vendor.gstNumber}
                onChange={handleChange}
                icon={CreditCard}
                placeholder="15-character GST number"
              />
              <InputField
                label="PAN Number"
                name="panNumber"
                value={vendor.panNumber}
                onChange={handleChange}
                icon={IdCard}
                placeholder="e.g., ABCDE1234F"
              />
              <InputField
                label="Aadhar Number"
                name="aadharNumber"
                value={vendor.aadharNumber}
                onChange={handleChange}
                icon={BadgeCheck}
                placeholder="12-digit Aadhar number"
              />
            </div>
          </SectionCard>

          {/* Status Section */}
          <SectionCard title="Vendor Status" icon={Shield}>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <p className="text-sm text-gray-600">Set the vendor's active status</p>
              </div>
              <select
                name="status"
                value={vendor.status || "active"}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </SectionCard>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {saving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Updating Vendor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Vendor
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/vendor")}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}