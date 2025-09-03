// src/services/subcategoryService.js

import { apiRequest } from '../api/client';
import API_PATHS from '../utils/Apipaths';

export const getAllSubcategories = () =>
  apiRequest.get(API_PATHS.GET_ALL_SUBCATEGORIES);

export const createSubcategory = (payload) =>
  apiRequest.post(API_PATHS.CREATE_SUBCATEGORY, payload);

export const deleteSubcategoryById = (id) =>
  apiRequest.delete(API_PATHS.DELETE_SUBCATEGORY_BY_ID(id));
