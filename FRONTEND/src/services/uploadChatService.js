import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadDocument = async (token, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(
      '/upload-chat/upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to upload document. Please try again.");
  }
};

export const queryDocument = async (token, documentId, question) => {
  try {
    const response = await api.post(
      '/upload-chat/query',
      { document_id: documentId, question },
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
    throw new Error("Failed to query document. Please try again.");
  }
};
