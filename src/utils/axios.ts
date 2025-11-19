import { verifySession } from "@/app/actions/session";
import axios from "axios";

const user = await verifySession();

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Authorization": `Bearer ${user.token}`,
    "Content-Type": "application/json",
  },
});

export default api;