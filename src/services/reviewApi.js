// src/services/reviewService.js
import ApiService from "@/utils/network";
import API_PATHS from "../utils/Apipaths";

// 1. Create a review
export const createReview = async (payload) => {
  return await ApiService.post(API_PATHS.REVIEW_CREATE, payload);
};

// 2. Get all reviews
export const getAllReviews = async () => {
  return await ApiService.get(API_PATHS.REVIEW_GET_ALL);
};

// 3. Get reviews for a specific product
export const getProductReviews = async (productId) => {
  return await ApiService.get(API_PATHS.REVIEW_GET_BY_PRODUCT_ID(productId));
};

// 4. Get a single review by review ID
export const getReviewById = async (reviewId) => {
  return await ApiService.get(API_PATHS.REVIEW_GET_BY_ID(reviewId));
};

// 5. Update a review by ID
export const updateReviewById = async (reviewId, updatedData) => {
  return await ApiService.put(API_PATHS.REVIEW_UPDATE_BY_ID(reviewId), updatedData);
};
