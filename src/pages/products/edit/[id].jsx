"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import CategoryDropdown from "@/components/category/CategoryDropdown";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const [formData, setFormData] = useState({
    productName: "",
    shortDescription: "",
    description: "",
    brand: "",
    sku: "",
    currency: "INR",
    price: "",
    discount: 0,
    finalPrice: "",
    quantity: 0,
    stockStatus: "in_stock",
    isActive: true,
    isFeatured: false,
    status: "pending",
    categoryId: "",
    tags: [],
    variants: [],
    attributes: [],
    images: [],
    ratings: { average: 0 },
  });

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await fetch(`${BASE_URL}products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product details");
      const data = await res.json();
      const productData = data.product;

      setProduct(productData);

      setFormData({
        productName: productData.productName || "",
        shortDescription: productData.shortDescription || "",
        description: productData.description || "",
        brand: productData.brand || "",
        sku: productData.sku || "",
        currency: productData.currency || "INR",
        price: productData.price || "",
        discount: productData.discount || 0,
        finalPrice: productData.finalPrice || "",
        quantity: productData.quantity || 0,
        stockStatus: productData.stockStatus || "in_stock",
        isActive: productData.isActive ?? true,
        isFeatured: productData.isFeatured ?? false,
        status: productData.status || "pending",
        categoryId: productData.categoryId?._id || "",
        tags: productData.tags || [],
        variants: productData.variants || [],
        attributes: productData.attributes || [],
        images: productData.images?.map((img) => img.url) || [],
        ratings: productData.ratings || { average: 0 },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update product details (excluding status)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        images: formData.images.map((url) => ({ url, alt: "" })),
      };

      const res = await fetch(`${BASE_URL}products/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  // Update only product status
  const handleStatusUpdate = async () => {
    if (!formData.status) return;

    try {
      const res = await fetch(`${BASE_URL}products/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: id, status: formData.status }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Status updated successfully!");
        loadProduct();
      } else {
        alert("Failed to update status: " + (data.message || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  if (!product)
    return <div className="flex justify-center items-center h-screen text-red-500">Product not found!</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <Button
        className="mb-4 px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 rounded-lg shadow-sm transition duration-200 flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>

      <Card className="rounded-2xl shadow-md p-4">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Product Info */}
            <InputField label="Product Name" name="productName" value={formData.productName} onChange={handleChange} />
            <InputField label="Short Description" name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
            <InputField label="Description" name="description" value={formData.description} onChange={handleChange} />
            <InputField label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
            <InputField label="SKU" name="sku" value={formData.sku} onChange={handleChange} />
            <InputField label="Currency" name="currency" value={formData.currency} onChange={handleChange} />
            <InputField label="Price" name="price" value={formData.price} onChange={handleChange} type="number" />
            <InputField label="Discount %" name="discount" value={formData.discount} onChange={handleChange} type="number" />
            <InputField label="Final Price" name="finalPrice" value={formData.finalPrice} onChange={handleChange} type="number" />
            <InputField label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} type="number" />

            {/* Stock Status */}
            <label className="block mb-1 font-semibold">Stock Status</label>
            <select
              value={formData.stockStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, stockStatus: e.target.value }))}
              className="w-full p-2 rounded border"
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Active / Featured */}
            <CheckboxField label="Active" checked={formData.isActive} onChange={(val) => setFormData(prev => ({ ...prev, isActive: val }))} />
            <CheckboxField label="Featured" checked={formData.isFeatured} onChange={(val) => setFormData(prev => ({ ...prev, isFeatured: val }))} />

            {/* Status (Separate API) */}
            <label className="block mb-1 font-semibold">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 rounded border mb-2"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button onClick={handleStatusUpdate} className="bg-blue-600 text-white mb-4">Update Status</Button>

            {/* Category */}
            <label className="block mb-1 font-semibold">Category</label>
            <CategoryDropdown value={formData.categoryId} onChange={(id) => setFormData(prev => ({ ...prev, categoryId: id }))} />

            {/* Ratings */}
            <InputField label="Rating" type="number" value={formData.ratings.average} onChange={(e) => setFormData(prev => ({ ...prev, ratings: { ...prev.ratings, average: e.target.value } }))} />

            {/* Images */}
            <label className="block mb-1 font-semibold">Images (comma-separated URLs)</label>
            <Input
              value={formData.images.join(",")}
              onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value.split(",") }))}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((url, idx) => (
                <img key={idx} src={url || "/placeholder.png"} alt={`img-${idx}`} className="w-20 h-20 object-cover rounded-lg border" />
              ))}
            </div>

            {/* Tags */}
            <InputField label="Tags (comma-separated)" value={formData.tags.join(",")} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(",") }))} />

            {/* Variants */}
            <VariantsManager variants={formData.variants} setVariants={(v) => setFormData(prev => ({ ...prev, variants: v }))} />

            {/* Attributes */}
            <AttributesManager attributes={formData.attributes} setAttributes={(a) => setFormData(prev => ({ ...prev, attributes: a }))} />

            <Button type="submit" className="bg-green-600 text-white">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable input field
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <Input name={name} value={value} onChange={onChange} type={type} />
    </div>
  );
}

// Reusable checkbox
function CheckboxField({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}

// Variants Manager
function VariantsManager({ variants, setVariants }) {
  const addVariant = () => setVariants([...variants, { variantName: "", value: "", additionalPrice: 0 }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === "additionalPrice" ? Number(value) : value;
    setVariants(updated);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Variants</label>
      {variants.map((v, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Input placeholder="Variant Name" value={v.variantName} onChange={(e) => updateVariant(idx, "variantName", e.target.value)} />
          <Input placeholder="Value" value={v.value} onChange={(e) => updateVariant(idx, "value", e.target.value)} />
          <Input type="number" placeholder="Additional Price" value={v.additionalPrice} onChange={(e) => updateVariant(idx, "additionalPrice", e.target.value)} />
          <Button type="button" onClick={() => removeVariant(idx)} className="bg-red-600 text-white">X</Button>
        </div>
      ))}
      <Button type="button" onClick={addVariant} className="bg-blue-600 text-white">Add Variant</Button>
    </div>
  );
}

// Attributes Manager
function AttributesManager({ attributes, setAttributes }) {
  const addAttr = () => setAttributes([...attributes, { attributeName: "", value: "" }]);
  const removeAttr = (index) => setAttributes(attributes.filter((_, i) => i !== index));
  const updateAttr = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Attributes</label>
      {attributes.map((a, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Input placeholder="Attribute Name" value={a.key} onChange={(e) => updateAttr(idx, "attributeName", e.target.value)} />
          <Input placeholder="Value" value={a.value} onChange={(e) => updateAttr(idx, "value", e.target.value)} />
          <Button type="button" onClick={() => removeAttr(idx)} className="bg-red-600 text-white">X</Button>
        </div>
      ))}
      <Button type="button" onClick={addAttr} className="bg-blue-600 text-white">Add Attribute</Button>
    </div>
  );
}
