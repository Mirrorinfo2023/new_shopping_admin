// src/pages/DashboardScreen.jsx

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  User,
  Store,
  ShoppingCart,
  Truck,
  DollarSign,
  IndianRupee,
  PackageCheck,
  TrendingUp,
  MoreVertical,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const statusOptions = ["Pending", "Processing", "Completed", "Cancelled"];

const initialTopStores = [
  { id: 1, name: "Bicycle Shop", amount: 10892.2, status: "Pending", orders: 45, growth: 12.5 },
  { id: 2, name: "Book Store", amount: 10023.5, status: "Processing", orders: 38, growth: 8.2 },
  { id: 3, name: "Hanover Electronics", amount: 9590.01, status: "Completed", orders: 52, growth: -2.1 },
  { id: 4, name: "liceria & co.", amount: 408.0, status: "Cancelled", orders: 12, growth: 25.7 },
];

const orderStatuses = [
  { label: "Pending", count: 58, color: "#f59e0b" },
  { label: "Confirmed", count: 21, color: "#3b82f6" },
  { label: "Packaging", count: 9, color: "#8b5cf6" },
  { label: "Out for delivery", count: 8, color: "#06b6d4" },
  { label: "Delivered", count: 77, color: "#10b981" },
  { label: "Canceled", count: 9, color: "#ef4444" },
  { label: "Returned", count: 4, color: "#6b7280" },
  { label: "Failed", count: 5, color: "#1f2937" },
];

const earnings = [
  { label: "Jan", value: 12755.02 },
  { label: "Feb", value: 14320.5 },
  { label: "Mar", value: 18950.75 },
  { label: "Apr", value: 16540.25 },
  { label: "May", value: 23430.0 },
  { label: "Jun", value: 19892.0 },
];

const revenueBreakdown = [
  { label: "In-house", value: 12755.02, color: "#3b82f6" },
  { label: "Commission", value: 1360.0, color: "#10b981" },
  { label: "Delivery Charge", value: 2343.0, color: "#f59e0b" },
  { label: "Tax Collected", value: 8153.0, color: "#ef4444" },
];

const topCustomers = [
  { name: "Robert", orders: 137, spent: 28950, growth: 15.2 },
  { name: "Devid", orders: 17, spent: 8450, growth: 8.7 },
  { name: "Chris", orders: 5, spent: 3200, growth: -2.1 },
  { name: "Anthony", orders: 3, spent: 1890, growth: 25.4 },
  { name: "Paul", orders: 3, spent: 2100, growth: 12.3 },
];

const topVendors = [
  { id: "V001", name: "Trendify", phone: "+91 9876543210", products: 120, rating: 4.8, growth: 12.5 },
  { id: "V002", name: "Fashion Hub", phone: "+91 9123456789", products: 85, rating: 4.6, growth: 8.2 },
  { id: "V003", name: "Smart Electronics", phone: "+91 9988776655", products: 102, rating: 4.9, growth: 15.7 },
  { id: "V004", name: "HomeStyle Decor", phone: "+91 8899001122", products: 76, rating: 4.4, growth: -2.1 },
];

const recentActivities = [
  { id: 1, action: "New order placed", user: "Robert", time: "2 min ago", amount: "249.99" },
  { id: 2, action: "Product added", user: "Trendify", time: "5 min ago", amount: "" },
  { id: 3, action: "Payment received", user: "Devid", time: "10 min ago", amount: "189.50" },
  { id: 4, action: "Order shipped", user: "Bicycle Shop", time: "15 min ago", amount: "" },
  { id: 5, action: "New vendor registered", user: "HomeStyle Decor", time: "20 min ago", amount: "" },
];

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#1e3a8a", "#2563eb", "#1d4ed8", "#1e40af"];

const DashboardScreen = () => {
  const [localStores, setLocalStores] = useState(initialTopStores);
  const [timeRange, setTimeRange] = useState("monthly");

  const handleStatusChange = (index, newStatus) => {
    const updated = [...localStores];
    updated[index].status = newStatus;
    setLocalStores(updated);
    console.log(`Update store ID {updated[index].id} to status: {newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Custom progress bar component
  const ProgressBar = ({ value, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="h-2 rounded-full transition-all duration-300" 
        style={{ 
          width: `{value}%`, 
          backgroundColor: color 
        }}
      ></div>
    </div>
  );

  const stats = [
    { label: "Total Revenue", value: "45,892", change: "+12.5%", icon: <IndianRupee className="h-5 w-5" />, color: "text-green-600" },
    { label: "Total Orders", value: "191", change: "+8.2%", icon: <ShoppingCart className="h-5 w-5" />, color: "text-blue-600" },
    { label: "Total Stores", value: "10", change: "+2.1%", icon: <Store className="h-5 w-5" />, color: "text-purple-600" },
    { label: "Total Customers", value: "7,892", change: "+15.7%", icon: <User className="h-5 w-5" />, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp size={16} className="mr-2" />
            Analytics View
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm font-medium {stat.color} mt-1`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </div>
            <div className="flex gap-2">
              {["weekly", "monthly", "yearly"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earnings}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatuses}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ label, count }) => `${label}: ${count}`}
                >
                  {orderStatuses.map((entry, index) => (
                    <Cell key={`cell-{index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest store orders</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localStores.map((store, index) => (
                <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-500">{store.amount.toFixed(2)} • {store.orders} orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(store.status)}>
                      {store.status}
                    </Badge>
                    <select
                      value={store.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Most valuable customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{customer.spent.toLocaleString()}</p>
                    <p className={`text-sm {customer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {customer.growth >= 0 ? '+' : ''}{customer.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Best performing vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <p className="text-sm text-gray-500">{vendor.products} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{vendor.rating}</span>
                    </div>
                    <p className={`text-sm {vendor.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {vendor.growth >= 0 ? '+' : ''}{vendor.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => {
                const percentage = (item.value / 25000) * 100;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span>{item.value.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={percentage} color={item.color} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}%</span>
                      <span>{item.value.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>by {activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                    {activity.amount && (
                      <p className="text-xs font-medium text-green-600 mt-1">{activity.amount}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Star component for ratings
const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default DashboardScreen;