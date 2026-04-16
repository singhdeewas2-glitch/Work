import { getJson, postJson, putJson, deleteJson } from './httpClient';

export const pricingService = {
getPlans: async () => {
 return await getJson('/plans');
},

  createPlan: async (payload, token) => {
    console.log("=== DEBUGGING CREATE PLAN ===");
    console.log("payload:", payload);

    const finalPayload = { ...payload };

    // Handle features array - convert to comma string for backend
    if (Array.isArray(payload.features)) {
      finalPayload.features = payload.features.join(',');
    }

    // Keep price as-is (string like "$49" is fine - backend stores it as string)
    // No numeric conversion needed

    console.log("finalPayload:", finalPayload);
    return await postJson('/admin/prices', finalPayload, { token });
  },

  updatePlan: async (id, payload, token) => {
    console.log("=== DEBUGGING UPDATE PLAN ===");
    console.log("payload:", payload);
    console.log("id:", id);

    const finalPayload = { ...payload };

    // Handle features array - convert to comma string for backend
    if (Array.isArray(payload.features)) {
      finalPayload.features = payload.features.join(',');
    }

    // Keep price as-is (string like "$49" is fine - backend stores it as string)
    // No numeric conversion needed

    console.log("finalPayload:", finalPayload);
    return await putJson(`/admin/prices/${id}`, finalPayload, { token });
  },

  deletePlan: async (id, token) => {
    console.log("=== DEBUGGING DELETE PLAN ===");
    console.log("id:", id);
    return await deleteJson(`/admin/prices/${id}`, { token });
  }
};
