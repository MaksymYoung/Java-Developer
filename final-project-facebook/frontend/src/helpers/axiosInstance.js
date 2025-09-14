import axios from "axios";
const baseURL = import.meta.env.VITE_HEAD_URL;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HEAD_URL, // базовий URL нашої API
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken"); // Отримання токена з localStorage

    if (token && token.trim()) {
      // Перевірка, що токен існує і не є пустою строкою
      config.headers["Authorization"] = `Bearer ${token}`; // Додавання (оновленого) токена до заголовків
    }

    // // Логування URL запиту, метод, та заголовки
    // console.log("Request baseURL:", config.baseURL);
    // console.log("Request URL:", config.url);
    // console.log("Request Method:", config.method);
    // console.log("Request Headers:", config.headers);

    return config;
  },
  (error) => {
    // console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const isTokenError = [401, 403].includes(error.response?.status);        

        if (isTokenError && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
              
                if (!refreshToken || refreshToken.trim() === "") {
                    window.location.href = "/login";
                    throw new Error("Refresh token is missing or invalid");
                }
 
                const response = await axios.post(`${baseURL}/api/v1/jwt/refresh`, { refreshToken: refreshToken }); 
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);

                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;

                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }    
);

export default axiosInstance;
