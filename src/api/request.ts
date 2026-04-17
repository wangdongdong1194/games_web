import axios from "axios";

function getBaseUrl() {
  // 运行时优先读取 window.ENV
  if (typeof window !== 'undefined' && (window as any).ENV && (window as any).ENV.VITE_API_BASE_URL) {
    return (window as any).ENV.VITE_API_BASE_URL;
  }
  // 构建时读取 Vite 变量
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
}

export class Request {
    private _request;

    constructor() {
        this._request = axios.create({
            baseURL: getBaseUrl(),
            timeout: 5000,
        });
        // 添加响应拦截器
        this._request.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                console.error("API 请求错误:", error);
                return Promise.reject(error);
            }
        );
        // 可以在这里添加请求拦截器，例如添加认证 token
        this._request.interceptors.request.use(
            (config) => {
                // 可以在这里添加全局请求头，例如认证 token
                // config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            },
            (error) => {
                console.error("API 请求配置错误:", error);
                return Promise.reject(error);
            }
        );
    }
    get request() {
        return this._request;
    }
}

export const apiRequest = new Request().request;