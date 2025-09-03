// src/services/categoryService.js

import { apiRequest } from '../api/client';
import API_PATHS from '../utils/Apipaths';

export const getAllCategories = () =>
  apiRequest.get(API_PATHS.GET_ALL_CATEGORIES);

export const createCategory = (payload) =>
  apiRequest.post(API_PATHS.CREATE_CATEGORY, payload);

export const deleteCategoryById = (id) =>
  apiRequest.delete(API_PATHS.DELETE_CATEGORY_BY_ID(id));
