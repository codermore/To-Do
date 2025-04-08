import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL, // URL backend
  withCredentials: true, // Esto permite enviar y recibir cookies automáticamente
});

export default API;