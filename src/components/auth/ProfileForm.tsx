'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { createUserProfile } from '@/lib/firebase/auth';
import { updateProfile } from 'firebase/auth';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
  photoURL: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || '',
      email: userProfile?.email || '',
      photoURL: userProfile?.photoURL || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      // Update Firebase Auth user profile
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL || null,
      });
      
      // Update Firestore user profile
      await createUserProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL || null,
      });
      
      setUpdateSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      {updateSuccess && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">Your profile was updated successfully.</p>
        </div>
      )}
      
      {updateError && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{updateError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="displayName"
            type="text"
            {...register('displayName')}
            className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#143F7E] focus:border-[#143F7E] border-gray-300 text-gray-800"
          />
          {errors.displayName && (
            <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-100 border-gray-300 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>
        
        <div>
          <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo URL
          </label>
          <input
            id="photoURL"
            type="text"
            {...register('photoURL')}
            placeholder="https://example.com/photo.jpg"
            className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#143F7E] focus:border-[#143F7E] border-gray-300 text-gray-800"
          />
          {errors.photoURL && (
            <p className="mt-1 text-xs text-red-600">{errors.photoURL.message}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#143F7E] text-white rounded-md hover:bg-[#0d2c59] focus:outline-none focus:ring-2 focus:ring-[#143F7E] focus:ring-opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}