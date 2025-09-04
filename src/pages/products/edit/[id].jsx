'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    isActive: true,
  });

  // Fetch product by ID
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        setProduct(data);
        setFormData({
          name: data?.name || '',
          price: data?.price || '',
          description: data?.description || '',
          category: data?.category || '',
          isActive: data?.isActive ?? true,
        });
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      alert('Product updated successfully!');
      router.push('/products');
    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong.');
    }
  };

  if (loading) return <p className="p-4">Loading product...</p>;
  if (!product) return <p className="p-4">Product not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label>Active</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
