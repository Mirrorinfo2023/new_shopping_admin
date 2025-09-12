"use client";
import React, { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryType: "Main",
    isActive: true,
    icon: null,
    subCategories: [
      { subCategoryName: "", subCategoryType: "Sub", isActive: true, icon: null },
    ],
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories"); // use proxy API
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e, index = null, field = null) => {
    if (index !== null) {
      const newSubCategories = [...formData.subCategories];
      if (field === "icon") {
        newSubCategories[index][field] = e.target.files[0];
      } else {
        newSubCategories[index][field] =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
      }
      setFormData({ ...formData, subCategories: newSubCategories });
    } else {
      if (e.target.name === "icon") {
        setFormData({ ...formData, icon: e.target.files[0] });
      } else {
        setFormData({
          ...formData,
          [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value,
        });
      }
    }
  };

  const addSubCategory = () => {
    setFormData({
      ...formData,
      subCategories: [
        ...formData.subCategories,
        { subCategoryName: "", subCategoryType: "Sub", isActive: true, icon: null },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("categoryName", formData.categoryName);
      payload.append("categoryType", formData.categoryType);
      payload.append("isActive", formData.isActive);
      if (formData.icon) payload.append("icon", formData.icon);

      formData.subCategories.forEach((sub, idx) => {
        payload.append(`subCategories[${idx}][subCategoryName]`, sub.subCategoryName);
        payload.append(`subCategories[${idx}][subCategoryType]`, sub.subCategoryType);
        payload.append(`subCategories[${idx}][isActive]`, sub.isActive);
        if (sub.icon) payload.append(`subCategories[${idx}][icon]`, sub.icon);
      });

      const res = await fetch("/api/createCategory", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to create category");
      const data = await res.json();

      alert("Category created!");
      console.log(data);

      setFormData({
        categoryName: "",
        categoryType: "Main",
        isActive: true,
        icon: null,
        subCategories: [
          { subCategoryName: "", subCategoryType: "Sub", isActive: true, icon: null },
        ],
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to create category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/deleteCategory/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
      >
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          value={formData.categoryName}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="flex gap-4 items-center">
          <select
            name="categoryType"
            value={formData.categoryType}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="Main">Main</option>
            <option value="Other">Other</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Active
          </label>

          <input
            type="file"
            name="icon"
            onChange={handleChange}
            className="border rounded-lg px-3 py-1"
          />
        </div>

        <h3 className="text-lg font-semibold">Sub Categories</h3>
        <div className="space-y-4">
          {formData.subCategories.map((sub, idx) => (
            <div key={idx} className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Sub Category Name"
                value={sub.subCategoryName}
                onChange={(e) => handleChange(e, idx, "subCategoryName")}
                required
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={sub.subCategoryType}
                onChange={(e) => handleChange(e, idx, "subCategoryType")}
                className="border rounded-lg px-3 py-2"
              >
                <option value="Sub">Sub</option>
                <option value="Other">Other</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sub.isActive}
                  onChange={(e) => handleChange(e, idx, "isActive")}
                  className="w-4 h-4"
                />
                Active
              </label>
              <input
                type="file"
                onChange={(e) => handleChange(e, idx, "icon")}
                className="border rounded-lg px-3 py-1"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSubCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Add SubCategory
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Create Category
        </button>
      </form>

      {/* List */}
      <h2 className="text-xl font-bold mb-4">All Categories</h2>
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={cat.icon}
                alt={cat.categoryName}
                className="w-10 h-10 rounded object-cover"
              />
              <strong className="text-lg">{cat.categoryName}</strong>
              <span className="text-sm text-gray-600">
                ({cat.categoryType})
              </span>
              <button
                onClick={() => handleDelete(cat._id)}
                className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {cat.subCategories?.length > 0 && (
              <ul className="ml-12 list-disc space-y-2">
                {cat.subCategories.map((sub) => (
                  <li key={sub._id} className="flex items-center gap-3">
                    <img
                      src={sub.icon}
                      alt={sub.subCategoryName}
                      className="w-7 h-7 rounded object-cover"
                    />
                    {sub.subCategoryName}{" "}
                    <span className="text-gray-500 text-sm">
                      ({sub.subCategoryType})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
