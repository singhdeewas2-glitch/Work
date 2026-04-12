/*
Profile Image Upload Component
Handles profile avatar display, upload, and management
Provides modal for image preview and upload controls
*/

import React, { useRef } from 'react';
import { Button, StatusMessage } from '../UI';

const ProfileImageUpload = ({ 
  profile, 
  isAvatarModalOpen, 
  setIsAvatarModalOpen, 
  avatarUploading, 
  avatarMessage, 
  profileUi, 
  onAvatarUpload, 
  onAvatarRemove 
}) => {
  const avatarInputRef = useRef(null);

  return (
    <>
      <div className="dashboardTopRightNew">
        <button
          type="button"
          className="dashboardProfilePhotoNew avatarTriggerNew"
          onClick={() => setIsAvatarModalOpen(true)}
          aria-label={profileUi.avatar.ariaOpen}
        >
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="profileAvatarImgNew"
            />
          ) : (
            <div className="profileAvatarPlaceholderNew">
              {(profile.name || "D").trim().charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </div>

      {isAvatarModalOpen && (
        <div
          className="avatarModalOverlayNew"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div
            className="avatarModalCardNew"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="avatarModalPreviewNew">
              {avatarMessage.text && (
                <StatusMessage 
                  message={avatarMessage.text} 
                  type={avatarMessage.type}
                  className="avatar-modal-status"
                  style={{
                    position: "absolute",
                    top: 10,
                    width: "90%",
                    left: "5%",
                    zIndex: 100,
                  }}
                />
              )}
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile enlarged"
                  className="profileAvatarImgNew"
                />
              ) : (
                <div className="profileAvatarPlaceholderNew">
                  {(profile.name || "D").trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="avatarModalActionsNew">
              <Button
                variant="primary"
                loading={avatarUploading}
                onClick={() => avatarInputRef.current?.click()}
                type="button"
              >
                {avatarUploading
                  ? profileUi.avatar.uploading
                  : profileUi.avatar.changePhoto}
              </Button>
              <Button
                variant="outline"
                onClick={onAvatarRemove}
                disabled={avatarUploading}
                type="button"
              >
                {profileUi.avatar.remove}
              </Button>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="avatarInputHiddenNew"
              onChange={onAvatarUpload}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImageUpload;
