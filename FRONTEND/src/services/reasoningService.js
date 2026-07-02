import api from './api';

export const generateReasoning = async (token, userFacts, conversationId = null, signal) => {
  try {
    const payload = {
      user_facts: userFacts,
      tenant_id: "global"
    };
    if (conversationId) {
      payload.conversation_id = conversationId;
    }
    const response = await api.post('/reasoning/generate', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
