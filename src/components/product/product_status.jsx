'use client';
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";

export default function ProductStatusDialog({ open, setOpen }) {
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  // Fetch all basic products
 const fetchProducts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}products/basic`);
    if (res.data.success) {
      setProducts(res.data.products || []);
    } else {
      setProducts([]);
    }
  } catch (err) {
    console.error("Failed to fetch products", err);
    setProducts([]);
  }
};


  useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  // Toggle product selection
  const toggleSelectProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Filtered products based on search
  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update status API call
  const handleUpdateStatus = async () => {
    if (!status || selectedProductIds.length === 0) return;



    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}products/update-status`, {
        productIds: selectedProductIds,
        status,
      });

      if (res.data.success) {
        alert("Status updated successfully!");
        setOpen(false);
        setSelectedProductIds([]);
        fetchProducts(); // refresh after update
      } else {
        alert("Failed to update status: " + (res.data.message || ""));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Update Product Status</DialogTitle>
        </DialogHeader>

        {/* Search box */}
        <div className="my-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product list with checkboxes */}
        <div className="max-h-80 overflow-y-auto border rounded-md p-2 space-y-2">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No products found</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product._id)}
                  onChange={() => toggleSelectProduct(product._id)}
                />
                <span>{product.productName}</span>
              </div>
            ))
          )}
        </div>

        {/* Status dropdown */}
        <div className="mt-4">
          <label className="text-sm font-medium">Select Status</label>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={!status || selectedProductIds.length === 0 || loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
