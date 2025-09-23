'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  Tag,
  Layers,
  Activity,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryType: 'Main',
    isActive: true,
    icon: '',
    subCategories: [{ subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' }],
  });

  const [editFormData, setEditFormData] = useState({
    categoryName: '',
    categoryType: 'Main',
    isActive: true,
    icon: '',
    subCategories: [{ subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' }],
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}catagory/getallcategories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter and sort categories
  const filteredCategories = categories
    .filter(cat => {
      const matchesSearch = cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cat.categoryType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && cat.isActive) ||
                           (statusFilter === 'inactive' && !cat.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleInputChange = (e, index = null, isSub = false, isEdit = false) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    const formState = isEdit ? editFormData : formData;
    const setFormState = isEdit ? setEditFormData : setFormData;
    
    if (isSub && index !== null) {
      const updatedSub = [...formState.subCategories];
      updatedSub[index][name] = inputValue;
      setFormState({ ...formState, subCategories: updatedSub });
    } else {
      setFormState({ ...formState, [name]: inputValue });
    }
  };

  const handleAddSubcategory = (isEdit = false) => {
    const formState = isEdit ? editFormData : formData;
    const setFormState = isEdit ? setEditFormData : setFormData;
    
    setFormState(prev => ({
      ...prev,
      subCategories: [
        ...prev.subCategories,
        { subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' },
      ],
    }));
  };

  const handleRemoveSubcategory = (index, isEdit = false) => {
    const formState = isEdit ? editFormData : formData;
    const setFormState = isEdit ? setEditFormData : setFormData;
    
    setFormState(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e, closeDialog) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}catagory/createcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setCategories([data.category, ...categories]);
        alert('Category created successfully!');
        setFormData({
          categoryName: '',
          categoryType: 'Main',
          isActive: true,
          icon: '',
          subCategories: [{ subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' }],
        });
        closeDialog();
      } else {
        alert('Failed to create category.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create category.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await fetch(`${BASE_URL}catagory/updatecategories/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();

      if (data.success) {
        setCategories(categories.map(cat => 
          cat._id === editingCategory._id ? data.category : cat
        ));
        alert('Category updated successfully!');
        setEditDialogOpen(false);
        setEditingCategory(null);
        setEditFormData({
          categoryName: '',
          categoryType: 'Main',
          isActive: true,
          icon: '',
          subCategories: [{ subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' }],
        });
      } else {
        alert('Failed to update category.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update category.');
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${BASE_URL}catagory/deletecategories/${_id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((c) => c._id !== _id));
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category.');
      }
    } catch (e) {
      console.error('Delete failed', e);
      alert('Error deleting category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditFormData({
      categoryName: category.categoryName,
      categoryType: category.categoryType,
      isActive: category.isActive,
      icon: category.icon || '',
      subCategories: category.subCategories?.length > 0 
        ? category.subCategories 
        : [{ subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' }]
    });
    setEditDialogOpen(true);
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? (
        <>
          <CheckCircle className="w-4 h-4 mr-1" />
          Active
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 mr-1" />
          Inactive
        </>
      )}
    </span>
  );

  const SortableHeader = ({ children, sortKey }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  // Category Form Component (Reusable for Add and Edit)
  const CategoryForm = ({ 
    formData, 
    onChange, 
    onAddSubcategory, 
    onRemoveSubcategory, 
    onSubmit, 
    isEdit = false,
    onCancel 
  }) => (
    <form onSubmit={onSubmit}>
      <div className="space-y-6 py-4">
        {/* Main Category Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Main Category Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                name="categoryName"
                placeholder="Enter category name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.categoryName}
                onChange={(e) => onChange(e, null, false, isEdit)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Type
              </label>
              <select
                name="categoryType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.categoryType}
                onChange={(e) => onChange(e, null, false, isEdit)}
              >
                <option value="Main">Main Category</option>
                <option value="Sub">Sub Category</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon URL
              </label>
              <input
                name="icon"
                placeholder="https://example.com/icon.png"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.icon}
                onChange={(e) => onChange(e, null, false, isEdit)}
              />
              {formData.icon && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Preview:</span>
                  <img 
                    src={formData.icon} 
                    alt="Icon preview" 
                    className="w-8 h-8 rounded object-cover border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.isActive}
                onChange={(e) => onChange(e, null, false, isEdit)}
              />
              <label className="ml-2 text-sm text-gray-700">Active Category</label>
            </div>
          </div>
        </div>

        {/* Subcategories Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Subcategories
            </h3>
            <Button
              type="button"
              onClick={() => onAddSubcategory(isEdit)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Subcategory
            </Button>
          </div>

          <div className="space-y-4">
            {formData.subCategories.map((sub, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Subcategory {idx + 1}</span>
                  {formData.subCategories.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => onRemoveSubcategory(idx, isEdit)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory Name
                    </label>
                    <input
                      name="subCategoryName"
                      placeholder="Enter subcategory name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={sub.subCategoryName}
                      onChange={(e) => onChange(e, idx, true, isEdit)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon URL
                    </label>
                    <input
                      name="icon"
                      placeholder="https://example.com/icon.png"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={sub.icon}
                      onChange={(e) => onChange(e, idx, true, isEdit)}
                    />
                    {sub.icon && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Preview:</span>
                        <img 
                          src={sub.icon} 
                          alt="Subcategory icon preview" 
                          className="w-6 h-6 rounded object-cover border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={sub.isActive}
                    onChange={(e) => onChange(e, idx, true, isEdit)}
                  />
                  <label className="ml-2 text-sm text-gray-700">Active Subcategory</label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {isEdit ? 'Update Category' : 'Create Category'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories Management</h1>
              <p className="text-gray-600">Manage and organize your product categories</p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              {/* Add Category Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4" /> 
                    Add New Category
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Category</DialogTitle>
                    <DialogDescription>
                      Add a new category to organize your products effectively.
                    </DialogDescription>
                  </DialogHeader>

                  <CategoryForm
                    formData={formData}
                    onChange={handleInputChange}
                    onAddSubcategory={handleAddSubcategory}
                    onRemoveSubcategory={handleRemoveSubcategory}
                    onSubmit={(e) => handleSubmit(e, () => document.querySelector('[data-state="closed"]')?.click())}
                    onCancel={() => document.querySelector('[data-state="closed"]')?.click()}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {categories.filter(cat => cat.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subcategories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {categories.reduce((acc, cat) => acc + (cat.subCategories?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">Today</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories by name or type..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCategories.length}</span> of{" "}
            <span className="font-semibold">{categories.length}</span> categories
          </p>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <SortableHeader sortKey="categoryType">Type</SortableHeader>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <SortableHeader sortKey="isActive">Status</SortableHeader>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No categories found</p>
                        <p className="mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <React.Fragment key={category._id}>
                      <tr 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleCategoryExpand(category._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              {category.icon ? (
                                <img
                                  src={category.icon}
                                  alt={category.categoryName}
                                  className="w-6 h-6 rounded object-cover"
                                />
                              ) : (
                                <Layers className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {category.categoryName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {category.categoryType}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            category.categoryType === 'Main' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {category.categoryType}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                              {category.subCategories?.length || 0} subcategories
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge isActive={category.isActive} />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(category);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit Category"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(category._id);
                              }}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategoryExpand(category._id);
                              }}
                              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Details */}
                      {expandedCategory === category._id && category.subCategories && category.subCategories.length > 0 && (
                        <tr className="bg-blue-50">
                          <td colSpan="5" className="px-6 py-4">
                            <div className="mb-2 font-medium text-gray-700">Subcategories:</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {category.subCategories.map((sub, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    {sub.icon && (
                                      <img
                                        src={sub.icon}
                                        alt={sub.subCategoryName}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{sub.subCategoryName}</div>
                                      <div className="text-sm text-gray-500">{sub.subCategoryType}</div>
                                    </div>
                                    <StatusBadge isActive={sub.isActive} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details and subcategories.
              </DialogDescription>
            </DialogHeader>

            {editingCategory && (
              <CategoryForm
                formData={editFormData}
                onChange={handleInputChange}
                onAddSubcategory={handleAddSubcategory}
                onRemoveSubcategory={handleRemoveSubcategory}
                onSubmit={handleEditSubmit}
                isEdit={true}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setEditingCategory(null);
                  setEditFormData({
                    categoryName: '',
                    categoryType: 'Main',
                    isActive: true,
                    icon: '',
                    subCategories: [{ subCategoryName: '', subCategoryType: 'Sub', isActive: true, icon: '' }],
                  });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}