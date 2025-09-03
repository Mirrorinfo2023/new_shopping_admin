// src/services/brandService.js

import { apiRequest } from '../api/client';
import API_PATHS from '../utils/Apipaths';

export const getAllBrands = () =>
  apiRequest.get(API_PATHS.GET_ALL_BRANDS);

export const createBrand = (payload) =>
  apiRequest.post(API_PATHS.CREATE_BRAND, payload);

export const deleteBrandById = (id) =>
  apiRequest.delete(API_PATHS.DELETE_BRAND_BY_ID(id));
    