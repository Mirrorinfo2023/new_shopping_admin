import axios from 'axios';

const API_BASE = '/api/vendors';


export const fetchVendorByIdService = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data; 
  } catch (err) {
    console.error('Failed to fetch vendor:', err);
    throw err;
  }
};


export const updateVendorService = async (id, updatedData) => {
  try {
    const res = await axios.post(`${API_BASE}/update/${id}`, updatedData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data; 
  } catch (err) {
    console.error('Failed to update vendor:', err);
    throw err;
  }
};

export const fetchVendorsService = async () => {
  try {
    const res = await axios.get(`${API_BASE}`);
    return res.data.vendors || [];
  } catch (err) {
    console.error('Failed to fetch vendors:', err);
    throw err;
  }
};


export const deleteVendorService = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE}/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error('Failed to delete vendor:', err);
    throw err;
  }
};
