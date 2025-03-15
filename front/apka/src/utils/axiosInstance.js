import axios from 'axios';
import { BASE_URL } from './constants';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor/http';

// Sprawdzenie czy aplikacja działa na urządzeniu mobilnym z Capacitorem
const isNativePlatform = Capacitor.isNativePlatform();
const isAndroid = Capacitor.getPlatform() === 'android';

// Konfiguracja dla Axios (używana w środowisku webowym)
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Funkcja wykonująca żądanie HTTP przy użyciu Capacitor HTTP
const capacitorHttpRequest = async (method, endpoint, data = null, customHeaders = {}) => {
    const token = localStorage.getItem("token") || null;
    
    const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...customHeaders
    };

    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await Http.request({
            method,
            url,
            headers,
            data: data ? JSON.stringify(data) : undefined
        });

        // Mapowanie odpowiedzi do formatu podobnego do axios
        return {
            data: response.data,
            status: response.status,
            headers: response.headers
        };
    } catch (error) {
        // Tworzenie obiektu błędu podobnego do axios
        const errorResponse = {
            response: {
                data: error.data || {},
                status: error.status || 500,
                headers: error.headers || {}
            },
            message: error.message || 'Wystąpił błąd podczas wykonywania żądania'
        };
        
        throw errorResponse;
    }
};

// Uniwersalny klient HTTP, który wybiera odpowiednią metodę
const httpClient = {
    get: async (endpoint, config = {}) => {
        if (isNativePlatform && isAndroid) {
            return capacitorHttpRequest('GET', endpoint, null, config.headers);
        }
        return axiosInstance.get(endpoint, config);
    },
    post: async (endpoint, data, config = {}) => {
        if (isNativePlatform && isAndroid) {
            return capacitorHttpRequest('POST', endpoint, data, config.headers);
        }
        return axiosInstance.post(endpoint, data, config);
    },
    put: async (endpoint, data, config = {}) => {
        if (isNativePlatform && isAndroid) {
            return capacitorHttpRequest('PUT', endpoint, data, config.headers);
        }
        return axiosInstance.put(endpoint, data, config);
    },
    delete: async (endpoint, config = {}) => {
        if (isNativePlatform && isAndroid) {
            return capacitorHttpRequest('DELETE', endpoint, null, config.headers);
        }
        return axiosInstance.delete(endpoint, config);
    }
};

export default httpClient;