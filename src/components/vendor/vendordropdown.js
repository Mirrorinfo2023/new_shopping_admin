'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const VendorDropdown = ({ value, onChange }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}vendors/getall`);
        if (res.data.success) {
          setVendors(res.data.vendors);
        }
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading) return <p>Loading vendors...</p>;

  return (
<div className="flex flex-col">
  <Label>Vendor</Label>
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full bg-white">
      <SelectValue placeholder="Select a Vendor" />
    </SelectTrigger>
    <SelectContent className="bg-white">
      {vendors.map((vendor) => (
        <SelectItem key={vendor._id} value={vendor._id}>
          {vendor.vendorName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

  );
};

export default VendorDropdown;
