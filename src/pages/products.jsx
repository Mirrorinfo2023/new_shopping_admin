'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Star,
  Filter,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  fetchProductsService,
  deleteProductService,
  filterProductsService,
} from '@/services/products';
import ProductStatus from "@/components/product/product_status";

// Custom Skeleton component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

export default function ProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProductsService();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await deleteProductService(productId);
      if (res.success) {
        alert('Product deleted successfully!');
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('Something went wrong!');
      console.error(err);
    }
  };

  const viewProductDetails = (productId) => {
    router.push(`/products/details/${productId}`);
  };

  const handleEdit = (productId) => {
    router.push(`/products/edit/${productId}`);
  };

  const applyFilters = async () => {
    try {
      const filters = {};
      if (categoryFilter && categoryFilter !== 'all') filters.categoryId = categoryFilter;
      if (statusFilter && statusFilter !== 'all') filters.status = statusFilter;

      let result = [...products];
      
      if (Object.keys(filters).length > 0) {
        const data = await filterProductsService(filters);
        result = data;
      }
      
      if (searchTerm) {
        result = result.filter((p) =>
          p.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFiltered(result);
    } catch (err) {
      console.error(err);
    }
  };

  const summary = [
    { 
      title: 'Total Products', 
      count: products.length, 
      icon: ShoppingBag, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12%' 
    },
    {
      title: 'Active',
      count: products.filter((p) => p.ratings?.average > 0).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+5%'
    },
    {
      title: 'Low Stock',
      count: products.filter((p) => p.ratings?.average === 0).length,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      trend: '+3%'
    },
    { 
      title: 'Out of Stock', 
      count: 0, 
      icon: XCircle, 
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: '-2%'
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-4">
          <Link href="/product_image_add">
            <Button className="flex gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg shadow hover:shadow-md transition-all duration-200">
              <Plus size={18} /> Add Image
            </Button>
          </Link>

          <Link href="/products/add-product">
            <Button className="flex gap-2 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow hover:shadow-md transition-all duration-200">
              <Plus size={18} /> Add Product
            </Button>
          </Link>
           <div>
      {/* <h2>Product 1</h2> */}
      {/* <ProductStatus productIds={productId} /> */}
    </div>
          
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summary.map((item, idx) => (
          <Card key={idx} className="rounded-xl shadow-sm border-0 overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">{isLoading ? <Skeleton className="h-7 w-12" /> : item.count}</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-500 ml-1">{item.trend}</span>
                  </div>
                </div>
                <div className={`rounded-lg p-3 ${item.bgColor}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
              </div>
              <div className="bg-gray-100 px-5 py-2 text-xs text-gray-500">
                <BarChart3 className="h-3 w-3 inline mr-1" />
                Updated just now
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            Filter Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                className="pl-10 rounded-lg h-11 shadow-sm focus-visible:ring-blue-500"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select onValueChange={setCategoryFilter}>
              <SelectTrigger className="rounded-lg h-11 shadow-sm focus:ring-blue-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {[...new Set(products.map((p) => p.categoryId?.categoryName))].map(
                  (cat, idx) => (
                    <SelectItem key={idx} value={cat}>
                      {cat}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-lg h-11 shadow-sm focus:ring-blue-500">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
        <CardHeader className="bg-gray-50 py-4">
          <CardTitle className="text-lg font-semibold">Product List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Skeleton loading states
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((product, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]?.url || '/placeholder.png'}
                            alt={product.images[0]?.alt || product.productName}
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                          <span className="font-medium text-gray-900">{product.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.categoryId?.categoryName}</td>
                      <td className="px-6 py-4 font-semibold text-green-700">
                        ₹{product.finalPrice}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          {product.ratings?.average || 'No ratings'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.ratings?.average > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {product.ratings?.average > 0 ? 'Active' : 'Low Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">{product.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleEdit(product._id)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => viewProductDetails(product._id)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-400">
                      <div className="flex flex-col items-center justify-center py-6">
                        <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchTerm('');
                            setCategoryFilter('all');
                            setStatusFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
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