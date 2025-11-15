import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLWFwaSIsInN1YiI6Imp1Y2llbmVAZW1haWwuY29tIiwicm9sZSI6IlBFREFHT0dJQ08iLCJleHAiOjE3NjMxNzczODN9.8xYpEQnBBlrf4sIfbk4kLonTFW2uWCOGzgg5ywpAXpk";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default api;