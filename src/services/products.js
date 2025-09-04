import axios from 'axios';

// Fetch all products (basic)
export const fetchProductsService = async () => {
    try {
        const res = await fetch('/api/products/basic');
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
        const res = await axios.post(`/api/products/delete/${productId}`);
        return res.data;
    } catch (err) {
        console.error('Error deleting product:', err);
        throw err;
    }
};

export const fetchProductByIdService = async (id) => {
    try {
        const res = await fetch(`/api/product/${id}`);
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
    const res = await axios.post('/api/products/create', productData);
    return res.data;
  } catch (err) {
    console.error('Error creating product:', err.response?.data || err.message);
    throw err;
  }
};