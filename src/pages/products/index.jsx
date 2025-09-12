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
  ShoppingCart,
  Package,
  DollarSign,
  Plus,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/router';

export default function Product() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Products
            </span>
            <Button onClick={() => router.push('/products/add')}>
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-8"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {loading && <p>Loading products...</p>}

          {/* Products Table */}
          {!loading && (
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{product.name}</td>
                      <td className="p-2 border">
                        <DollarSign className="inline w-4 h-4 mr-1" />
                        {product.price}
                      </td>
                      <td className="p-2 border capitalize">
                        {product.status}
                      </td>
                      <td className="p-2 border">
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/products/${product._id}`)
                          }
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
