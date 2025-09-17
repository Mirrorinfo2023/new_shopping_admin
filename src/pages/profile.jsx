import React, { useState } from 'react';
import { 
  FaUser, FaShoppingCart, FaChartLine, FaBox, 
  FaCog, FaBell, FaSignOutAlt, FaEdit, FaSave,
  FaTimes, FaMoneyBillWave, FaUsers, FaStore 
} from 'react-icons/fa';

const ShoppingAdminProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [adminData, setAdminData] = useState({
    name: 'Admin',
    email: 'mirrorinfo2023@gmail.com',
    role: 'E-commerce Administrator',
    lastLogin: '2023-06-15 14:30:22',
    joinDate: '2021-03-10',
    bio: 'E-commerce specialist with expertise in inventory management, customer relations, and sales analytics.',
    phone: '+91 ',
    notifications: true,
    twoFactor: true
  });

  const [formData, setFormData] = useState({ ...adminData });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    setAdminData({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...adminData });
    setIsEditing(false);
  };

  const storeStats = {
    totalSales: 12457,
    pendingOrders: 23,
    lowStockItems: 12,
    newCustomers: 48
  };

  const recentActivities = [
    { id: 1, action: 'Updated product', target: 'Wireless Headphones', time: '2 hours ago' },
    { id: 2, action: 'Processed order', target: '#ORD-4872', time: '5 hours ago' },
    { id: 3, action: 'Added new product', target: 'Smart Watch Series 5', time: 'Yesterday' },
    { id: 4, action: 'Responded to customer inquiry', target: 'Ticket #7421', time: '2 days ago' }
  ];

  const performanceMetrics = {
    conversionRate: '3.2%',
    averageOrderValue: '124.50',
    customerSatisfaction: '4.7/5.0'
  };

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <FaUser className="h-12 w-12 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{adminData.name}</h2>
                <p className="text-indigo-600 font-medium">{adminData.role}</p>
                {/* <p className="text-gray-500 text-sm mt-2">Last login: {adminData.lastLogin}</p> */}
              </div>

              <nav className="mt-8">
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FaChartLine className="h-5 w-5 mr-3" />
                      Overview
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FaUser className="h-5 w-5 mr-3" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FaShoppingCart className="h-5 w-5 mr-3" />
                      Orders
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FaBox className="h-5 w-5 mr-3" />
                      Products
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FaCog className="h-5 w-5 mr-3" />
                      Settings
                    </button>
                  </li>
                 
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Store Overview</h2>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-indigo-50 p-5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-indigo-800">Total Sales</h3>
                        <FaMoneyBillWave className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">${storeStats.totalSales.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1">+12.4% from last month</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-yellow-800">Pending Orders</h3>
                        <FaShoppingCart className="h-6 w-6 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{storeStats.pendingOrders}</p>
                      <p className="text-sm text-gray-600 mt-1">Need attention</p>
                    </div>
                    
                    <div className="bg-red-50 p-5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-red-800">Low Stock Items</h3>
                        <FaBox className="h-6 w-6 text-red-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{storeStats.lowStockItems}</p>
                      <p className="text-sm text-gray-600 mt-1">Need restocking</p>
                    </div>
                    
                    <div className="bg-green-50 p-5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-green-800">New Customers</h3>
                        <FaUsers className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{storeStats.newCustomers}</p>
                      <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
                    </div>
                  </div> */}
                </div>

                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                      {recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <div className="bg-indigo-100 p-2 rounded-full mr-3">
                            <FaEdit className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}: <span className="text-indigo-600">{activity.target}</span></p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-700">Conversion Rate</span>
                          <span className="font-bold text-gray-900">{performanceMetrics.conversionRate}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '3.2%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-700">Average Order Value</span>
                          <span className="font-bold text-gray-900">{performanceMetrics.averageOrderValue}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-700">Customer Satisfaction</span>
                          <span className="font-bold text-gray-900">{performanceMetrics.customerSatisfaction}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <FaEdit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FaSave className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        <FaTimes className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{adminData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{adminData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{adminData.phone}</p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{adminData.location}</p>
                    )}
                  </div> */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{adminData.bio}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive alerts about store activities</p>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications"
                            checked={formData.notifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${adminData.notifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {adminData.notifications ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="twoFactor"
                            checked={formData.twoFactor}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${adminData.twoFactor ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {adminData.twoFactor ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would go here */}
            {(activeTab === 'orders' || activeTab === 'products' || activeTab === 'settings') && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {activeTab === 'orders' && 'Order Management'}
                  {activeTab === 'products' && 'Product Catalog'}
                  {activeTab === 'settings' && 'Store Settings'}
                </h2>
                <p className="text-gray-500">
                  This section is under development. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAdminProfile;