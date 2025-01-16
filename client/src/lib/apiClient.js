import axios from "axios";
import { HOST } from "@/utils/constants";

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

export default apiClient;
