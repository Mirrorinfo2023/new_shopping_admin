'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MoreVertical, Search } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    categoryName: '',
    categoryType: 'Main',
    isActive: true,
    icon: '',
    subCategories: [
      { subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' },
    ],
  });

  const fetchCategories = async () => {
    console.log('Fetching categories...');
    try {
      const res = await fetch('/api/catagory/getallcategories');
      const data = await res.json();
      console.log('Categories fetched:', data);
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.categoryType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e, index = null, isSub = false) => {
    const { name, value } = e.target;
    if (isSub && index !== null) {
      const updatedSub = [...formData.subCategories];
      updatedSub[index][name] = value;
      setFormData({ ...formData, subCategories: updatedSub });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSubcategory = () => {
    setFormData((prev) => ({
      ...prev,
      subCategories: [
        ...prev.subCategories,
        { subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating category...', formData);
    try {
      const res = await fetch('/api/catagory/createcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log('Create response:', data);

      if (data.success) {
        setCategories([data.category, ...categories]);
        alert('Category created!');
        setFormData({
          categoryName: '',
          categoryType: 'Main',
          isActive: true,
          icon: '',
          subCategories: [
            { subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' },
          ],
        });
      } else {
        alert('Failed to create category.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create category.');
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/catagory/deletecategories?id=${_id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((c) => c._id !== _id));
      } else {
        alert('Failed to delete category.');
      }
    } catch (e) {
      console.error('Delete failed', e);
      alert('Error deleting category');
    }
  };

  const handleEdit = (cat) => {
    const name = prompt('New category name', cat.categoryName);
    if (!name || name === cat.categoryName) return;
    setCategories(
      categories.map((c) =>
        c._id === cat._id ? { ...c, categoryName: name } : c
      )
    );
    // Optionally: call your update API here
  };

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Categories Management
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>

          <div className="mb-4">
            <input
              name="categoryName"
              placeholder="Category Name"
              className="w-full p-2 border rounded"
              value={formData.categoryName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <input
              name="icon"
              placeholder="Category Icon URL"
              className="w-full p-2 border rounded"
              value={formData.icon}
              onChange={handleInputChange}
            />
          </div>

          {/* Subcategories */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Subcategories</h3>
            {formData.subCategories.map((sub, idx) => (
              <div key={idx} className="mb-2 flex gap-2">
                <input
                  name="subCategoryName"
                  placeholder="Subcategory Name"
                  className="flex-1 p-2 border rounded"
                  value={sub.subCategoryName}
                  onChange={(e) => handleInputChange(e, idx, true)}
                />
                <input
                  name="icon"
                  placeholder="Subcategory Icon URL"
                  className="flex-1 p-2 border rounded"
                  value={sub.icon}
                  onChange={(e) => handleInputChange(e, idx, true)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSubcategory}
              className="mt-2 text-blue-600 flex items-center gap-1"
            >
              <Plus size={16} /> Add Subcategory
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
             Create Category
          </button>
        </form>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.subCategories?.map((sub) => sub.subCategoryName).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit Category"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="More Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
