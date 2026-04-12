/*
Profile Image Upload Hook
Handles avatar upload logic and state management
Provides functions for uploading, removing, and managing profile images
*/

import { useState, useCallback } from 'react';
import { fetchProfile, updateProfile } from '../services/profileService';
import { uploadFileToServer, removeUploadedFile, fileToBase64 } from '../services/uploadService';

export const useProfileImageUpload = (getValidToken, fetchProfileCallback) => {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState({ text: '', type: '' });

  const handleAvatarUpload = useCallback(async (event, profileUi) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setAvatarMessage({
        text: profileUi.avatar.preview,
        type: 'success',
      });
      setAvatarUploading(true);
      event.target.value = '';

      const token = await getValidToken();
      
      // Upload file using centralized service
      const uploadData = await uploadFileToServer(file, 'avatars', token);
      
      // Update profile with new image URL
      await updateProfile(token, { profileImage: uploadData.url });
      await fetchProfileCallback();
      
      setAvatarMessage({
        text: profileUi.avatar.success,
        type: 'success',
      });
    } catch (err) {
      setAvatarMessage({ 
        text: err.message || profileUi.messages.unexpected, 
        type: 'error' 
      });
    } finally {
      setAvatarUploading(false);
    }
  }, [getValidToken, fetchProfileCallback]);

  const handleAvatarRemove = useCallback(async (profile, profileUi) => {
    const backupImage = profile.profileImage;
    
    if (!backupImage) {
      setAvatarMessage({ text: 'No image to remove', type: 'error' });
      return;
    }

    try {
      setAvatarUploading(true);
      const token = await getValidToken();
      
      // Remove file using centralized service
      await removeUploadedFile(backupImage, token);
      
      // Update profile to remove image
      await updateProfile(token, { profileImage: '' });
      await fetchProfileCallback();
      
      setAvatarMessage({ text: profileUi.avatar.removed, type: 'success' });
    } catch (err) {
      // Restore backup if removal failed
      try {
        await updateProfile(await getValidToken(), { profileImage: backupImage });
      } catch (restoreErr) {
        // If restore fails, we have a bigger problem
        console.error('Failed to restore backup image:', restoreErr);
      }
      
      setAvatarMessage({ 
        text: err.message || profileUi.messages.unexpected, 
        type: 'error' 
      });
    } finally {
      setAvatarUploading(false);
    }
  }, [getValidToken, fetchProfileCallback]);

  const clearAvatarMessage = useCallback(() => {
    setAvatarMessage({ text: '', type: '' });
  }, []);

  return {
    avatarUploading,
    avatarMessage,
    handleAvatarUpload,
    handleAvatarRemove,
    clearAvatarMessage,
  };
};
