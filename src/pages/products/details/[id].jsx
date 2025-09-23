import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await fetch(`${BASE_URL}products/${id}`);
      const data = await res.json();
      setProduct(data.product); // API returns { success, product }
    } catch (err) {
      alert("Failed to fetch product details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
if (loading)
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

if (!product)
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-red-500">Product not found!</p>
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6 hover:scale-105 transition-transform"
        onClick={() => router.back()}
      >
        ← Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <img
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.productName}
              className="w-full h-96 object-contain rounded-2xl"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt || product.productName}
                className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {product.productName}
            </h1>
            <p className="text-lg text-gray-500 mt-2">{product.shortDescription}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.finalPrice}
              </span>
              <span className="line-through text-gray-400">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between"><span>SKU</span><span>{product.sku}</span></div>
              <div className="flex justify-between"><span>Category</span><span>{product.categoryId?.categoryName}</span></div>
              <div className="flex justify-between"><span>Brand</span><span>{product.brand}</span></div>
              <div className="flex justify-between"><span>Currency</span><span>{product.currency}</span></div>
              <div className="flex justify-between items-center">
                <span>Stock</span>
                {product.stockStatus === "in_stock" ? (
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    In Stock ({product.quantity})
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="flex justify-between"><span>Active</span><span>{product.isActive ? "Yes" : "No"}</span></div>
              <div className="flex justify-between"><span>Featured</span><span>{product.isFeatured ? "Yes" : "No"}</span></div>
              <div className="flex justify-between"><span>Created At</span><span>{new Date(product.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Updated At</span><span>{new Date(product.updatedAt).toLocaleString()}</span></div>
            </CardContent>
          </Card>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
              <CardHeader><CardTitle>Available Variants</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <span
                    key={v._id}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm shadow-md"
                  >
                    {v.variantName}: {v.value} (+₹{v.additionalPrice})
                  </span>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Attributes */}
          {product.attributes?.length > 0 && (
            <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
              <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {product.attributes.map((attr) => (
                  <div key={attr._id} className="flex justify-between text-sm">
                    <span className="font-medium">{attr.key}</span>
                    <span>{attr.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
              <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-gray-200 rounded-full">
                    #{tag}
                  </span>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Vendor Info */}
          {product.vendorId && (
            <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
              <CardHeader><CardTitle>Vendor Info</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Name:</strong> {product.vendorId.vendorName}</p>
                <p><strong>Email:</strong> {product.vendorId.email}</p>
                <p><strong>Phone:</strong> {product.vendorId.phone}</p>
              </CardContent>
            </Card>
          )}

          {/* Ratings */}
          <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
            <CardHeader><CardTitle>Ratings</CardTitle></CardHeader>
            <CardContent>
              <p>⭐ {product.ratings.average} / 5 ({product.ratings.count} reviews)</p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="rounded-2xl shadow-lg border backdrop-blur bg-white/80">
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
