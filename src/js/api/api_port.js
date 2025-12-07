// src/js/api/api_port.js
import axios from "axios";

// Cria uma instância do Axios com base URL padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", // 🔗 coloque aqui o endereço base do backend
});

export default api;
