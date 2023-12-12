import axios from "axios";
const token = localStorage.getItem("token")

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
