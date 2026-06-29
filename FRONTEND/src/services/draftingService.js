import api from './api';

export const generateDraft = async (userFacts, providedFields = null) => {
  try {
    const response = await api.post('/drafting/generate', {
      user_facts: userFacts,
      provided_fields: providedFields
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editDraft = async (documentObject, editInstructions) => {
  try {
    const response = await api.post('/drafting/edit', {
      document_object: documentObject,
      edit_instructions: editInstructions
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadPdf = async (documentObject) => {
  try {
    const response = await api.post('/drafting/download/pdf', documentObject, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadDocx = async (documentObject) => {
  try {
    const response = await api.post('/drafting/download/docx', documentObject, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
