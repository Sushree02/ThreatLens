import axios from 'axios';

// All API calls go through the backend. No API keys are ever
// present in the frontend code.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

function extractErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.';
  }
  return 'Unable to reach the server. Please make sure the backend is running.';
}

export async function analyzeUrl(url) {
  try {
    const response = await apiClient.post('/analyze-url', { url });
    return response.data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function analyzeIp(ip) {
  try {
    const response = await apiClient.post('/analyze-ip', { ip });
    return response.data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function analyzeFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/analyze-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
    return response.data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function checkHealth() {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
