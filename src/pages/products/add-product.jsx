'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProductService } from '@/services/products';
import VendorDropdown from '@/components/vendor/vendordropdown';
import CategoryDropdown from '@/components/category/categorydropdown';
import { AlertCircle, CheckCircle2, Plus, Trash2, Image as ImageIcon, Tag, Layers, Sliders, Star, ArrowLeft, Upload, DollarSign, Package, Truck, Zap, Shield } from 'lucide-react';

const AddProduct = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Enhanced validation
    if (!formData.productName.trim()) {
      setError('Product name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.categoryId) {
      setError('Please select a category');
      setIsSubmitting(false);
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      setIsSubmitting(false);
      return;
    }

    if (formData.discount < 0 || formData.discount > 100) {
      setError('Discount must be between 0 and 100');
      setIsSubmitting(false);
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

  // Custom UI Components with improved styling
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

  const Input = ({ value, onChange, placeholder, type = 'text', id, readOnly = false, className = '', step }) => (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      step={step}
      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
      } ${className}`}
    />
  );

  const Textarea = ({ value, onChange, placeholder, rows = 3, id, className = '' }) => (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical ${className}`}
    />
  );

  const Label = ({ children, htmlFor, className = '', required = false }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const Switch = ({ checked, onCheckedChange, id }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-300 text-gray-700 bg-white',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  const TabsList = ({ children, className = '' }) => (
    <div className={`inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );

  const TabsTrigger = ({ value, children, className = '' }) => (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        activeTab === value 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
      } ${className}`}
    >
      {children}
    </button>
  );

  const TabsContent = ({ value, children }) => {
    if (activeTab !== value) return null;
    return <div className="mt-6 animate-fadeIn">{children}</div>;
  };

  const Separator = ({ className = '' }) => (
    <hr className={`border-gray-200 my-6 ${className}`} />
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

  // Progress Indicator
  const ProgressIndicator = () => {
    const steps = [
      { id: 'basic', label: 'Basic Info', icon: CheckCircle2 },
      { id: 'media', label: 'Media', icon: ImageIcon },
      { id: 'variants', label: 'Variants', icon: Layers },
      { id: 'seo', label: 'Attributes', icon: Sliders }
    ];
    
    const currentIndex = steps.findIndex(step => step.id === activeTab);
    
    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                isActive ? 'border-blue-500 bg-blue-50 text-blue-500' :
                'border-gray-300 text-gray-400'
              }`}>
                <StepIcon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-all duration-200 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
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
              <Badge variant="outline" className="px-4 py-2 text-sm border-blue-200 bg-blue-50">
                <Zap className="h-4 w-4 mr-1" />
                Auto-generated SKU
              </Badge>
            </div>
          </div>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        {/* Progress Indicator */}
        <ProgressIndicator />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <TabsList className="w-full">
                    <TabsTrigger value="basic" className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="media" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Media
                    </TabsTrigger>
                    <TabsTrigger value="variants" className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Variants
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      Attributes
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>

              {/* Basic Information Tab */}
              <TabsContent value="basic">
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
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input
                          value={formData.sku}
                          readOnly
                          className="bg-gray-50 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          placeholder="e.g., Sony, Apple, Nike"
                          value={formData.brand}
                          onChange={(e) => handleChange('brand', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoryId" required>
                          Category
                        </Label>
                        <CategoryDropdown
                          value={formData.categoryId}
                          onChange={(val) => handleChange('categoryId', val)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Input
                        id="shortDescription"
                        placeholder="Brief description for product listings and search results..."
                        value={formData.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Detailed product description with features, specifications, and benefits..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media">
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
                      <Label>Thumbnail Image URL</Label>
                      <div className="flex gap-3">
                        <Input
                          placeholder="https://example.com/thumbnail.jpg"
                          value={formData.thumbnail}
                          onChange={(e) => handleChange('thumbnail', e.target.value)}
                        />
                        <Button variant="outline" className="whitespace-nowrap">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      {formData.thumbnail && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                          <img src={formData.thumbnail} alt="Thumbnail preview" className="h-20 object-cover rounded" />
                        </div>
                      )}
                    </div>

                    <Separator />

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
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Alt Text</Label>
                              <Input
                                placeholder="Description for accessibility and SEO"
                                value={img.alt}
                                onChange={(e) => handleArrayChange('images', idx, 'alt', e.target.value)}
                              />
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
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants">
                <Card hover={true}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Layers className="h-6 w-6 text-green-600" />
                      </div>
                      Product Variants
                    </CardTitle>
                    <CardDescription>Add size, color, or other variants with price adjustments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {formData.variants.map((v, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 border rounded-xl bg-gray-50/50 transition-all hover:bg-gray-100/50">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Variant Type</Label>
                            <Input
                              placeholder="e.g., Color, Size, Material"
                              value={v.variantName}
                              onChange={(e) => handleArrayChange('variants', idx, 'variantName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Value</Label>
                            <Input
                              placeholder="e.g., Red, Large, Leather"
                              value={v.value}
                              onChange={(e) => handleArrayChange('variants', idx, 'value', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Additional Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={v.additionalPrice}
                              onChange={(e) => handleArrayChange('variants', idx, 'additionalPrice', Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromArray('variants', idx)}
                          className="mt-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addToArray('variants', { variantName: '', value: '', additionalPrice: 0 })}
                      className="w-full border-dashed hover:border-solid"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="seo">
                <Card hover={true}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Sliders className="h-6 w-6 text-orange-600" />
                      </div>
                      Product Attributes & Tags
                    </CardTitle>
                    <CardDescription>Add custom attributes and SEO tags to improve discoverability</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Tags Section */}
                    <div className="space-y-4">
                      <Label>Product Tags</Label>
                      {formData.tags.map((tag, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <Input
                            placeholder="e.g., wireless, bluetooth, premium, waterproof"
                            value={tag}
                            onChange={(e) => handleArrayChange('tags', idx, null, e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray('tags', idx)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addToArray('tags', '')}
                        className="w-full border-dashed hover:border-solid"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tag
                      </Button>
                    </div>

                    <Separator />

                    {/* Attributes Section */}
                    <div className="space-y-4">
                      <Label>Custom Attributes</Label>
                      {formData.attributes.map((attr, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <Input
                            placeholder="Attribute (e.g., Material, Weight, Dimensions)"
                            value={attr.key}
                            onChange={(e) => handleArrayChange('attributes', idx, 'key', e.target.value)}
                          />
                          <Input
                            placeholder="Value (e.g., Leather, 1.2kg, 10x5x3cm)"
                            value={attr.value}
                            onChange={(e) => handleArrayChange('attributes', idx, 'value', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromArray('attributes', idx)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addToArray('attributes', { key: '', value: '' })}
                        className="w-full border-dashed hover:border-solid"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Attribute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
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
                    />
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
                    />
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
                    <Label htmlFor="quantity">Stock Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => handleChange('quantity', Number(e.target.value))}
                    />
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

              {/* Vendor & Features Card */}
              <Card hover={true}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Truck className="h-5 w-5 text-purple-600" />
                    </div>
                    Vendor & Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="vendorId">Vendor</Label>
                    <VendorDropdown
                      value={formData.vendorId}
                      onChange={(val) => handleChange('vendorId', val)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Label htmlFor="isFeatured" className="flex items-center gap-3 cursor-pointer mb-0">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">Featured Product</div>
                          <div className="text-sm text-gray-600">Show this product prominently</div>
                        </div>
                      </Label>
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(val) => handleChange('isFeatured', val)}
                      />
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
                    <p className="text-sm text-gray-600">Review your product before creating</p>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
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

export default AddProduct