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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchProductsService, deleteProductService } from '@/services/products';

export default function ProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      const data = await fetchProductsService();
      setProducts(data);
    } catch (err) {
      console.error(err);
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

  const applyFilters = () => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(
        (p) => p.categoryId?.categoryName === categoryFilter
      );
    }

    if (statusFilter === 'Active') {
      result = result.filter((p) => p.ratings.average > 0);
    } else if (statusFilter === 'Low Stock') {
      result = result.filter((p) => p.ratings.average === 0);
    }

    setFiltered(result);
  };

  const summary = [
    { title: 'Total Products', count: products.length, icon: ShoppingBag, color: 'text-blue-600' },
    {
      title: 'Active',
      count: products.filter((p) => p.ratings.average > 0).length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Low Stock',
      count: products.filter((p) => p.ratings.average === 0).length,
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
    { title: 'Out of Stock', count: 0, icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Link href="/products/add-product">
          <Button className="flex gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <Plus size={18} /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item, idx) => (
          <Card key={idx} className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <CardTitle className="text-lg text-gray-700">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold text-gray-900">
              {item.count}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <Input
            className="pl-10 rounded-xl shadow-sm"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select onValueChange={setCategoryFilter}>
          <SelectTrigger className="rounded-xl shadow-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(products.map((p) => p.categoryId?.categoryName))].map(
              (cat, idx) => (
                <SelectItem key={idx} value={cat}>
                  {cat}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-xl shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Low Stock">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="overflow-auto rounded-2xl shadow-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-200 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, idx) => (
              <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.productName}
                    className="w-12 h-12 rounded-lg object-contain"
                  />
                  <span>{product.productName}</span>
                </td>
                <td className="px-6 py-4">{product.categoryId?.categoryName}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">
                  ₹{product.finalPrice}
                </td>
                <td className="px-6 py-4">{product.ratings.average}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    {product.ratings.average > 0 ? 'Active' : 'Low Stock'}
                  </span>
                </td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4 space-x-2">
                  <Button
                    size="sm"
                    className="bg-red-600 text-white"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
