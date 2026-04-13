import { getJson, postJson, putJson, deleteJson } from './httpClient';

export const pricingService = {
  getPlans: async () => {
    return await getJson('/plans');
  },
  
  createPlan: async (payload, token) => {
    return await postJson('/admin/prices', payload, { token });
  },

  updatePlan: async (id, payload, token) => {
    return await putJson(`/admin/prices/${id}`, payload, { token });
  },

  deletePlan: async (id, token) => {
    return await deleteJson(`/admin/prices/${id}`, { token });
  }
};
