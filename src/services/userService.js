// src/services/userService.js
import ApiService from "@/utils/network";
import API_PATHS from "../utils/Apipaths";

// 1. Fetch all users
export const fetchUsers = async () => {
  const res = await ApiService.get(API_PATHS.GET_USERS);
  return res?.data || [];
};

// 2. Update user status
export const updateUserStatus = async (userId, newStatus) => {
  return await ApiService.put(API_PATHS.UPDATE_USER_STATUS(userId), { status: newStatus });
};

// 3. Credit income to a user
export const creditUserIncome = async (userId, amount) => {
  return await ApiService.post(API_PATHS.CREDIT_USER_INCOME(userId), { amount });
};
