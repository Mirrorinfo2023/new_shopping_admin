'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash } from 'lucide-react';
import { createProductService } from '@/services/products';

const AddProduct = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    description: '',
    shortDescription: '',
    images: [{ url: '', alt: '' }],
    thumbnail: '',
    vendorId: '',
    categoryId: '',
    brand: '',
    price: 0,
    discount: 0,
    quantity: 0,
    stockStatus: 'in_stock',
    tags: [''],
    variants: [{ variantName: '', value: '', additionalPrice: 0 }],
    attributes: [{ key: '', value: '' }],
    isFeatured: false,
    isFromVendor: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const updated = [...formData[field]];
    if (subfield) {
      updated[index][subfield] = value;
    } else {
      updated[index] = value;
    }
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addToArray = (field, template) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], template],
    }));
  };

  const removeFromArray = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProductService(formData);
      alert('Product created successfully!');
      router.push('/products');
    } catch (err) {
      console.error('Error creating product:', err);
      alert(err.response?.data?.message || 'Failed to create product.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <div className="flex flex-col">
              <Label>SKU</Label>
              <Input
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
              />
            </div>

            {/* Product Name */}
            <div className="flex flex-col">
              <Label>Product Name</Label>
              <Input
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <Label>Description</Label>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* Short Description */}
            <div className="flex flex-col">
              <Label>Short Description</Label>
              <Input
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
              />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col">
              <Label>Thumbnail URL</Label>
              <Input
                placeholder="Thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleChange('thumbnail', e.target.value)}
              />
            </div>

            {/* Vendor ID */}
            <div className="flex flex-col">
              <Label>Vendor ID</Label>
              <Input
                placeholder="Vendor ID"
                value={formData.vendorId}
                onChange={(e) => handleChange('vendorId', e.target.value)}
              />
            </div>

            {/* Category ID */}
            <div className="flex flex-col">
              <Label>Category ID</Label>
              <Input
                placeholder="Category ID"
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
              />
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <Label>Brand</Label>
              <Input
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
              />
            </div>

            {/* Discount */}
            <div className="flex flex-col">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                placeholder="Discount (%)"
                value={formData.discount}
                onChange={(e) => handleChange('discount', Number(e.target.value))}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col">
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', Number(e.target.value))}
              />
            </div>

            {/* Stock Status */}
            <div className="flex flex-col">
              <Label>Stock Status</Label>
              <select
                value={formData.stockStatus}
                onChange={(e) => handleChange('stockStatus', e.target.value)}
                className="border p-2 rounded"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </CardContent>
        </Card>


        {/* Tags */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <Label>Tags</Label>
            {formData.tags.map((tag, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input value={tag} onChange={(e) => handleArrayChange('tags', idx, null, e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFromArray('tags', idx)}><Trash className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addToArray('tags', '')}><Plus className="h-4 w-4 mr-1" /> Add Tag</Button>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <Label>Images</Label>
            {formData.images.map((img, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                <Input placeholder="Image URL" value={img.url} onChange={(e) => handleArrayChange('images', idx, 'url', e.target.value)} />
                <Input placeholder="Alt Text" value={img.alt} onChange={(e) => handleArrayChange('images', idx, 'alt', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFromArray('images', idx)}><Trash className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addToArray('images', { url: '', alt: '' })}><Plus className="h-4 w-4 mr-1" /> Add Image</Button>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <Label>Variants</Label>
            {formData.variants.map((v, idx) => (
              <div key={idx} className="grid md:grid-cols-3 gap-2 items-center">
                <Input placeholder="Variant Name" value={v.variantName} onChange={(e) => handleArrayChange('variants', idx, 'variantName', e.target.value)} />
                <Input placeholder="Value" value={v.value} onChange={(e) => handleArrayChange('variants', idx, 'value', e.target.value)} />
                <Input type="number" placeholder="Additional Price" value={v.additionalPrice} onChange={(e) => handleArrayChange('variants', idx, 'additionalPrice', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFromArray('variants', idx)}><Trash className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addToArray('variants', { variantName: '', value: '', additionalPrice: 0 })}><Plus className="h-4 w-4 mr-1" /> Add Variant</Button>
          </CardContent>
        </Card>

        {/* Attributes */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <Label>Attributes</Label>
            {formData.attributes.map((attr, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input placeholder="Key" value={attr.key} onChange={(e) => handleArrayChange('attributes', idx, 'key', e.target.value)} />
                <Input placeholder="Value" value={attr.value} onChange={(e) => handleArrayChange('attributes', idx, 'value', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFromArray('attributes', idx)}><Trash className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addToArray('attributes', { key: '', value: '' })}><Plus className="h-4 w-4 mr-1" /> Add Attribute</Button>
          </CardContent>
        </Card>

        {/* Featured Switch */}
        <div className="flex items-center gap-4">
          <Label>Featured Product</Label>
          <Switch checked={formData.isFeatured} onCheckedChange={(val) => handleChange('isFeatured', val)} />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
        >
          Create Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
