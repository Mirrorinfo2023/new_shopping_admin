"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("api/vendors/getall");
      if (!res.status) throw new Error("Failed to fetch");
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        const res = await fetch(`api/vendors/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        setVendors((prev) => prev.filter((v) => v._id !== id));
      } catch (err) {
        console.error("Failed to delete vendor:", err);
      }
    }
  };

  const handleExport = () => {
    if (vendors.length === 0) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(vendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");
    XLSX.writeFile(workbook, "vendors.xlsx");
  };

  const handleAddVendor = () => {
    router.push("/vendors-add");
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold text-blue-700">All Vendors</h2>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by vendor name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Export Excel
          </button>

          <button
            onClick={handleAddVendor}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-md font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition duration-300"
          >
            Add Vendor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-blue-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-800 font-semibold">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Vendor Name</th>
              <th className="border px-4 py-2">Business Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">GST No</th>
              <th className="border px-4 py-2">PAN No</th>
              <th className="border px-4 py-2">Aadhar No</th>
              <th className="border px-4 py-2">Business Type</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Verified</th>
              <th className="border px-4 py-2">Active</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Updated At</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center py-4 text-gray-500">
                  No vendors found.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor, index) => (
                <tr key={vendor._id} className="hover:bg-blue-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{vendor.vendorName}</td>
                  <td className="border px-4 py-2">{vendor.businessName}</td>
                  <td className="border px-4 py-2">{vendor.email}</td>
                  <td className="border px-4 py-2">{vendor.phone}</td>
                  <td className="border px-4 py-2">{vendor.gstNumber}</td>
                  <td className="border px-4 py-2">{vendor.panNumber}</td>
                  <td className="border px-4 py-2">{vendor.aadharNumber}</td>
                  <td className="border px-4 py-2">{vendor.businessType}</td>
                  <td className="border px-4 py-2">
                    {vendor.address?.street}, {vendor.address?.city},{" "}
                    {vendor.address?.state} - {vendor.address?.pincode},{" "}
                    {vendor.address?.country}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {vendor.isVerified ? "✔️" : "❌"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {vendor.isActive ? "✔️" : "❌"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(vendor.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(vendor.updatedAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => router.push(`/vendors/edit/${vendor._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(vendor._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllVendors;
