'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function AddProductImagePage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const router = useRouter();


  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}products/basic`);
        if (res.data.success) {
          setProducts(res.data.products);
          if (res.data.products.length > 0) {
            setSelectedProductId(res.data.products[0]._id); // default selection
          }
        }
      } catch (err) {
        console.error(err);
        alert('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!selectedProductId || images.length === 0) {
      alert('Please select a product and at least one image');
      return;
    }

    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}images/upload/${selectedProductId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Images uploaded successfully!');
      setImages([]);
      router.back(); // Refresh to show new images if applicable

    } catch (err) {
      console.error(err);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-6">Manage Product Images</h1>

      {/* Product selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Product</label>
        <select
          className="w-full p-2 rounded-xl border"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productName} - ₹{product.finalPrice}
            </option>
          ))}
        </select>
      </div>

      {/* Image uploader */}
      <div>
        <label className="block mb-2 font-medium">Select Images</label>
        <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div className="flex gap-4 mt-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Images'}
        </Button>
      </div>
    </div>
  );
}
