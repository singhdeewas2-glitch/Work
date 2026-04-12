/*
Profile Header Component
Handles user profile display and editing functionality
Provides form for editing personal information and bio
*/

import React from 'react';
import { Button, FormField, StatusMessage } from '../UI';

const ProfileHeader = ({ 
  profile, 
  isEditing, 
  message, 
  saving, 
  onEdit, 
  onSave, 
  onCancel, 
  onChange, 
  profileUi 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  if (isEditing) {
    return (
      <form className="premiumForm" onSubmit={handleSubmit}>
        {message.text && (
          <StatusMessage 
            message={message.text} 
            type={message.type}
            duration={3000}
          />
        )}
        
        <FormField
          label={profileUi.editForm.fullName}
          type="text"
          name="name"
          value={profile.name || ""}
          onChange={onChange}
          placeholder="Enter your full name"
          required
        />

        <div className="profile-form-row">
          <FormField
            label={profileUi.editForm.startingWeight}
            type="number"
            name="startingWeight"
            value={profile.startingWeight || ""}
            onChange={onChange}
            placeholder="e.g. 85"
            step="0.1"
            className="profile-form-field"
          />
          <FormField
            label={profileUi.editForm.currentWeight}
            type="number"
            name="weight"
            value={profile.weight || ""}
            onChange={onChange}
            placeholder="e.g. 75"
            step="0.1"
            className="profile-form-field"
          />
          <FormField
            label={profileUi.editForm.goal}
            type="text"
            name="goal"
            value={profile.goal || ""}
            onChange={onChange}
            placeholder="e.g. 65"
            className="profile-form-field"
          />
        </div>

        <FormField
          label={profileUi.editForm.bio}
          type="textarea"
          name="bio"
          value={profile.bio || ""}
          onChange={onChange}
          placeholder="Tell us about your fitness journey..."
          rows="4"
        />

        <div className="profile-form-actions">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            {profileUi.editForm.cancel}
          </Button>
          <Button
            variant="primary"
            loading={saving}
            type="submit"
          >
            {saving ? profileUi.editForm.saving : profileUi.editForm.save}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="dashboardNewGrid">
      <section className="dashboardTopNewGrid">
        <div className="dashboardTopLeftNew">
          <h1 className="profileTitleNew">
            {profile.name || profileUi.defaultName}
          </h1>
          <p className="profileBioNew">{profile.bio || profileUi.defaultBio}</p>
          <Button
            variant="primary"
            onClick={onEdit}
            type="button"
          >
            {profileUi.editProfile}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ProfileHeader;
