import { Http } from '@capacitor/http';
import { BASE_URL } from './constants';

const addAuthHeader = (headers) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    return { ...headers, Authorization: `Bearer ${accessToken}` };
  }
  return headers;
};

const httpRequest = async (method, endpoint, data = null) => {
  try {
    const response = await Http.request({
      method: method.toUpperCase(),
      url: `${BASE_URL}${endpoint}`,
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
      data: data ? JSON.stringify(data) : undefined,
      timeout: 10000 // timeout w milisekundach
    });

    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    // Obsługa błędów w stylu Axiosa
    throw {
      response: {
        status: error.status || 500,
        data: error.message || 'Unknown error'
      }
    };
  }
};

// Tworzymy interfejs podobny do Axiosa
export default api={
  get: (endpoint) => httpRequest('GET', endpoint),
  post: (endpoint, data) => httpRequest('POST', endpoint, data),
  put: (endpoint, data) => httpRequest('PUT', endpoint, data),
  delete: (endpoint) => httpRequest('DELETE', endpoint)
};