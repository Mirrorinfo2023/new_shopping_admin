import axios from 'axios';

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Fetch all products (basic)
export const fetchProductsService = async () => {
    try {
        const res = await fetch(`${BASE_URL}products/basic`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        return data.products || [];
    } catch (err) {
        console.error('Error fetching products:', err);
        throw err;
    }
};

// Delete a product by ID
export const deleteProductService = async (productId) => {
    try {
        const res = await axios.post(`${BASE_URL}products/delete/${productId}`);
        return res.data;
    } catch (err) {
        console.error('Error deleting product:', err);
        throw err;
    }
};

export const fetchProductByIdService = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}product/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data;
    } catch (err) {
        console.error('Error fetching product:', err);
        throw err;
    }
};



export const createProductService = async (productData) => {
  try {
    const res = await axios.post(`${BASE_URL}products/create`, productData);
    return res.data;
  } catch (err) {
    console.error('Error creating product:', err.response?.data || err.message);
    throw err;
  }
};


export const updateProductService = async (productId, updatedData) => {
  try {
    const res = await axios.post(`${BASE_URL}products/${productId}`, updatedData);
    return res.data;
  } catch (err) {
    console.error('Error updating product:', err.response?.data || err.message);
    throw err;
  }
};

// Filter products by category or status
export const filterProductsService = async (filters) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}products/filter?${query}`);
    if (!res.ok) throw new Error('Failed to filter products');
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error('Error filtering products:', err);
    throw err;
  }
};

export const updateProductStatusService = async (productIds, status) => {
  try {
    const payload = {
      productIds: Array.isArray(productIds) ? productIds : [productIds],
      status,
    };

    const res = await ApiService.post(`${BASE_URL}products/update-status`, payload);
    return res; // will return { status: true, data: ... } from ApiService
  } catch (error) {
    console.error("Update status error:", error);
    return { status: false, message: error.message };
  }
};
