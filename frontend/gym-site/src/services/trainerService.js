import { getJson, postJson, putJson, deleteJson } from './httpClient';

export const trainerService = {
  getTrainers: async () => {
    return await getJson('/trainers');
  },
  
  createTrainer: async (payload, token) => {
    return await postJson('/admin/trainers', payload, { token });
  },

  updateTrainer: async (id, payload, token) => {
    return await putJson(`/admin/trainers/${id}`, payload, { token });
  },

  deleteTrainer: async (id, token) => {
    return await deleteJson(`/admin/trainers/${id}`, { token });
  }
};
