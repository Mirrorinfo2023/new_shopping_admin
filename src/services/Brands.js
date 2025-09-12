// src/services/brandService.js
import API_PATHS from "../utils/Apipaths";
import ApiService from "@/utils/network";

// Get all brands
export const getAllBrands = async () => {
  const res = await ApiService.get(API_PATHS.GET_ALL_BRANDS);
  return res;
};

// Create a new brand
export const createBrand = async (payload) => {
  const res = await ApiService.post(API_PATHS.CREATE_BRAND, payload);
  return res;
};

// Delete a brand by ID
export const deleteBrandById = async (id) => {
  const endpoint = API_PATHS.DELETE_BRAND_BY_ID(id);
  const res = await ApiService.delete(endpoint);
  return res;
};
