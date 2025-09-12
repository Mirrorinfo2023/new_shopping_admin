'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddProductImagePage() {
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Upload images
  const handleUpload = async () => {
    if (!productId || images.length === 0) {
      alert('Product ID and at least one image are required');
      return;
    }

    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    setLoading(true);
    try {
      await axios.post(`/api/images/upload/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Images uploaded successfully!');
      setImages([]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  // Delete a single image by filename
  const handleDeleteImage = async (filename) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await axios.delete(`/api/images/delete/filename/${filename}`);
      alert('Image deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete image');
    }
  };

  // Delete all images for a product
  const handleDeleteAllImages = async () => {
    if (!productId || !confirm('Delete all images for this product?')) return;
    try {
      await axios.delete(`/api/images/images/delete/productId/${productId}`);
      alert('All images deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete images');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-6">Manage Product Images</h1>

      <Input
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="mb-4 rounded-xl shadow-sm"
      />

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

        {/* <Button
          onClick={handleDeleteAllImages}
          className="bg-red-600 text-white px-6 py-2 rounded-xl"
        >
          Delete All Images
        </Button> */}
      </div>

    </div>
  );
}
