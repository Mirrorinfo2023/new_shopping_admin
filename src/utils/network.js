import axios from "axios";

const apiClient = axios.create({
  baseURL:"https://secure1.mirrorhub.in/api/", //"https://secure.aladin25.live/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

const ApiService = {
  _handleResponse: (response) => {
    if (response.status >= 200 && response.status < 300) {
      return {
        status: true,
        data: response.data,
      };
    } else {
      return {
        status: false,
        message: response.statusText || "Something went wrong",
      };
    }
  },

  _handleError: (error) => {
    return {
      status: false,
      message:
        error.response?.data?.message || error.message || "Something went wrong",
    };
  },

  // GET
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return ApiService._handleResponse(response);
    } catch (error) {
      return ApiService._handleError(error);
    }
  },

  // POST
  post: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return ApiService._handleResponse(response);
    } catch (error) {
      return ApiService._handleError(error);
    }
  },

  // PUT
  put: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return ApiService._handleResponse(response);
    } catch (error) {
      return ApiService._handleError(error);
    }
  },

  // PATCH
  patch: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data);
      return ApiService._handleResponse(response);
    } catch (error) {
      return ApiService._handleError(error);
    }
  },

  // DELETE
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return ApiService._handleResponse(response);
    } catch (error) {
      return ApiService._handleError(error);
    }
  },
};

export default ApiService;
export { apiClient };
