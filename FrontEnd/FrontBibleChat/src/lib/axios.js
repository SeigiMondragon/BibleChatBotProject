import axios from "axios";
import { env } from "process";

const ax = axios.create({
  baseURL: env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    ContentType: "application/json",
  },
});

export default ax;
