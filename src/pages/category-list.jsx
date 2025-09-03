'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { post } from '@/utils/network';

export default function CreateCategoryForm() {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryType: 'Main',
    isActive: true,
    icon: '',
    subCategories: [
      {
        subCategoryName: '',
        subCategoryType: 'Sub',
        isActive: true,
        icon: '',
      },
    ],
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await post('https://secure.aladin25.live/api/catagory/createcategories', formData);
      alert(' Category created!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create category.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold">Create Category</h2>

      <input
        name="categoryName"
        placeholder="Category Name"
        className="w-full p-2 border rounded"
        value={formData.categoryName}
        onChange={handleInputChange}
      />

      <input
        name="icon"
        placeholder="Category Icon URL"
        className="w-full p-2 border rounded"
        value={formData.icon}
        onChange={handleInputChange}
      />

      <div className="space-y-2">
        <h3 className="font-semibold">Subcategory</h3>
        <input
          name="subCategoryName"
          placeholder="Subcategory Name"
          className="w-full p-2 border rounded"
          value={formData.subCategories[0].subCategoryName}
          onChange={(e) => handleInputChange(e, 0, true)}
        />

        <input
          name="icon"
          placeholder="Subcategory Icon URL"
          className="w-full p-2 border rounded"
          value={formData.subCategories[0].icon}
          onChange={(e) => handleInputChange(e, 0, true)}
        />
      </div>

      <Button type="submit" className="w-full text-lg font-semibold">
        🚀 Create Category
      </Button>
    </form>
  );
}
