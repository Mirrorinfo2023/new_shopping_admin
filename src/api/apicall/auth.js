import { apiRequest } from "../client";
import { ENDPOINTS } from "../config";

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
};

export const login = async (credentials) => {
  try {
    const response = await apiRequest.post(ENDPOINTS.AUTH.LOGIN, credentials);
    const verifyResponse = response.data;

    if (verifyResponse.responseCode === 1) {
      const token = verifyResponse.response.token;
      setAuthToken(token);

      return {
        success: true,
        token,
        data: {
          response: {
            user: {
              email: credentials.email,
              role: "admin",
            },
          },
        },
      };
    } else {
      return {
        success: false,
        message: "Token verification failed",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
    };
  }
};

export const logout = async () => {
  try {
    const token = getAuthToken();
    if (token) {
      await apiRequest.post(ENDPOINTS.AUTH.LOGOUT, { token });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuthData();
  }
};

export const checkToken = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { valid: false };
    }

    const response = await apiRequest.post(ENDPOINTS.AUTH.VERIFY, { token });
    const verifyResponse = response.data;

    if (verifyResponse.responseCode === 1) {
      return {
        valid: verifyResponse.response.isValid,
      };
    } else {
      clearAuthData();
      return {
        valid: false,
      };
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      success: false,
      message: "Invalid token",
    };
  }
};

export const updateUserData = (userData) => {
  sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};
