import axios from "axios";
console.log("Your API URL is:", import.meta.env.VITE_BASE_URL);
const ax = axios.create({
  // Vite injects environment variables onto import.meta.env
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // Added the missing hyphen
    Accept: "application/json", // Highly recommended for Laravel APIs
  },
});

export default ax;
