import React, { useState, useEffect } from 'react';

// Mock API service (same as provided)
const mockApi = {
  getKYCList: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
           data: [
            {
              id: 1,
              username: "vendor1",
              panNumber: "ABCDE1234F",
              aadhaarNumber: "1234 5678 9012",
              bankName: "State Bank of India",
              ifscCode: "SBIN0000123",
              accountNumber: "123456789012",
              accountHolder: "Vendor One",
              nomineeName: "Rahul Sharma",
              nomineeRelation: "Brother",
              address: "123 Main St, Mumbai, Maharashtra",
              panImage: "https://via.placeholder.com/100x60?text=PAN",
              aadhaarImage: "https://via.placeholder.com/100x60?text=Aadhaar+Front",
              aadhaarBackImage: "https://via.placeholder.com/100x60?text=Aadhaar+Back",
              checkbookImage: "https://via.placeholder.com/100x60?text=Checkbook",
              createdDate: "2023-05-15",
              modifiedDate: "2023-05-16",
              status: "Pending",
              rejectionReason: ""
            },
            {
              id: 2,
              username: "vendor2",
              panNumber: "FGHIJ5678K",
              aadhaarNumber: "9876 5432 1098",
              bankName: "HDFC Bank",
              ifscCode: "HDFC0000456",
              accountNumber: "987654321098",
              accountHolder: "Vendor Two",
              nomineeName: "Priya Patel",
              nomineeRelation: "Wife",
              address: "456 Oak Ave, Bangalore, Karnataka",
              panImage: "https://via.placeholder.com/100x60?text=PAN",
              aadhaarImage: "https://via.placeholder.com/100x60?text=Aadhaar+Front",
              aadhaarBackImage: "https://via.placeholder.com/100x60?text=Aadhaar+Back",
              checkbookImage: "https://via.placeholder.com/100x60?text=Checkbook",
              createdDate: "2023-06-10",
              modifiedDate: "2023-06-12",
              status: "Approved",
              rejectionReason: ""
            },
            {
              id: 3,
              username: "vendor3",
              panNumber: "KLMNO9012P",
              aadhaarNumber: "2468 1357 8024",
              bankName: "ICICI Bank",
              ifscCode: "ICIC0000789",
              accountNumber: "246813579024",
              accountHolder: "Vendor Three",
              nomineeName: "Amit Kumar",
              nomineeRelation: "Father",
              address: "789 Pine Rd, Delhi",
              panImage: "https://via.placeholder.com/100x60?text=PAN",
              aadhaarImage: "https://via.placeholder.com/100x60?text=Aadhaar+Front",
              aadhaarBackImage: "https://via.placeholder.com/100x60?text=Aadhaar+Back",
              checkbookImage: "https://via.placeholder.com/100x60?text=Checkbook",
              createdDate: "2023-07-05",
              modifiedDate: "2023-07-07",
              status: "Rejected",
              rejectionReason: "PAN card image unclear"
            }
          ]
        });
      }, 1000);
    });
  },

  submitKYC: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: "KYC submitted successfully" } });
      }, 1500);
    });
  },

  updateKYC: (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: "KYC updated successfully" } });
      }, 1500);
    });
  },

  approveKYC: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: "KYC approved successfully" } });
      }, 1000);
    });
  },

  rejectKYC: (id, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: "KYC rejected successfully" } });
      }, 1000);
    });
  },

  deleteKYC: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: "KYC deleted successfully" } });
      }, 1000);
    });
  }
};

// Vendor KYC Form Component (fixed)
const VendorKYCForm = ({ isOpen, onClose, onSubmit, editData, isEdit }) => {
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    accountNumber: '',
    accountHolder: '',
    bankName: '',
    ifscCode: '',
    nomineeName: '',
    fullAddress: '',
    nomineeRelation: '',
    panImage: null,
    aadharImage: null,
    aadharBackImage: null,
    chequeBookImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        aadhaarNumber: editData.aadhaarNumber || '',
        panNumber: editData.panNumber || '',
        accountNumber: editData.accountNumber || '',
        accountHolder: editData.accountHolder || '',
        bankName: editData.bankName || '',
        ifscCode: editData.ifscCode || '',
        nomineeName: editData.nomineeName || '',
        fullAddress: editData.address || '',
        nomineeRelation: editData.nomineeRelation || '',
        panImage: null,
        aadharImage: null,
        aadharBackImage: null,
        chequeBookImage: null
      });
    } else {
      // Reset form when opening for new entry
      setFormData({
        aadhaarNumber: '',
        panNumber: '',
        accountNumber: '',
        accountHolder: '',
        bankName: '',
        ifscCode: '',
        nomineeName: '',
        fullAddress: '',
        nomineeRelation: '',
        panImage: null,
        aadharImage: null,
        aadharBackImage: null,
        chequeBookImage: null
      });
    }
    // Reset touched and errors when form opens/closes
    setTouched({});
    setErrors({});
  }, [isEdit, editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validate the field that just lost focus
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'aadhaarNumber':
        if (!value) {
          error = 'Aadhaar number is required';
        } else if (!value.match(/^\d{4}\s\d{4}\s\d{4}$/)) {
          error = 'Aadhaar must be in XXXX XXXX XXXX format';
        }
        break;
        
      case 'panNumber':
        if (!value) {
          error = 'PAN number is required';
        } else if (!value.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
          error = 'PAN must be in ABCDE1234F format';
        }
        break;
        
      case 'accountNumber':
        if (!value) {
          error = 'Account number is required';
        } else if (!value.match(/^\d{9,18}$/)) {
          error = 'Account number must be 9-18 digits';
        }
        break;
        
      case 'ifscCode':
        if (!value) {
          error = 'IFSC code is required';
        } else if (!value.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) {
          error = 'IFSC code must be in ABCD0123456 format';
        }
        break;
        
      case 'accountHolder':
        if (!value.trim()) {
          error = 'Account holder name is required';
        } else if (value.length < 2) {
          error = 'Account holder name must be at least 2 characters';
        }
        break;
        
      case 'bankName':
        if (!value.trim()) {
          error = 'Bank name is required';
        }
        break;
        
      case 'nomineeName':
        if (!value.trim()) {
          error = 'Nominee name is required';
        } else if (value.length < 2) {
          error = 'Nominee name must be at least 2 characters';
        }
        break;
        
      case 'nomineeRelation':
        if (!value.trim()) {
          error = 'Nominee relation is required';
        }
        break;
        
      case 'fullAddress':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.length < 10) {
          error = 'Address must be at least 10 characters';
        }
        break;
        
      case 'panImage':
        if (!isEdit && !value) {
          error = 'PAN image is required';
        } else if (value && !value.type.startsWith('image/')) {
          error = 'Please upload an image file';
        }
        break;
        
      case 'aadharImage':
        if (!isEdit && !value) {
          error = 'Aadhaar front image is required';
        } else if (value && !value.type.startsWith('image/')) {
          error = 'Please upload an image file';
        }
        break;
        
      case 'aadharBackImage':
        if (!isEdit && !value) {
          error = 'Aadhaar back image is required';
        } else if (value && !value.type.startsWith('image/')) {
          error = 'Please upload an image file';
        }
        break;
        
      case 'chequeBookImage':
        if (!isEdit && !value) {
          error = 'Cheque book image is required';
        } else if (value && !value.type.startsWith('image/')) {
          error = 'Please upload an image file';
        }
        break;
        
      default:
        break;
    }
    
    setErrors({ ...errors, [fieldName]: error });
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });
    
    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEdit) {
        await mockApi.updateKYC(editData.id, formData);
        alert("KYC updated successfully!");
      } else {
        await mockApi.submitKYC(formData);
        alert("KYC submitted successfully!");
      }
      onSubmit(formData, isEdit ? editData.id : null);
      onClose();
    } catch (error) {
      alert(`Error ${isEdit ? 'updating' : 'submitting'} KYC: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-300 shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{isEdit ? 'Edit Vendor KYC' : 'Vendor KYC Submission'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Aadhaar Number *</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="XXXX XXXX XXXX"
                  className={`w-full p-2 border rounded ${touched.aadhaarNumber && errors.aadhaarNumber ? 'border-red-500' : ''}`}
                />
                {touched.aadhaarNumber && errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">PAN Number *</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ABCDE1234F"
                  className={`w-full p-2 border rounded ${touched.panNumber && errors.panNumber ? 'border-red-500' : ''}`}
                />
                {touched.panNumber && errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.accountNumber && errors.accountNumber ? 'border-red-500' : ''}`}
                />
                {touched.accountNumber && errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.accountHolder && errors.accountHolder ? 'border-red-500' : ''}`}
                />
                {touched.accountHolder && errors.accountHolder && <p className="text-red-500 text-xs mt-1">{errors.accountHolder}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.bankName && errors.bankName ? 'border-red-500' : ''}`}
                />
                {touched.bankName && errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ABCD0123456"
                  className={`w-full p-2 border rounded ${touched.ifscCode && errors.ifscCode ? 'border-red-500' : ''}`}
                />
                {touched.ifscCode && errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nominee Name *</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.nomineeName && errors.nomineeName ? 'border-red-500' : ''}`}
                />
                {touched.nomineeName && errors.nomineeName && <p className="text-red-500 text-xs mt-1">{errors.nomineeName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nominee Relation *</label>
                <input
                  type="text"
                  name="nomineeRelation"
                  value={formData.nomineeRelation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.nomineeRelation && errors.nomineeRelation ? 'border-red-500' : ''}`}
                />
                {touched.nomineeRelation && errors.nomineeRelation && <p className="text-red-500 text-xs mt-1">{errors.nomineeRelation}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Address *</label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  className={`w-full p-2 border rounded ${touched.fullAddress && errors.fullAddress ? 'border-red-500' : ''}`}
                />
                {touched.fullAddress && errors.fullAddress && <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">PAN Card Image *</label>
                <input
                  type="file"
                  name="panImage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.panImage && errors.panImage ? 'border-red-500' : ''}`}
                  accept="image/*"
                />
                {touched.panImage && errors.panImage && <p className="text-red-500 text-xs mt-1">{errors.panImage}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aadhaar Front Image *</label>
                <input
                  type="file"
                  name="aadharImage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.aadharImage && errors.aadharImage ? 'border-red-500' : ''}`}
                  accept="image/*"
                />
                {touched.aadharImage && errors.aadharImage && <p className="text-red-500 text-xs mt-1">{errors.aadharImage}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aadhaar Back Image *</label>
                <input
                  type="file"
                  name="aadharBackImage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.aadharBackImage && errors.aadharBackImage ? 'border-red-500' : ''}`}
                  accept="image/*"
                />
                {touched.aadharBackImage && errors.aadharBackImage && <p className="text-red-500 text-xs mt-1">{errors.aadharBackImage}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cheque Book Image *</label>
                <input
                  type="file"
                  name="chequeBookImage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded ${touched.chequeBookImage && errors.chequeBookImage ? 'border-red-500' : ''}`}
                  accept="image/*"
                />
                {touched.chequeBookImage && errors.chequeBookImage && <p className="text-red-500 text-xs mt-1">{errors.chequeBookImage}</p>}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : (isEdit ? 'Update KYC' : 'Submit KYC')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// KYC List Component
const VendorKYCList = () => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKYC, setEditingKYC] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchKYCList();
  }, []);

  const fetchKYCList = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getKYCList();
      setKycList(response.data);
    } catch (error) {
      alert('Error fetching KYC list: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await mockApi.approveKYC(id);
      alert('KYC approved successfully!');
      fetchKYCList();
    } catch (error) {
      alert('Error approving KYC: ' + error.message);
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await mockApi.rejectKYC(id, reason);
      alert('KYC rejected successfully!');
      setShowRejectModal(false);
      setRejectReason('');
      fetchKYCList();
    } catch (error) {
      alert('Error rejecting KYC: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this KYC?')) {
      try {
        await mockApi.deleteKYC(id);
        alert('KYC deleted successfully!');
        fetchKYCList();
      } catch (error) {
        alert('Error deleting KYC: ' + error.message);
      }
    }
  };

  const openEditForm = (kyc) => {
    setEditingKYC(kyc);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openNewForm = () => {
    setEditingKYC(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingKYC(null);
  };

  const handleFormSubmit = () => {
    fetchKYCList();
    closeForm();
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setRejectingId(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredKYCList = statusFilter === 'All' 
    ? kycList 
    : kycList.filter(kyc => kyc.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading KYC data...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor KYC Management</h1>
        <button
          onClick={openNewForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New KYC
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredKYCList.map((kyc) => (
              <tr key={kyc.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{kyc.username}</div>
                  <div className="text-sm text-gray-500">{kyc.aadhaarNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{kyc.panNumber}</div>
                  <div className="text-xs text-gray-500">
                    <a href={kyc.panImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View PAN
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{kyc.bankName}</div>
                  <div className="text-sm text-gray-500">{kyc.accountNumber}</div>
                  <div className="text-xs text-gray-500">{kyc.ifscCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(kyc.status)}`}>
                    {kyc.status}
                  </span>
                  {kyc.rejectionReason && (
                    <div className="text-xs text-red-500 mt-1">Reason: {kyc.rejectionReason}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Created: {new Date(kyc.createdDate).toLocaleDateString()}</div>
                  <div>Modified: {new Date(kyc.modifiedDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {kyc.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(kyc.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(kyc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openEditForm(kyc)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kyc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <VendorKYCForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          editData={editingKYC}
          isEdit={isEditMode}
        />
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reason for Rejection</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="3"
              placeholder="Please specify the reason for rejection..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId, rejectReason)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default VendorKYCList;