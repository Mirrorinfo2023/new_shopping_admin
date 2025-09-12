'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  MoreHorizontal,
  User,
  ShoppingBag,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Mock data for cancellation requests
const mockCancellations = [
  {
    id: '1',
    orderId: 'ORD-2023-001',
    productName: 'Wireless Headphones',
    productImage: '/placeholder.png',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    requestDate: '2023-10-15',
    reason: 'Changed my mind',
    status: 'pending',
    quantity: 1,
    price: 2999,
  },
  {
    id: '2',
    orderId: 'ORD-2023-002',
    productName: 'Smart Watch',
    productImage: '/placeholder.png',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    requestDate: '2023-10-14',
    reason: 'Product defective',
    status: 'approved',
    quantity: 1,
    price: 8999,
  },
  {
    id: '3',
    orderId: 'ORD-2023-003',
    productName: 'Running Shoes',
    productImage: '/placeholder.png',
    customerName: 'Robert Johnson',
    customerEmail: 'robert@example.com',
    requestDate: '2023-10-13',
    reason: 'Wrong size delivered',
    status: 'rejected',
    quantity: 2,
    price: 4998,
  },
  {
    id: '4',
    orderId: 'ORD-2023-004',
    productName: 'Bluetooth Speaker',
    productImage: '/placeholder.png',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    requestDate: '2023-10-12',
    reason: 'Found better price',
    status: 'pending',
    quantity: 1,
    price: 2499,
  },
  {
    id: '5',
    orderId: 'ORD-2023-005',
    productName: 'Phone Case',
    productImage: '/placeholder.png',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    requestDate: '2023-10-11',
    reason: 'Not as described',
    status: 'approved',
    quantity: 3,
    price: 1497,
  },
];

export default function CancelProductScreen() {
  const [cancellations, setCancellations] = useState(mockCancellations);
  const [filteredCancellations, setFilteredCancellations] = useState(mockCancellations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, cancellations]);

  const applyFilters = () => {
    let result = [...cancellations];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply date filter (simple implementation)
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(item => item.requestDate === today);
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(item => new Date(item.requestDate) >= oneWeekAgo);
    }
    
    setFilteredCancellations(result);
  };

  const handleApprove = (id) => {
    setCancellations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
    alert('Cancellation request approved!');
  };

  const handleReject = (id) => {
    setCancellations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
    alert('Cancellation request rejected!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const stats = {
    total: cancellations.length,
    pending: cancellations.filter(item => item.status === 'pending').length,
    approved: cancellations.filter(item => item.status === 'approved').length,
    rejected: cancellations.filter(item => item.status === 'rejected').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        {/* <Link href="/products">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link> */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cancel Product Requests</h1>
          <p className="text-gray-500">Manage product cancellation requests from customers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stats.total}</h3>
              </div>
              <div className="rounded-lg p-3 bg-blue-100">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stats.pending}</h3>
              </div>
              <div className="rounded-lg p-3 bg-amber-100">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stats.approved}</h3>
              </div>
              <div className="rounded-lg p-3 bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stats.rejected}</h3>
              </div>
              <div className="rounded-lg p-3 bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-0 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            Filter Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                className="pl-10 rounded-lg h-11 shadow-sm focus-visible:ring-blue-500"
                placeholder="Search by product, customer, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="rounded-lg h-11 shadow-sm focus:ring-blue-500">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setDateFilter} value={dateFilter}>
              <SelectTrigger className="rounded-lg h-11 shadow-sm focus:ring-blue-500">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Requests Table */}
      <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
        <CardHeader className="bg-gray-50 py-4">
          <CardTitle className="text-lg font-semibold">Cancellation Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Request Date</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCancellations.length > 0 ? (
                  filteredCancellations.map((request) => (
                    <tr key={request.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={request.productImage}
                            alt={request.productName}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                          <span className="font-medium text-gray-900">{request.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{request.customerName}</div>
                          <div className="text-xs text-gray-500">{request.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">{request.orderId}</td>
                      <td className="px-6 py-4 max-w-xs">{request.reason}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(request.requestDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-700">
                        ₹{request.price}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusBadge(request.status)} flex items-center gap-1`}>
                          {getStatusIcon(request.status)}
                          {getStatusText(request.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(request.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleReject(request.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {(request.status === 'approved' || request.status === 'rejected') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-gray-400">
                      <div className="flex flex-col items-center justify-center py-6">
                        <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No cancellation requests found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}