import React, { useState } from 'react';
import { User, Building, Camera, Upload } from 'lucide-react';
import useStore from '../../store/useStore';

const Settings = () => {
  const { userProfile, user, updateUserProfile } = useStore();
  const [profilePhoto, setProfilePhoto] = useState(userProfile?.profilePhoto || null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // For demo purposes, create a data URL
      // In production, you would upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoDataUrl = e.target.result;
        setProfilePhoto(photoDataUrl);
        
        // Update user profile with photo
        await updateUserProfile({ profilePhoto: photoDataUrl });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async () => {
    try {
      setProfilePhoto(null);
      await updateUserProfile({ profilePhoto: null });
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Error removing photo. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-300 mt-1">
          Manage your account preferences and business information
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start space-x-3 mb-6">
          <User className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
            <p className="text-sm text-gray-400">Your account details and profile photo</p>
          </div>
        </div>

        {/* Profile Photo Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Profile Photo</label>
          <div className="flex items-center space-x-4">
            {/* Photo Display */}
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
              )}
              
              {/* Upload overlay */}
              <label className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Upload/Remove Buttons */}
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              
              {profilePhoto && (
                <button
                  onClick={removePhoto}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <span>Remove Photo</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPEG, PNG, GIF. Maximum size: 5MB
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={user?.email || userProfile?.email || ''}
            disabled
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-300 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Building className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-white">Business Management</h2>
            <p className="text-sm text-gray-400">Tax year settings are now managed per business</p>
          </div>
        </div>

        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <div className="text-sm text-blue-100">
            <p className="font-medium mb-2">MTD Quarter Settings:</p>
            <ul className="space-y-1 text-blue-200">
              <li>• Tax year settings (Standard UK vs Calendar Election) are now configured individually for each business</li>
              <li>• When adding or editing a business, you can choose the appropriate tax year setting</li>
              <li>• This allows different businesses to have different reporting periods as needed</li>
              <li>• Visit the Business Manager to configure settings for each business</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Settings;
