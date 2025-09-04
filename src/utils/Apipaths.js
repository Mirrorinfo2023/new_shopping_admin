// const BASE_URL = 'http://localhost:3001/';

// const BASE_URL = 'https://secure.aladin25.live/';
export const API_PATHS = {
  CREATE_CATEGORY: `/catagory/createcategories`,
  GET_ALL_CATEGORIES: `/catagory/getallcategories`,
  GET_CATEGORY_BY_ID: (id) => `/catagory/getcategories/${id}`,
  DELETE_CATEGORY_BY_ID: (id) => `/catagory/deletecategories/${id}`,

  ORDER_LIST: `/orders/list`,
  GET_ORDERS: `/orders/list`,
  ORDER_CREATE: `/orders/create`,
  ORDER_DETAILS: (id) => `/orders/details/${id}`,
  ORDER_UPDATE_STATUS: (status) => `/orders/update-status/${status}`,
  ORDER_CANCEL: (id) => `/orders/cancel/${id}`,
  ORDER_RETURN: (id) => `/orders/return/${id}`,
  ORDER_DELETE: (id) => `/orders/delete/${id}`,
  ORDER_FILTER: `/orders/filter`,

  PRODUCT_LIST: `/products`,
  PRODUCT_BASIC: `/products/basic`,
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_DETAILS: `/products/details`,
  PRODUCT_WITH_REVIEWS: (id) => `/products/withreviews/${id}`,
  PRODUCT_POST_REVIEWS: `/reviews/create`,
  PRODUCT_CREATE: `/products/create`,
  PRODUCT_UPDATE_REVIEWS: (id) => `/reviews/updatereview/${id}`,

  REVIEW_CREATE: `/reviews/create`,
  REVIEW_GET_ALL: `/reviews/getallreviews`,
  REVIEW_CREATE: `/review/create`,
  // REVIEW_GET_ALL: `review/getallreviews`,
  REVIEW_GET_BY_PRODUCT_ID: (productId) => `/review/getproductreview/${productId}`,
  REVIEW_GET_BY_ID: (reviewId) => `/review/getreview/${reviewId}`,
  REVIEW_UPDATE_BY_ID: (reviewId) => `/review/updatereview/${reviewId}`,

  VENDOR_REGISTER: `/vendors/create`,
  VENDOR_LOGIN: `/vendors/login`,
  GET_ALL_VENDORS: `/vendor/getall`,
  GET_VENDOR_BY_ID: (id) => `/vendor/get/${id}`,
  UPDATE_VENDOR: (id) => `/vendor/update/${id}`,
  DELETE_VENDOR: (id) => `/vendor/delete/${id}`,


  GET_ALL_USERS: '/api/users',
  UPDATE_USER_STATUS: (id) => `/api/users/${id}/status`,
  CREDIT_USER_INCOME: (id) => `/api/users/${id}/credit`,
  CREATE_SUBCATEGORY: '/subcategories',
  GET_ALL_SUBCATEGORIES: '/subcategories',
  GET_SUBCATEGORY_BY_ID: (id) => `/subcategories/${id}`,
  UPDATE_SUBCATEGORY_BY_ID: (id) => `/subcategories/${id}`,
  DELETE_SUBCATEGORY_BY_ID: (id) => `/subcategories/${id}`,

  CREATE_BRAND: '/brands',
  GET_ALL_BRANDS: '/brands',
  GET_BRAND_BY_ID: (id) => `/brands/${id}`,
  UPDATE_BRAND_BY_ID: (id) => `/brands/${id}`,
  DELETE_BRAND_BY_ID: (id) => `/brands/${id}`,
    GET_PRODUCTS: '/api/inhouse/products',
  ADD_PRODUCT: '/api/inhouse/products',
};

export default API_PATHS;
