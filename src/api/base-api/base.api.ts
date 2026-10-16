import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  // baseURL: "https://api.neutrinobyte.com/api/v1",
  // baseURL: "http://192.168.7.210:5000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  },
);

export default api;
