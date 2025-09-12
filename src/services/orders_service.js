// src/services/orders_service.js
import ApiService from "@/utils/network";
import API_PATHS from "../utils/Apipaths";

// 1. Create Order
export const createOrder = async (payload) => {
  return await ApiService.post(API_PATHS.ORDER_CREATE, payload);
};

// 2. Get All Orders (with optional filters)
export const getAllOrders = async ({ startDate, endDate, status } = {}) => {
  const queryParams = [];
  if (startDate) queryParams.push(`startDate=${startDate}`);
  if (endDate) queryParams.push(`endDate=${endDate}`);
  if (status) queryParams.push(`status=${status}`);

  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
  const endpoint = `${API_PATHS.ORDER_LIST}${queryString}`;

  return await ApiService.get(endpoint);
};

// 3. Get Order by ID
export const getOrderById = async (orderId) => {
  return await ApiService.get(API_PATHS.ORDER_DETAILS(orderId));
};

// 4. Update Order Status
export const updateOrderStatus = async (orderId, newStatus) => {
  return await ApiService.put(API_PATHS.ORDER_UPDATE_STATUS(orderId), {
    status: newStatus,
  });
};

// 5. Cancel Order
export const cancelOrder = async (orderId) => {
  return await ApiService.put(API_PATHS.ORDER_CANCEL(orderId));
};

// 6. Return Order
export const returnOrder = async (orderId) => {
  return await ApiService.put(API_PATHS.ORDER_RETURN(orderId));
};

// 7. Delete Order
export const deleteOrder = async (id) => {
  return await ApiService.delete(API_PATHS.ORDER_DELETE(id));
};

// 8. Get Order Filter (startDate, endDate, status)
export const getOrderFilter = async ({ startDate, endDate, status }) => {
  const queryParams = [];
  if (startDate) queryParams.push(`startDate=${startDate}`);
  if (endDate) queryParams.push(`endDate=${endDate}`);
  if (status) queryParams.push(`status=${status}`);

  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
  const endpoint = `${API_PATHS.ORDER_LIST}${queryString}`;

  return await ApiService.get(endpoint);
};
export default { 
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  deleteOrder,
  getOrderFilter,
};
