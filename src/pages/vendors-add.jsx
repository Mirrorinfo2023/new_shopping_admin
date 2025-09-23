"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Lock, 
  FileText, 
  MapPin, 
  CreditCard, 
  Shield,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader,
  Plus,
  Banknote,
  IdCard,
  BadgeCheck,
  Camera,
  Eye,
  EyeOff,
  X
} from "lucide-react";

const VendorAdd = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const [formData, setFormData] = useState({
    vendorName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
    businessType: "individual",
    address: { street: "", city: "", state: "", pincode: "", country: "India" },
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    },
  });

  const [kycFiles, setKycFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    gstCertificate: null,
    businessLicense: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sectionErrors, setSectionErrors] = useState([]);

  // Custom UI Components
  const Card = ({ children, className = "", hover = false }) => (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 ${
      hover ? 'hover:shadow-lg hover:border-gray-300' : ''
    } ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className = "" }) => (
    <div className={`p-8 pb-6 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-2xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-8 pt-6 ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, onClick, type = "button", disabled = false, variant = "primary", size = "default", className = "" }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeClasses = {
      default: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      sm: "px-4 py-2 text-xs"
    };
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
      danger: "bg-red-100 text-red-700 hover:bg-red-200"
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

  const Input = ({ label, name, value, onChange, type = "text", icon: Icon, placeholder, error, required = false, className = "", showPasswordToggle = false }) => (
    <div className={`space-y-3 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            Icon ? 'pl-12' : 'pl-4'
          } ${
            showPasswordToggle ? 'pr-12' : ''
          } ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
          }`}
        />
        
        {/* Password Toggle Eye Icon */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );

  const FileUpload = ({ label, name, onChange, error, acceptedTypes = "image/*,.pdf", className = "" }) => {
    const [fileName, setFileName] = useState("");
    
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        onChange(file);
      }
    };

    return (
      <div className={`space-y-3 ${className}`}>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Upload className="h-4 w-4" />
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept={acceptedTypes}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-200 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {fileName || `Click to upload ${label.toLowerCase()}`}
                </p>
                <p className="text-xs text-gray-500">Supports: JPG, PNG, PDF (Max 5MB)</p>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const SectionCard = ({ title, description, icon: Icon, children, step, currentStep }) => (
    <Card className={`transition-all duration-300 ${
      step === currentStep ? 'ring-2 ring-blue-500' : ''
    }`}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            step <= currentStep ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          {step <= currentStep && (
            <div className="ml-auto">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step < currentStep ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {step < currentStep ? <CheckCircle2 className="h-5 w-5" /> : step}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  const ProgressSteps = () => {
    const steps = [
      { id: "basic", label: "Basic Info", icon: User },
      { id: "address", label: "Address", icon: MapPin },
      { id: "bank", label: "Bank Details", icon: Banknote },
      { id: "kyc", label: "KYC Documents", icon: Shield }
    ];
    
    const currentIndex = steps.findIndex(step => step.id === activeSection);
    
    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => handleStepClick(step.id, index)}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-200 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'border-blue-500 bg-blue-50 text-blue-500' :
                  'border-gray-300 text-gray-400'
                }`}
              >
                <StepIcon className="h-5 w-5" />
              </button>
              <span className={`ml-3 text-sm font-semibold ${
                isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 transition-all duration-200 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Validation functions for each section
  const validateBasicSection = () => {
    const newErrors = {};
    const requiredFields = [
      { field: "vendorName", message: "Vendor name is required" },
      { field: "businessName", message: "Business name is required" },
      { field: "email", message: "Email is required" },
      { field: "phone", message: "Phone number is required" },
      { field: "password", message: "Password is required" },
      { field: "gstNumber", message: "GST number is required" },
      { field: "panNumber", message: "PAN number is required" },
      { field: "aadharNumber", message: "Aadhaar number is required" }
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = message;
      }
    });

    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    // Phone validation
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number";
    }

    // Password validation
    if (formData.password && !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      newErrors.password = "Password must be 6+ chars, include uppercase, number, and special char";
    }

    // GST validation
    if (formData.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Enter a valid GST number";
    }

    // PAN validation
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = "Enter a valid PAN number";
    }

    // Aadhaar validation
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhaar must be exactly 12 digits";
    }

    return newErrors;
  };

  const validateAddressSection = () => {
    const newErrors = {};
    const requiredFields = [
      { field: "street", message: "Street address is required" },
      { field: "city", message: "City is required" },
      { field: "state", message: "State is required" },
      { field: "pincode", message: "Pincode is required" }
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!formData.address[field]?.trim()) {
        newErrors[`address.${field}`] = message;
      }
    });

    // Pincode validation
    if (formData.address.pincode && !/^[1-9][0-9]{5}$/.test(formData.address.pincode)) {
      newErrors["address.pincode"] = "Enter a valid 6-digit Indian pincode";
    }

    return newErrors;
  };

  const validateBankSection = () => {
    const newErrors = {};
    const requiredFields = [
      { field: "accountHolderName", message: "Account holder name is required" },
      { field: "accountNumber", message: "Account number is required" },
      { field: "ifscCode", message: "IFSC code is required" },
      { field: "bankName", message: "Bank name is required" },
      { field: "branch", message: "Branch is required" }
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!formData.bankDetails[field]?.trim()) {
        newErrors[`bankDetails.${field}`] = message;
      }
    });

    // Account number validation
    if (formData.bankDetails.accountNumber && !/^\d{9,18}$/.test(formData.bankDetails.accountNumber)) {
      newErrors["bankDetails.accountNumber"] = "Enter a valid account number (9-18 digits)";
    }

    // IFSC code validation
    if (formData.bankDetails.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)) {
      newErrors["bankDetails.ifscCode"] = "Enter a valid IFSC code";
    }

    return newErrors;
  };

  const validateKycSection = () => {
    const newErrors = {};
    const requiredFiles = [
      { field: "aadharFront", message: "Aadhaar front is required" },
      { field: "aadharBack", message: "Aadhaar back is required" },
      { field: "panCard", message: "PAN card is required" }
    ];

    requiredFiles.forEach(({ field, message }) => {
      if (!kycFiles[field]) {
        newErrors[field] = message;
      }
    });

    return newErrors;
  };

  const validateCurrentSection = () => {
    let sectionErrors = {};
    
    switch (activeSection) {
      case "basic":
        sectionErrors = validateBasicSection();
        break;
      case "address":
        sectionErrors = validateAddressSection();
        break;
      case "bank":
        sectionErrors = validateBankSection();
        break;
      case "kyc":
        sectionErrors = validateKycSection();
        break;
      default:
        break;
    }

    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const getEmptyFieldsForSection = (sectionErrors) => {
    const fieldLabels = {
      "vendorName": "Vendor Name",
      "businessName": "Business Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "password": "Password",
      "gstNumber": "GST Number",
      "panNumber": "PAN Number",
      "aadharNumber": "Aadhaar Number",
      "address.street": "Street Address",
      "address.city": "City",
      "address.state": "State",
      "address.pincode": "Pincode",
      "bankDetails.accountHolderName": "Account Holder Name",
      "bankDetails.accountNumber": "Account Number",
      "bankDetails.ifscCode": "IFSC Code",
      "bankDetails.bankName": "Bank Name",
      "bankDetails.branch": "Branch",
      "aadharFront": "Aadhaar Front",
      "aadharBack": "Aadhaar Back",
      "panCard": "PAN Card"
    };

    return Object.keys(sectionErrors).map(field => fieldLabels[field] || field);
  };

  const handleStepClick = (stepId, stepIndex) => {
    const currentIndex = ["basic", "address", "bank", "kyc"].indexOf(activeSection);
    if (stepIndex <= currentIndex) {
      setActiveSection(stepId);
      setSectionErrors([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (field, file) => {
    setKycFiles(prev => ({ ...prev, [field]: file }));
    // Clear file error when user uploads a file
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { 
        ...formData, 
        kycDocuments: kycFiles 
      };

      const response = await fetch(`${BASE_URL}vendors/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === 200) {
        setSuccess("Vendor created successfully! Redirecting...");
        setTimeout(() => router.push("/vendor"), 2000);
      } else {
        setErrors({ submit: data.message || "Failed to create vendor" });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSection = () => {
    if (!validateCurrentSection()) {
      const emptyFields = getEmptyFieldsForSection(errors);
      setSectionErrors(emptyFields);
      return;
    }

    setSectionErrors([]);
    const sections = ["basic", "address", "bank", "kyc"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const prevSection = () => {
    setSectionErrors([]);
    const sections = ["basic", "address", "bank", "kyc"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  // Full form validation for final submission
  const validateForm = () => {
    const basicErrors = validateBasicSection();
    const addressErrors = validateAddressSection();
    const bankErrors = validateBankSection();
    const kycErrors = validateKycSection();

    const allErrors = {
      ...basicErrors,
      ...addressErrors,
      ...bankErrors,
      ...kycErrors
    };

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Vendors
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Add New Vendor
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete the vendor registration process by filling in the required information step by step
            </p>
          </div>

          <ProgressSteps />
        </div>

        {/* Section Errors */}
        {sectionErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-semibold">Please fill in the following required fields:</p>
              </div>
              <button
                onClick={() => setSectionErrors([])}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {sectionErrors.map((field, index) => (
                <li key={index} className="ml-4">{field}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-semibold">Success!</p>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          {activeSection === "basic" && (
            <SectionCard
              title="Basic Information"
              description="Enter vendor's personal and business details"
              icon={User}
              step={1}
              currentStep={1}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Vendor Full Name"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  icon={User}
                  placeholder="Enter vendor's full name"
                  error={errors.vendorName}
                  required
                />
                <Input
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  icon={Building}
                  placeholder="Enter business name"
                  error={errors.businessName}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  placeholder="vendor@example.com"
                  error={errors.email}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                  placeholder="10-digit Indian number"
                  error={errors.phone}
                  required
                />
                
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  placeholder="Create a strong password"
                  error={errors.password}
                  required
                  showPasswordToggle={true}
                />
                
                <Input
                  label="Business Type"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  icon={Building}
                  placeholder="Individual/Company"
                />
                <Input
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  icon={FileText}
                  placeholder="22ABCDE1234F1Z5"
                  error={errors.gstNumber}
                  required
                />
                <Input
                  label="PAN Number"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  icon={IdCard}
                  placeholder="ABCDE1234F"
                  error={errors.panNumber}
                  required
                />
                <Input
                  label="Aadhaar Number"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  icon={BadgeCheck}
                  placeholder="12-digit Aadhaar number"
                  error={errors.aadharNumber}
                  required
                />
              </div>
            </SectionCard>
          )}

          {/* Address Information */}
          {activeSection === "address" && (
            <SectionCard
              title="Address Information"
              description="Enter vendor's business address details"
              icon={MapPin}
              step={2}
              currentStep={2}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street and building number"
                  error={errors["address.street"]}
                  required
                />
                <Input
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  error={errors["address.city"]}
                  required
                />
                <Input
                  label="State"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  error={errors["address.state"]}
                  required
                />
                <Input
                  label="Pincode"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  error={errors["address.pincode"]}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Bank Details */}
          {activeSection === "bank" && (
            <SectionCard
              title="Bank Details"
              description="Enter vendor's bank account information"
              icon={Banknote}
              step={3}
              currentStep={3}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Account Holder Name"
                  name="bankDetails.accountHolderName"
                  value={formData.bankDetails.accountHolderName}
                  onChange={handleChange}
                  placeholder="Full name as in bank"
                  error={errors["bankDetails.accountHolderName"]}
                  required
                />
                <Input
                  label="Account Number"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                  placeholder="9-18 digit account number"
                  error={errors["bankDetails.accountNumber"]}
                  required
                />
                <Input
                  label="IFSC Code"
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g., SBIN0000123"
                  error={errors["bankDetails.ifscCode"]}
                  required
                />
                <Input
                  label="Bank Name"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                  placeholder="Bank name"
                  error={errors["bankDetails.bankName"]}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Branch"
                    name="bankDetails.branch"
                    value={formData.bankDetails.branch}
                    onChange={handleChange}
                    placeholder="Branch name and location"
                    error={errors["bankDetails.branch"]}
                    required
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* KYC Documents */}
          {activeSection === "kyc" && (
            <SectionCard
              title="KYC Documents"
              description="Upload required documents for verification"
              icon={Shield}
              step={4}
              currentStep={4}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Aadhaar Front"
                  name="aadharFront"
                  onChange={(file) => handleFileUpload("aadharFront", file)}
                  error={errors.aadharFront}
                />
                <FileUpload
                  label="Aadhaar Back"
                  name="aadharBack"
                  onChange={(file) => handleFileUpload("aadharBack", file)}
                  error={errors.aadharBack}
                />
                <FileUpload
                  label="PAN Card"
                  name="panCard"
                  onChange={(file) => handleFileUpload("panCard", file)}
                  error={errors.panCard}
                />
                <FileUpload
                  label="GST Certificate"
                  name="gstCertificate"
                  onChange={(file) => handleFileUpload("gstCertificate", file)}
                  error={errors.gstCertificate}
                />
                <div className="md:col-span-2">
                  <FileUpload
                    label="Business License"
                    name="businessLicense"
                    onChange={(file) => handleFileUpload("businessLicense", file)}
                    error={errors.businessLicense}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
            <div className="flex gap-4">
              {activeSection !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevSection}
                  className="flex-1 sm:flex-none"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {activeSection !== "kyc" && (
                <Button
                  type="button"
                  onClick={nextSection}
                  className="flex-1 sm:flex-none"
                >
                  Next
                  <Plus className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
            
            {activeSection === "kyc" && (
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Creating Vendor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Create Vendor
                  </>
                )}
              </Button>
            )}
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

export default VendorAdd;