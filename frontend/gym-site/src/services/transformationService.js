import { getJson, postJson, putJson, deleteJson } from './httpClient';

export const transformationService = {
  getTransformations: async () => {
    return await getJson('/transformations');
  },
  
  createTransformation: async (payload, token) => {
    return await postJson('/admin/transformations', payload, { token });
  },

  updateTransformation: async (id, payload, token) => {
    return await putJson(`/admin/transformations/${id}`, payload, { token });
  },

  deleteTransformation: async (id, token) => {
    return await deleteJson(`/admin/transformations/${id}`, { token });
  }
};
