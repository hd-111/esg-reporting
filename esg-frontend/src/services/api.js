import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: "admin",
    password: "Admin@123",
  },
});

export default api;