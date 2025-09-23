// src/components/category/CategoryDropdown.jsx
import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function CategoryDropdown({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}catagory/getallcategories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger className="rounded-lg h-11 shadow-sm focus:ring-blue-500 bg-white">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent className="bg-white rounded-lg shadow-md">
        {categories.map((cat) => (
          <SelectItem key={cat._id} value={cat._id}>
            {cat.categoryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
