import api from './api';

export const generateReasoning = async (userFacts) => {
  try {
    const response = await api.post('/reasoning/generate', {
      user_facts: userFacts,
      tenant_id: "global"
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
