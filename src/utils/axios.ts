import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLWFwaSIsInN1YiI6InRlc3RlMkBlbWFpbC5jb20iLCJyb2xlIjoiUEVEQUdPR0lDTyIsImV4cCI6MTc2MzQxNzAzOH0.chlidV-4atwZ02iRhy9BEo1QgQs28a7PC68rqB6eEaI";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default api;