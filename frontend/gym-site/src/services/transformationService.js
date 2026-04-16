import { getJson, postFormData, putFormData, deleteJson } from './httpClient';

export const transformationService = {
  getTransformations: async () => {
    return await getJson('/transformations');
  },

  createTransformation: async (payload, token) => {
    console.log("=== DEBUGGING CREATE TRANSFORMATION ===");
    console.log("payload:", payload);

    const formData = new FormData();
    formData.append('name', payload.name || '');
    formData.append('story', payload.story || '');

    if (payload.beforeImage instanceof File) {
      console.log("Appending beforeImage file:", payload.beforeImage.name);
      formData.append('beforeImage', payload.beforeImage);
    } else if (payload.beforeImage && typeof payload.beforeImage === 'string') {
      formData.append('beforeImage', payload.beforeImage);
    }

    if (payload.afterImage instanceof File) {
      console.log("Appending afterImage file:", payload.afterImage.name);
      formData.append('afterImage', payload.afterImage);
    } else if (payload.afterImage && typeof payload.afterImage === 'string') {
      formData.append('afterImage', payload.afterImage);
    }

    console.log("FormData prepared:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }

    // FIXED: was '/transformations', must be '/admin/transformations'
    console.log("Sending to /admin/transformations with token:", token.substring(0, 50) + "...");
    return await postFormData('/admin/transformations', formData, { token });
  },

  updateTransformation: async (id, payload, token) => {
    console.log("=== DEBUGGING UPDATE TRANSFORMATION ===");
    console.log("payload:", payload);
    console.log("id:", id);

    const formData = new FormData();
    formData.append('name', payload.name || '');
    formData.append('story', payload.story || '');

    if (payload.beforeImage instanceof File) {
      console.log("Appending beforeImage file:", payload.beforeImage.name);
      formData.append('beforeImage', payload.beforeImage);
    } else if (payload.beforeImage && typeof payload.beforeImage === 'string') {
      formData.append('beforeImage', payload.beforeImage);
    }

    if (payload.afterImage instanceof File) {
      console.log("Appending afterImage file:", payload.afterImage.name);
      formData.append('afterImage', payload.afterImage);
    } else if (payload.afterImage && typeof payload.afterImage === 'string') {
      formData.append('afterImage', payload.afterImage);
    }

    console.log("FormData prepared:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }

    // FIXED: was '/transformations/:id', must be '/admin/transformations/:id'
    return await putFormData(`/admin/transformations/${id}`, formData, { token });
  },

  deleteTransformation: async (id, token) => {
    // FIXED: was '/transformations/:id', must be '/admin/transformations/:id'
    return await deleteJson(`/admin/transformations/${id}`, { token });
  }
};
