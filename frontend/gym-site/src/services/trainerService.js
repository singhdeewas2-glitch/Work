import { getJson, postFormData, putFormData, deleteJson } from './httpClient';

export const trainerService = {
  getTrainers: async () => {
    return await getJson('/trainers');
  },
  
  createTrainer: async (payload, token) => {
    console.log("=== DEBUGGING CREATE TRAINER ===");
    console.log("payload:", payload);
    
    const formData = new FormData();
    formData.append('name', payload.name || '');
    formData.append('role', payload.specialty || payload.role || '');
    formData.append('experience', payload.experience || '');
    
    // Handle image: only append if it's a File object
    if (payload.image instanceof File) {
      console.log("Appending image file:", payload.image.name);
      formData.append('image', payload.image);
    } else if (payload.image && typeof payload.image === 'string') {
      // For existing trainers with image URLs, append as string
      formData.append('image', payload.image);
    }
    // If no image, don't append anything
    
    console.log("FormData prepared:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }
    
    return await postFormData('/admin/trainers', formData, { token });
  },

  updateTrainer: async (id, payload, token) => {
    console.log("=== DEBUGGING UPDATE TRAINER ===");
    console.log("payload:", payload);
    console.log("id:", id);
    
    const formData = new FormData();
    formData.append('name', payload.name || '');
    formData.append('role', payload.specialty || payload.role || '');
    formData.append('experience', payload.experience || '');
    
    // Handle image: only append if it's a File object
    if (payload.image instanceof File) {
      console.log("Appending image file:", payload.image.name);
      formData.append('image', payload.image);
    } else if (payload.image && typeof payload.image === 'string') {
      // For existing trainers with image URLs, append as string
      formData.append('image', payload.image);
    }
    // If no image, don't append anything
    
    console.log("FormData prepared:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }
    
    return await putFormData(`/admin/trainers/${id}`, formData, { token });
  },

  deleteTrainer: async (id, token) => {
    return await deleteJson(`/admin/trainers/${id}`, { token });
  }
};
