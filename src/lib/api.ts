import axios, { AxiosInstance } from "axios";

const APP_URL: string = process.env.APP_URL || "";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: APP_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;