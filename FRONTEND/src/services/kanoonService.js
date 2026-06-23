import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const askKanoon = async (token, question) => {
  try {
    const response = await api.post(
      '/kanoon/query',
      { question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error("You are asking questions too quickly. Please wait a moment.");
    }
    if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to connect to Know Your Kanoon. Please try again.");
  }
};
