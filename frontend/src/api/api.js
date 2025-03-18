import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/", // URL backend
  withCredentials: true, // Esto permite enviar y recibir cookies automáticamente
});

export default API;