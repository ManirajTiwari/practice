import axios from "axios";

// Create an Axios instance pointing to Express server
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Crucial for sending/receiving HTTP-Only Cookies
});

export const authService = {
  signUp: async (formData: Record<string, any>) => {
    const response = await api.post("/signup", formData);
    return response.data;
  },

  login: async (formData: Record<string, any>) => {
    const response = await api.post("/login", formData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/me");
    return response.data;
  },

  updateProfile: async (data: Record<string, any>) => {
    const response = await api.put("/profile", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },
};