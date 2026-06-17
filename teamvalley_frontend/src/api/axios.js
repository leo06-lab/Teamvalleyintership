import axios from "axios";


// Krijojme nje instance te axios me baseURL dhe konfigurime te tjera
const api = axios.create({
	baseURL: "http://localhost:5000/api",
});

// Shtojme nje interceptor per te shtuar tokenin ne headers te çdo request
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("jobvalleyToken");

	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default api;
