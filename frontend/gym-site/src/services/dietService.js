import { getJson, postFormData, putFormData, deleteJson } from './httpClient';

export const dietService = {
  getDiets: async (token) => {
    return await getJson('/diet', { token });
  },
  
  createDiet: async (payload, token) => {
    console.log("=== DEBUGGING CREATE DIET ===");
    console.log("payload:", payload);
    
    const formData = new FormData();
    formData.append('mealType', payload.mealType || '');
    formData.append('items', payload.items || '');
    formData.append('calories', payload.calories || '');
    formData.append('notes', payload.notes || '');
    
    // Handle image: only append if it's a File object
    if (payload.image instanceof File) {
      console.log("Appending image file:", payload.image.name);
      formData.append('image', payload.image);
    } else if (payload.image && typeof payload.image === 'string') {
      // For existing diet plans with image URLs, append as string
      formData.append('image', payload.image);
    }
    // If no image, don't append anything
    
    console.log("FormData prepared:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }
    
    return await postFormData('/diet', formData, { token });
  },

  updateDiet: async (id, payload, token) => {
    console.log("=== DEBUGGING UPDATE DIET ===");
    console.log("payload:", payload);
    console.log("id:", id);
    
    const formData = new FormData();
    formData.append('mealType', payload.mealType || '');
    formData.append('items', payload.items || '');
    formData.append('calories', payload.calories || '');
    formData.append('notes', payload.notes || '');
    
    // Handle image: only append if it's a File object
    if (payload.image instanceof File) {
      console.log("Appending image file:", payload.image.name);
      formData.append('image', payload.image);
    } else if (payload.image && typeof payload.image === 'string') {
      // For existing diet plans with image URLs, append as string
      formData.append('image', payload.image);
    }
    // If no image, don't append anything
    
    console.log("FormData prepared:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }
    
    return await putFormData(`/diet/${id}`, formData, { token });
  },

  deleteDiet: async (id, token) => {
    return await deleteJson(`/diet/${id}`, { token });
  }
};
