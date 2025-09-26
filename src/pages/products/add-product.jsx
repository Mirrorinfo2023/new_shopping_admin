'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProductService } from '@/services/products';
import VendorDropdown from '@/components/vendor/vendordropdown';
import CategoryDropdown from '@/components/category/categorydropdown';
import { AlertCircle, CheckCircle2, Plus, Trash2, Image as ImageIcon, Tag, Layers, Sliders, Star, ArrowLeft, Upload, DollarSign, Package, Truck, Zap, Shield, X } from 'lucide-react';

const AddProduct = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const generateSKU = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      return `SKU-${year}${month}${day}-${hours}${minutes}${seconds}`;
    };

    setFormData((prev) => ({ ...prev, sku: generateSKU() }));
  }, []);

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

  // Validation rules
  const validationRules = {
    productName: {
      required: true,
      minLength: 3,
      maxLength: 200,
      pattern: /^[a-zA-Z0-9\s\-&.,()]+$/,
      message: 'Product name must be 3-200 characters and contain only letters, numbers, spaces, and basic punctuation'
    },
    sku: {
      required: true,
      pattern: /^SKU-\d{8}-\d{6}$/,
      message: 'SKU must follow the format SKU-YYYYMMDD-HHMMSS'
    },
    description: {
      required: true,
      minLength: 50,
      maxLength: 2000,
      message: 'Description must be between 50 and 2000 characters'
    },
    shortDescription: {
      required: true,
      minLength: 20,
      maxLength: 500,
      message: 'Short description must be between 20 and 500 characters'
    },
    brand: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Brand name must be between 2 and 100 characters'
    },
    categoryId: {
      required: true,
      message: 'Please select a category'
    },
    price: {
      required: true,
      min: 0.01,
      max: 1000000,
      message: 'Price must be between $0.01 and $1,000,000'
    },
    discount: {
      min: 0,
      max: 100,
      message: 'Discount must be between 0% and 100%'
    },
    quantity: {
      required: true,
      min: 0,
      max: 1000000,
      message: 'Quantity must be between 0 and 1,000,000'
    },
    thumbnail: {
      required: true,
      pattern: /^https?:\/\/.+\..+$/,
      message: 'Please enter a valid thumbnail image URL'
    }
  };

  // Validate individual field
  const validateField = (field, value) => {
    const rules = validationRules[field];
    if (!rules) return null;

    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'This field is required';
    }

    if (rules.minLength && value && value.toString().length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    if (rules.maxLength && value && value.toString().length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    if (rules.min !== undefined && value < rules.min) {
      return `Minimum value is ${rules.min}`;
    }

    if (rules.max !== undefined && value > rules.max) {
      return `Maximum value is ${rules.max}`;
    }

    if (rules.pattern && value && !rules.pattern.test(value.toString())) {
      return rules.message;
    }

    return null;
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {};

    // Validate basic fields
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    // Validate images
    if (formData.images.length > 0) {
      formData.images.forEach((image, index) => {
        if (image.url && !/^https?:\/\/.+\..+$/.test(image.url)) {
          errors[`images_${index}_url`] = 'Please enter a valid image URL';
        }
        if (image.url && image.alt.trim() === '') {
          errors[`images_${index}_alt`] = 'Alt text is required for images';
        }
      });
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (variant.variantName || variant.value || variant.additionalPrice !== 0) {
        if (!variant.variantName.trim()) {
          errors[`variants_${index}_variantName`] = 'Variant type is required';
        }
        if (!variant.value.trim()) {
          errors[`variants_${index}_value`] = 'Variant value is required';
        }
        if (variant.additionalPrice < -1000 || variant.additionalPrice > 1000) {
          errors[`variants_${index}_additionalPrice`] = 'Additional price must be between -1000 and 1000';
        }
      }
    });

    // Validate attributes
    formData.attributes.forEach((attr, index) => {
      if (attr.key || attr.value) {
        if (!attr.key.trim()) {
          errors[`attributes_${index}_key`] = 'Attribute key is required';
        }
        if (!attr.value.trim()) {
          errors[`attributes_${index}_value`] = 'Attribute value is required';
        }
      }
    });

    // Validate tags
    formData.tags.forEach((tag, index) => {
      if (tag.trim() && tag.length < 2) {
        errors[`tags_${index}`] = 'Tag must be at least 2 characters';
      }
      if (tag.trim() && tag.length > 50) {
        errors[`tags_${index}`] = 'Tag must be less than 50 characters';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate on field change
  const validateOnChange = (field, value) => {
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
    return !error;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateOnChange(field, value);
    if (error) setError('');
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const updated = [...formData[field]];
    if (subfield) {
      updated[index][subfield] = value;
    } else {
      updated[index] = value;
    }
    setFormData((prev) => ({ ...prev, [field]: updated }));
    
    // Validate the changed field
    if (subfield) {
      const errorKey = `${field}_${index}_${subfield}`;
      let error = null;
      
      if (field === 'images' && subfield === 'url' && value && !/^https?:\/\/.+\..+$/.test(value)) {
        error = 'Please enter a valid image URL';
      } else if (field === 'images' && subfield === 'alt' && value.trim() === '' && updated[index].url) {
        error = 'Alt text is required for images';
      } else if (field === 'variants' && subfield === 'additionalPrice' && (value < -1000 || value > 1000)) {
        error = 'Additional price must be between -1000 and 1000';
      } else if (field === 'tags' && value && value.length < 2) {
        error = 'Tag must be at least 2 characters';
      } else if (field === 'tags' && value && value.length > 50) {
        error = 'Tag must be less than 50 characters';
      }
      
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: error
      }));
    }
    
    if (error) setError('');
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
    
    // Remove validation errors for deleted item
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${field}_${index}`)) {
        delete newErrors[key];
      } else if (key.startsWith(`${field}_`) && parseInt(key.split('_')[1]) > index) {
        // Update indexes for remaining items
        const parts = key.split('_');
        const oldIndex = parseInt(parts[1]);
        if (oldIndex > index) {
          const newKey = `${field}_${oldIndex - 1}` + (parts[2] ? `_${parts[2]}` : '');
          newErrors[newKey] = newErrors[key];
          delete newErrors[key];
        }
      }
    });
    setValidationErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validate entire form
    if (!validateForm()) {
      setIsSubmitting(false);
      setError('Please fix the validation errors before submitting.');
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    try {
      const res = await createProductService(formData);
      setSuccess('Product created successfully!');
      setTimeout(() => {
        router.push('/products');
      }, 1500);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDiscountedPrice = () => {
    const price = formData.price || 0;
    const discount = formData.discount || 0;
    return price - (price * discount / 100);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-50';
      case 'out_of_stock': return 'text-red-600 bg-red-50';
      case 'pre_order': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Error display component for individual fields
  const FieldError = ({ error, fieldId }) => {
    if (!error) return null;
    
    return (
      <div id={`${fieldId}_error`} className="flex items-center gap-1 mt-1 text-red-600 text-xs animate-fadeIn">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  };

  // Custom UI Components
  const Card = ({ children, className = '', hover = false }) => (
    <div className={`border border-gray-200 rounded-xl bg-white shadow-sm transition-all duration-200 ${
      hover ? 'hover:shadow-md hover:border-gray-300' : ''
    } ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className = '' }) => (
    <div className={`p-6 pb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );

  const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  );

  const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'default', size = 'default', className = '' }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const sizeClasses = {
      default: 'px-4 py-2.5 text-sm',
      sm: 'px-3 py-2 text-xs',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2'
    };
    const variants = {
      default: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:from-blue-700 hover:to-purple-700 hover:shadow-md',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Input = ({ value, onChange, placeholder, type = 'text', id, readOnly = false, className = '', step, hasError = false }) => (
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        step={step}
        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
        } ${
          hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {hasError && (
        <X className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  );

  const Textarea = ({ value, onChange, placeholder, rows = 3, id, className = '', hasError = false }) => (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical ${
          hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {hasError && (
        <X className="h-4 w-4 text-red-500 absolute right-3 top-3" />
      )}
    </div>
  );

  const Label = ({ children, htmlFor, className = '', required = false }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  // Alert Components
  const ErrorAlert = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
          ×
        </button>
      </div>
    );
  };

  const SuccessAlert = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-green-800 font-medium">Success</p>
          <p className="text-green-700 text-sm">{message}</p>
        </div>
      </div>
    );
  };

  // Validation Summary Component
  const ValidationSummary = () => {
    const errorCount = Object.keys(validationErrors).length;
    if (errorCount === 0) return null;

    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">Validation Issues</span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            {errorCount} issue{errorCount > 1 ? 's' : ''}
          </span>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          {Object.entries(validationErrors).slice(0, 3).map(([field, error]) => (
            <li key={field}>• {error}</li>
          ))}
          {errorCount > 3 && (
            <li>• ...and {errorCount - 3} more issues</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Products
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Product
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Add a new product to your inventory with ease</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Auto-generated SKU
              </span>
            </div>
          </div>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />
        <ValidationSummary />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information Tab */}
              <Card hover={true}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    </div>
                    Product Information
                  </CardTitle>
                  <CardDescription>Enter the basic details that describe your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName" required>
                        Product Name
                      </Label>
                      <Input
                        id="productName"
                        placeholder="e.g., Wireless Bluetooth Headphones"
                        value={formData.productName}
                        onChange={(e) => handleChange('productName', e.target.value)}
                        hasError={!!validationErrors.productName}
                      />
                      <FieldError error={validationErrors.productName} fieldId="productName" />
                    </div>

                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={formData.sku}
                        readOnly
                        className="bg-gray-50 font-mono"
                        hasError={!!validationErrors.sku}
                      />
                      <FieldError error={validationErrors.sku} fieldId="sku" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand" required>
                        Brand
                      </Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Sony, Apple, Nike"
                        value={formData.brand}
                        onChange={(e) => handleChange('brand', e.target.value)}
                        hasError={!!validationErrors.brand}
                      />
                      <FieldError error={validationErrors.brand} fieldId="brand" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId" required>
                        Category
                      </Label>
                      <CategoryDropdown
                        value={formData.categoryId}
                        onChange={(val) => handleChange('categoryId', val)}
                      />
                      <FieldError error={validationErrors.categoryId} fieldId="categoryId" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription" required>
                      Short Description
                    </Label>
                    <Textarea
                      id="shortDescription"
                      placeholder="Brief description for product listings and search results..."
                      value={formData.shortDescription}
                      onChange={(e) => handleChange('shortDescription', e.target.value)}
                      hasError={!!validationErrors.shortDescription}
                    />
                    <div className="flex justify-between items-center">
                      <FieldError error={validationErrors.shortDescription} fieldId="shortDescription" />
                      <span className={`text-xs ${
                        formData.shortDescription.length > 500 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formData.shortDescription.length}/500
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" required>
                      Full Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed product description with features, specifications, and benefits..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      hasError={!!validationErrors.description}
                    />
                    <div className="flex justify-between items-center">
                      <FieldError error={validationErrors.description} fieldId="description" />
                      <span className={`text-xs ${
                        formData.description.length > 2000 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formData.description.length}/2000
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Tab */}
              <Card hover={true}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ImageIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    Product Media
                  </CardTitle>
                  <CardDescription>Add high-quality images to showcase your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="thumbnail" required>
                      Thumbnail Image URL
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="thumbnail"
                        placeholder="https://example.com/thumbnail.jpg"
                        value={formData.thumbnail}
                        onChange={(e) => handleChange('thumbnail', e.target.value)}
                        hasError={!!validationErrors.thumbnail}
                      />
                      <Button variant="outline" className="whitespace-nowrap">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <FieldError error={validationErrors.thumbnail} fieldId="thumbnail" />
                    {formData.thumbnail && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                        <img src={formData.thumbnail} alt="Thumbnail preview" className="h-20 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-200 my-6" />

                  <div className="space-y-4">
                    <Label>Additional Images</Label>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 border rounded-xl bg-gray-50/50 transition-all hover:bg-gray-100/50">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Image URL</Label>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              value={img.url}
                              onChange={(e) => handleArrayChange('images', idx, 'url', e.target.value)}
                              hasError={!!validationErrors[`images_${idx}_url`]}
                            />
                            <FieldError error={validationErrors[`images_${idx}_url`]} fieldId={`images_${idx}_url`} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Alt Text</Label>
                            <Input
                              placeholder="Description for accessibility and SEO"
                              value={img.alt}
                              onChange={(e) => handleArrayChange('images', idx, 'alt', e.target.value)}
                              hasError={!!validationErrors[`images_${idx}_alt`]}
                            />
                            <FieldError error={validationErrors[`images_${idx}_alt`]} fieldId={`images_${idx}_alt`} />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromArray('images', idx)}
                          className="mt-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray('images', { url: '', alt: '' })}
                      className="w-full border-dashed hover:border-solid"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Continue with other tabs (Variants, Attributes) following the same pattern... */}
              {/* ... (rest of the component remains similar but with validation added to each field) ... */}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pricing Card */}
              <Card hover={true}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="price" required>
                      Base Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleChange('price', Number(e.target.value))}
                      hasError={!!validationErrors.price}
                    />
                    <FieldError error={validationErrors.price} fieldId="price" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={formData.discount}
                      onChange={(e) => handleChange('discount', Number(e.target.value))}
                      hasError={!!validationErrors.discount}
                    />
                    <FieldError error={validationErrors.discount} fieldId="discount" />
                  </div>

                  {formData.discount > 0 && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Discounted Price:</span>
                        <span className="font-bold text-2xl text-green-900">
                          ${calculateDiscountedPrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        You save ${(formData.price * formData.discount / 100).toFixed(2)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inventory Card */}
              <Card hover={true}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="quantity" required>
                      Stock Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => handleChange('quantity', Number(e.target.value))}
                      hasError={!!validationErrors.quantity}
                    />
                    <FieldError error={validationErrors.quantity} fieldId="quantity" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="stockStatus">Stock Status</Label>
                    <select
                      id="stockStatus"
                      value={formData.stockStatus}
                      onChange={(e) => handleChange('stockStatus', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="pre_order">Pre-order</option>
                    </select>
                    <div className={`px-3 py-1 rounded text-xs font-medium inline-block ${getStockStatusColor(formData.stockStatus)}`}>
                      {formData.stockStatus.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Card */}
              <Card className="sticky top-8 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center mb-4">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Ready to Publish</h3>
                    <p className="text-sm text-gray-600">
                      {Object.keys(validationErrors).length > 0 
                        ? `Fix ${Object.keys(validationErrors).length} validation issue(s)`
                        : 'All validations passed'
                      }
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full border-gray-300 hover:border-gray-400"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;