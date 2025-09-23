import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Building,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  RefreshCw,
  FileText
} from "lucide-react";

const AddressReport = () => {
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [viewAddress, setViewAddress] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    isDefault: "",
    search: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedFilters, setExpandedFilters] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, addresses]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://secure1.mirrorhub.in/api/addresses/getall");
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let temp = [...addresses];
    if (filters.city)
      temp = temp.filter((a) =>
        a.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    if (filters.type)
      temp = temp.filter(
        (a) => a.addressType.toLowerCase() === filters.type.toLowerCase()
      );
    if (filters.isDefault)
      temp = temp.filter(
        (a) => (filters.isDefault === "yes" ? a.isDefault : !a.isDefault)
      );
    if (filters.search)
      temp = temp.filter(
        (a) =>
          a.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          a.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          a.phone.includes(filters.search)
      );
    setFilteredAddresses(temp);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      setUpdating(true);
      await axios.post(`https://secure1.mirrorhub.in/api/addresses/remove/${id}`);
      fetchAddresses();
    } catch (error) {
      console.error("Remove failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (address) => {
    setEditAddress({ ...address });
  };

  const openViewModal = (address) => {
    setViewAddress(address);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await axios.post(
        `https://secure1.mirrorhub.in/api/addresses/update/${editAddress._id}`,
        editAddress
      );
      setEditAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  const StatusBadge = ({ condition, label, variant = 'default' }) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      primary: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800'
    };

    return condition ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
        {variant === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
        {label}
      </span>
    ) : null;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
  <h1 className="text-3xl font-bold text-gray-900 mb-2 select-none cursor-default">
    User Address Management
  </h1>
  <p className="text-gray-600 select-none cursor-default">
    Manage and view all user addresses in one place
  </p>
</div>

            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={fetchAddresses}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Addresses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{addresses.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Default Addresses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {addresses.filter(addr => addr.isDefault).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Billing Addresses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {addresses.filter(addr => addr.isBillingAddress).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipping Addresses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {addresses.filter(addr => addr.isShippingAddress).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search addresses by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                </select>

                <select
                  value={filters.isDefault}
                  onChange={(e) => setFilters({ ...filters, isDefault: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Addresses</option>
                  <option value="yes">Default Only</option>
                  <option value="no">Non-default</option>
                </select>

                <button
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {expandedFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Filter by city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.isDefault}
                    onChange={(e) => setFilters({ ...filters, isDefault: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Addresses</option>
                    <option value="yes">Default Only</option>
                    <option value="no">Non-default</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAddresses.length}</span> of{" "}
            <span className="font-semibold">{addresses.length}</span> addresses
          </p>
        </div>

        {/* Addresses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <SortableHeader sortKey="city">Location</SortableHeader>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address Info
                  </th>
                  <SortableHeader sortKey="addressType">Type</SortableHeader>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flags
                  </th>
                  <SortableHeader sortKey="createdAt">Created</SortableHeader>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAddresses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No addresses found</p>
                        <p className="mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAddresses.map((address) => (
                    <tr key={address._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {address.fullName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {address.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {address.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{address.city}</div>
                        <div className="text-sm text-gray-500">{address.state}</div>
                        <div className="text-sm text-gray-500">{address.pincode}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </div>
                        {address.landmark && (
                          <div className="text-sm text-gray-500">Landmark: {address.landmark}</div>
                        )}
                        <div className="text-sm text-gray-500">{address.country}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${address.addressType === 'home'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {address.addressType === 'home' ? <Home className="w-3 h-3 mr-1" /> : <Building className="w-3 h-3 mr-1" />}
                          {address.addressType}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          <StatusBadge condition={address.isDefault} label="Default" variant="success" />
                          <StatusBadge condition={address.isBillingAddress} label="Billing" variant="primary" />
                          <StatusBadge condition={address.isShippingAddress} label="Shipping" variant="purple" />
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(address.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openViewModal(address)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(address)}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Edit Address"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemove(address._id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Address"
                            disabled={updating}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Address Modal */}
        {viewAddress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Address Details</h3>
                  <button
                    onClick={() => setViewAddress(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User Information
                    </h4>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-900">{viewAddress.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{viewAddress.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{viewAddress.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address Type & Flags
                    </h4>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address Type</label>
                      <p className="capitalize text-gray-900">{viewAddress.addressType}</p>
                    </div>
                    <div className="flex gap-4">
                      <StatusBadge condition={viewAddress.isDefault} label="Default Address" variant="success" />
                      <StatusBadge condition={viewAddress.isBillingAddress} label="Billing Address" variant="primary" />
                      <StatusBadge condition={viewAddress.isShippingAddress} label="Shipping Address" variant="purple" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Address Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address Line 1</label>
                      <p className="text-gray-900">{viewAddress.addressLine1}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address Line 2</label>
                      <p className="text-gray-900">{viewAddress.addressLine2 || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-gray-900">{viewAddress.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-gray-900">{viewAddress.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pincode</label>
                      <p className="text-gray-900">{viewAddress.pincode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-gray-900">{viewAddress.country}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Landmark</label>
                      <p className="text-gray-900">{viewAddress.landmark || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setViewAddress(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setViewAddress(null);
                      openEditModal(viewAddress);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Address Modal */}
        {editAddress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Edit Address</h3>
                  <button
                    onClick={() => setEditAddress(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", name: "fullName", type: "text", icon: User },
                    { label: "Phone", name: "phone", type: "text", icon: Phone },
                    { label: "Email", name: "email", type: "email", icon: Mail },
                    { label: "Address Line 1", name: "addressLine1", type: "text", icon: MapPin },
                    { label: "Address Line 2", name: "addressLine2", type: "text", icon: MapPin },
                    { label: "City", name: "city", type: "text", icon: MapPin },
                    { label: "State", name: "state", type: "text", icon: MapPin },
                    { label: "Pincode", name: "pincode", type: "text", icon: MapPin },
                    { label: "Country", name: "country", type: "text", icon: MapPin },
                    { label: "Landmark", name: "landmark", type: "text", icon: MapPin },
                  ].map((field) => {
                    const IconComponent = field.icon;
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={editAddress[field.name]}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={field.name !== 'addressLine2' && field.name !== 'landmark'}
                        />
                      </div>
                    );
                  })}

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2">
                        <select
                          name="addressType"
                          value={editAddress.addressType}
                          onChange={handleEditChange}
                          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="home">Home</option>
                          <option value="office">Office</option>
                        </select>
                        <span className="text-sm font-medium text-gray-700">Address Type</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={editAddress.isDefault}
                          onChange={handleEditChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Default Address</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isBillingAddress"
                          checked={editAddress.isBillingAddress}
                          onChange={handleEditChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Billing Address</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isShippingAddress"
                          checked={editAddress.isShippingAddress}
                          onChange={handleEditChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Shipping Address</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditAddress(null)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Update Address
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressReport;