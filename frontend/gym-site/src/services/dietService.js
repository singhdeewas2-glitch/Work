import { getJson, postJson, putJson, deleteJson } from './httpClient';

export const dietService = {
  getDiets: async (token) => {
    // some endpoints might pass token if authenticated
    return await getJson('/diet', { token });
  },
  
  createDiet: async (payload, token) => {
    return await postJson('/diet', payload, { token });
  },

  updateDiet: async (id, payload, token) => {
    return await putJson(`/diet/${id}`, payload, { token });
  },

  deleteDiet: async (id, token) => {
    return await deleteJson(`/diet/${id}`, { token });
  }
};
