import React, { useState, useEffect } from 'react';

// Mock API service
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

// Vendor KYC Form Component
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
  }, [isEdit, editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.aadhaarNumber.match(/^\d{4}\s\d{4}\s\d{4}$/)) {
      newErrors.aadhaarNumber = 'Aadhaar must be in XXXX XXXX XXXX format';
    }
    
    if (!formData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      newErrors.panNumber = 'PAN must be in ABCDE1234F format';
    }
    
    if (!formData.accountNumber.match(/^\d{9,18}$/)) {
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    }
    
    if (!formData.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) {
      newErrors.ifscCode = 'IFSC code must be in ABCD0123456 format';
    }
    
    if (!isEdit) {
      if (!formData.panImage) newErrors.panImage = 'PAN image is required';
      if (!formData.aadharImage) newErrors.aadharImage = 'Aadhaar front image is required';
      if (!formData.aadharBackImage) newErrors.aadharBackImage = 'Aadhaar back image is required';
      if (!formData.chequeBookImage) newErrors.chequeBookImage = 'Cheque book image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
                <label className="block text-sm font-medium mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full p-2 border rounded"
                />
                {errors.aadhaarNumber && <p className="text-red-500 text-xs">{errors.aadhaarNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  className="w-full p-2 border rounded"
                />
                {errors.panNumber && <p className="text-red-500 text-xs">{errors.panNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bank Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.accountNumber && <p className="text-red-500 text-xs">{errors.accountNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="ABCD0123456"
                  className="w-full p-2 border rounded"
                />
                {errors.ifscCode && <p className="text-red-500 text-xs">{errors.ifscCode}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nominee Name</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nominee Relation</label>
                <input
                  type="text"
                  name="nomineeRelation"
                  value={formData.nomineeRelation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Full Address</label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">PAN Card Image {!isEdit && '*'}</label>
                <input
                  type="file"
                  name="panImage"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                {errors.panImage && <p className="text-red-500 text-xs">{errors.panImage}</p>}
                {isEdit && editData?.panImage && (
                  <img src={editData.panImage} alt="Current PAN" className="w-16 h-10 object-cover rounded mt-2" />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aadhaar Front Image {!isEdit && '*'}</label>
                <input
                  type="file"
                  name="aadharImage"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                {errors.aadharImage && <p className="text-red-500 text-xs">{errors.aadharImage}</p>}
                {isEdit && editData?.aadhaarImage && (
                  <img src={editData.aadhaarImage} alt="Current Aadhaar" className="w-16 h-10 object-cover rounded mt-2" />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aadhaar Back Image {!isEdit && '*'}</label>
                <input
                  type="file"
                  name="aadharBackImage"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                {errors.aadharBackImage && <p className="text-red-500 text-xs">{errors.aadharBackImage}</p>}
                {isEdit && editData?.aadhaarBackImage && (
                  <img src={editData.aadhaarBackImage} alt="Current Aadhaar Back" className="w-16 h-10 object-cover rounded mt-2" />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cheque Book Image {!isEdit && '*'}</label>
                <input
                  type="file"
                  name="chequeBookImage"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                {errors.chequeBookImage && <p className="text-red-500 text-xs">{errors.chequeBookImage}</p>}
                {isEdit && editData?.checkbookImage && (
                  <img src={editData.checkbookImage} alt="Current Checkbook" className="w-16 h-10 object-cover rounded mt-2" />
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
              >
                {isSubmitting ? (isEdit ? 'Updating...' : 'Submitting...') : (isEdit ? 'Update KYC' : 'Submit KYC')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Status Change Dialog Component
const StatusChangeDialog = ({ isOpen, onClose, onStatusChange, currentStatus, vendorId }) => {
  const [status, setStatus] = useState(currentStatus);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    setStatus(currentStatus);
    setRejectionReason('');
  }, [currentStatus, isOpen]);

  const handleSubmit = () => {
    onStatusChange(vendorId, status, status === 'Rejected' ? rejectionReason : '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 border-2 border-gray-300 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Change Status</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          {status === 'Rejected' && (
            <div>
              <label className="block text-sm font-medium mb-1">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="Enter reason for rejection"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendor KYC List Component
const VendorKYCList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getKYCList();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      alert("Failed to load data. Please try again later.");
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, status, rejectionReason = '') => {
    try {
      if (status === 'Approved') {
        await mockApi.approveKYC(id);
      } else if (status === 'Rejected') {
        await mockApi.rejectKYC(id, rejectionReason);
      }
      
      setData(data.map(item => 
        item.id === id ? {...item, status, rejectionReason} : item
      ));
      alert(`Status updated to ${status} successfully!`);
    } catch (err) {
      console.error("Status change failed:", err);
      alert("Failed to update status. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this KYC record?")) return;
    
    try {
      await mockApi.deleteKYC(id);
      setData(data.filter(item => item.id !== id));
      alert("KYC deleted successfully!");
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("Failed to delete. Try again.");
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Username", "PAN Number", "Aadhaar Number", "Bank Name", "IFSC Code", "Account Number",
      "Nominee Name", "Nominee Relation", "Address", "Created Date", "Modified Date", "Status", "Rejection Reason"
    ];

    const rows = filteredData.map(item => [
      item.username,
      item.panNumber,
      item.aadhaarNumber,
      item.bankName,
      item.ifscCode,
      item.accountNumber,
      item.nomineeName,
      item.nomineeRelation,
      item.address,
      item.createdDate,
      item.modifiedDate,
      item.status,
      item.rejectionReason || "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "kyc_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (newKYC, id = null) => {
    if (id) {
      // Update existing record
      setData(data.map(item => 
        item.id === id ? {
          ...item,
          panNumber: newKYC.panNumber,
          aadhaarNumber: newKYC.aadhaarNumber,
          bankName: newKYC.bankName,
          ifscCode: newKYC.ifscCode,
          accountNumber: newKYC.accountNumber,
          accountHolder: newKYC.accountHolder,
          nomineeName: newKYC.nomineeName,
          nomineeRelation: newKYC.nomineeRelation,
          address: newKYC.fullAddress,
          modifiedDate: new Date().toISOString().split('T')[0]
        } : item
      ));
    } else {
      // Add new record
      const newEntry = {
        id: data.length + 1,
        username: "new_vendor",
        panNumber: newKYC.panNumber,
        aadhaarNumber: newKYC.aadhaarNumber,
        bankName: newKYC.bankName,
        ifscCode: newKYC.ifscCode,
        accountNumber: newKYC.accountNumber,
        accountHolder: newKYC.accountHolder,
        nomineeName: newKYC.nomineeName,
        nomineeRelation: newKYC.nomineeRelation,
        address: newKYC.fullAddress,
        panImage: "https://via.placeholder.com/100x60?text=New+PAN",
        aadhaarImage: "https://via.placeholder.com/100x60?text=New+Aadhaar",
        aadhaarBackImage: "https://via.placeholder.com/100x60?text=New+Aadhaar+Back",
        checkbookImage: "https://via.placeholder.com/100x60?text=New+Checkbook",
        createdDate: new Date().toISOString().split('T')[0],
        modifiedDate: new Date().toISOString().split('T')[0],
        status: "Pending",
        rejectionReason: ""
      };
      
      setData([...data, newEntry]);
    }
  };

  const openEditForm = (vendor) => {
    setCurrentVendor(vendor);
    setIsEdit(true);
    setShowForm(true);
  };

  const openStatusDialog = (vendor) => {
    setCurrentVendor(vendor);
    setShowStatusDialog(true);
  };

  const openNewForm = () => {
    setCurrentVendor(null);
    setIsEdit(false);
    setShowForm(true);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vendor KYC Management</h2>
        <button
          onClick={openNewForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add New KYC
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-48"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Download CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading KYC data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Sl No.", "Username", "PAN Number", "Aadhaar Number", "Bank Name", "IFSC Code", "Account Number",
                  "Nominee Name", "Nominee Relation", "Address", "PAN Image", "Aadhaar Image", "Aadhaar Back", "Checkbook",
                  "Created Date", "Modified Date", "Status", "Actions", "Rejection Reason"
                ].map((title, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((vendor, index) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{vendor.username}</td>
                  <td className="px-4 py-3 text-sm">{vendor.panNumber}</td>
                  <td className="px-4 py-3 text-sm">{vendor.aadhaarNumber}</td>
                  <td className="px-4 py-3 text-sm">{vendor.bankName}</td>
                  <td className="px-4 py-3 text-sm">{vendor.ifscCode}</td>
                  <td className="px-4 py-3 text-sm">{vendor.accountNumber}</td>
                  <td className="px-4 py-3 text-sm">{vendor.nomineeName}</td>
                  <td className="px-4 py-3 text-sm">{vendor.nomineeRelation}</td>
                  <td className="px-4 py-3 text-sm max-w-xs">{vendor.address}</td>
                  <td className="px-4 py-3 text-sm">
                    <img src={vendor.panImage} alt="PAN" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <img src={vendor.aadhaarImage} alt="Aadhaar" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <img src={vendor.aadhaarBackImage} alt="Back" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <img src={vendor.checkbookImage} alt="Checkbook" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm">{vendor.createdDate}</td>
                  <td className="px-4 py-3 text-sm">{vendor.modifiedDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      vendor.status === "Approved" ? "bg-green-100 text-green-800" :
                      vendor.status === "Rejected" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => openEditForm(vendor)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openStatusDialog(vendor)}
                        className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{vendor.rejectionReason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No KYC records found
            </div>
          )}
        </div>
      )}
      
      <VendorKYCForm 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onSubmit={handleFormSubmit}
        editData={currentVendor}
        isEdit={isEdit}
      />
      
      <StatusChangeDialog 
        isOpen={showStatusDialog} 
        onClose={() => setShowStatusDialog(false)} 
        onStatusChange={handleStatusChange}
        currentStatus={currentVendor?.status || 'Pending'}
        vendorId={currentVendor?.id}
      />
    </div>
  );
};

// Main App Component - This is the default export
const VendorKYCPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <VendorKYCList />
      </main>
    </div>
  );
};

export default VendorKYCPage;