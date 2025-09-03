// src/services/userService.js

import { apiRequest } from '../api/client';
import API_PATHS from '../utils/Apipaths';

export const fetchUsers = async () => {
  const res = await apiRequest.get(API_PATHS.GET_USERS);
  return res?.data || [];
};

export const updateUserStatus = async (userId, newStatus) => {
  const res = await apiRequest.put(
    API_PATHS.UPDATE_USER_STATUS(userId),
    { status: newStatus }
  );
  return res;
};

export const creditUserIncome = async (userId, amount) => {
  const res = await apiRequest.post(
    API_PATHS.CREDIT_USER_INCOME(userId),
    { amount }
  );
  return res;
};
