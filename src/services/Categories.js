// src/services/categoryService.js
import ApiService from "@/utils/network";
import API_PATHS from "../utils/Apipaths";

// Get all categories
export const getAllCategories = async () => {
  const res = await ApiService.get(API_PATHS.GET_ALL_CATEGORIES);
  return res;
};

// Create a new category
export const createCategory = async (payload) => {
  const res = await ApiService.post(API_PATHS.CREATE_CATEGORY, payload);
  return res;
};

// Delete a category by ID
export const deleteCategoryById = async (id) => {
  const endpoint = API_PATHS.DELETE_CATEGORY_BY_ID(id);
  const res = await ApiService.delete(endpoint);
  return res;
};
