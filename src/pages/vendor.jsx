"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  Building,
  MapPin,
  User,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Activity,
  CreditCard,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import axios from "axios";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedVendor, setExpandedVendor] = useState(null);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterAndSortVendors();
  }, [vendors, search, statusFilter, sortConfig]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(`${BASE_URL}vendors/getall`);
      console.log("Response data:", res.data);
      setVendors(res.data.vendors || []);

    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortVendors = () => {
    let filtered = vendors.filter(vendor =>
      vendor.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.phone?.includes(search)
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(vendor =>
        statusFilter === "active" ? vendor.isActive : !vendor.isActive
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredVendors(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        const res = await fetch(`${BASE_URL}vendors/delete/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");

        setVendors(prev => prev.filter(v => v._id !== id));
        alert(data.message || "Vendor deleted successfully!");
      } catch (err) {
        console.error("Failed to delete vendor:", err);
        alert("Failed to delete vendor. Please try again.");
      }
    }
  };

  const handleExport = () => {
    if (vendors.length === 0) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(vendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");
    XLSX.writeFile(workbook, `vendors_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleAddVendor = () => router.push("/vendors-add");

  const toggleExpandVendor = (id) => {
    setExpandedVendor(expandedVendor === id ? null : id);
  };

  const getStatusBadge = (isActive) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
      }`}>
      {isActive ? (
        <>
          <CheckCircle className="w-4 h-4 mr-1" />
          Active
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 mr-1" />
          Inactive
        </>
      )}
    </span>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SortableHeader = ({ children, sortKey }) => (
    <th
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
              <p className="text-gray-600">Manage and monitor all your vendors in one place</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={handleAddVendor}
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Vendors"
              value={vendors.length}
              color="bg-blue-500"
            />
            <StatCard
              icon={CheckCircle}
              label="Active Vendors"
              value={vendors.filter(v => v.isActive).length}
              color="bg-green-500"
            />
            <StatCard
              icon={Activity}
              label="Verified Vendors"
              value={vendors.filter(v => v.isVerified).length}
              color="bg-purple-500"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={vendors.filter(v =>
                new Date(v.createdAt).getMonth() === new Date().getMonth()
              ).length}
              color="bg-orange-500"
            />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vendors by name, business, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>

                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredVendors.length}</span> of{" "}
            <span className="font-semibold">{vendors.length}</span> vendors
          </p>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader sortKey="vendorName">Vendor</SortableHeader>
                  <SortableHeader sortKey="businessName">Business</SortableHeader>
                  <SortableHeader sortKey="email">Contact</SortableHeader>
                  <SortableHeader sortKey="gstNumber">Documents</SortableHeader>
                  <SortableHeader sortKey="businessType">Type</SortableHeader>
                  <SortableHeader sortKey="isActive">Status</SortableHeader>
                  <SortableHeader sortKey="createdAt">Created</SortableHeader>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No vendors found</p>
                        <p className="mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <React.Fragment key={vendor._id}>
                      <tr className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleExpandVendor(vendor._id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {vendor.vendorName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {vendor.phone}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {vendor.businessName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {vendor.businessType}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.email}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {vendor.phone}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">GST: {vendor.gstNumber}</div>
                          <div className="text-sm text-gray-500">PAN: {vendor.panNumber}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {vendor.businessType}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(vendor.isActive)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(vendor.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/vendors/${vendor._id}`);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit Vendor"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(vendor._id);
                              }}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Vendor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandVendor(vendor._id);
                              }}
                              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {expandedVendor === vendor._id && (
                        <tr className="bg-blue-50">
                          <td colSpan="8" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  Personal Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="font-medium">Aadhaar:</span> {vendor.aadharNumber}</p>
                                  <p><span className="font-medium">PAN:</span> {vendor.panNumber}</p>
                                  <p><span className="font-medium">GST:</span> {vendor.gstNumber}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Address
                                </h4>
                                <div className="text-sm">
                                  <p>{vendor.address?.street}</p>
                                  <p>{vendor.address?.city}, {vendor.address?.state}</p>
                                  <p>{vendor.address?.pincode}, {vendor.address?.country}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Bank Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="font-medium">Account:</span> {vendor.bankDetails?.accountNumber}</p>
                                  <p><span className="font-medium">IFSC:</span> {vendor.bankDetails?.ifscCode}</p>
                                  <p><span className="font-medium">Bank:</span> {vendor.bankDetails?.bankName}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                Created: {new Date(vendor.createdAt).toLocaleString()} |
                                Updated: {new Date(vendor.updatedAt).toLocaleString()}
                              </div>
                              <div className="flex space-x-2">
                                {vendor.isVerified && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllVendors;