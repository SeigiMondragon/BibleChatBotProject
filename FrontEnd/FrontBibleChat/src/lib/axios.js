import axios from "axios";

const ax = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
  headers: {
    ContentType: "application/json",
  },
});

export default ax;
