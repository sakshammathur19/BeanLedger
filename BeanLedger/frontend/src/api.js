import axios from "axios";

const api = axios.create({
  baseURL: "https://psychic-engine-wrgj4pg7gxxw3g6rv-8000.app.github.dev",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;