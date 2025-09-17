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
      const res = await fetch("/api/catagory/getallcategories"); // use proxy API
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

      const res = await fetch("https://secure1.mirrorinfo.in/api/catagory/createcategories", {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Category Management</h1>
      <p className="text-gray-600 mb-8">Create and manage product categories and subcategories</p>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Add New Category</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              name="categoryName"
              placeholder="e.g., Electronics, Clothing"
              value={formData.categoryName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
              <select
                name="categoryType"
                value={formData.categoryType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Main">Main</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active Category</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Icon</label>
              <div className="relative">
                <input
                  type="file"
                  name="icon"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sub Categories</h3>
            <div className="space-y-4">
              {formData.subCategories.map((sub, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Sub Category Name"
                        value={sub.subCategoryName}
                        onChange={(e) => handleChange(e, idx, "subCategoryName")}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={sub.subCategoryType}
                        onChange={(e) => handleChange(e, idx, "subCategoryType")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="Sub">Sub</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={sub.isActive}
                          onChange={(e) => handleChange(e, idx, "isActive")}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <input
                        type="file"
                        onChange={(e) => handleChange(e, idx, "icon")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addSubCategory}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add SubCategory
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">All Categories</h2>
        
        {categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-3">No categories found. Create your first category!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li key={cat._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  {cat.icon && (
                    <div className="flex-shrink-0">
                      <img
                        src={cat.icon}
                        alt={cat.categoryName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <strong className="text-lg text-gray-800">{cat.categoryName}</strong>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{cat.categoryType} Category</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>

                {cat.subCategories?.length > 0 && (
                  <div className="mt-4 ml-4 pl-4 border-l border-gray-300">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Subcategories:</h4>
                    <ul className="space-y-3">
                      {cat.subCategories.map((sub) => (
                        <li key={sub._id} className="flex items-center gap-3 py-2">
                          {sub.icon && (
                            <img
                              src={sub.icon}
                              alt={sub.subCategoryName}
                              className="w-8 h-8 rounded object-cover border border-gray-200"
                            />
                          )}
                          <div className="flex-grow">
                            <span className="text-gray-800">{sub.subCategoryName}</span>
                            <span className="text-xs text-gray-500 ml-2">({sub.subCategoryType})</span>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
