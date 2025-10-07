'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileForm from '@/components/auth/ProfileForm';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const { userProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143F7E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'personal'
                ? 'border-gradient-br-blue-green text-[#143F7E] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-gradient-br-blue-green text-[#143F7E] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-gradient-br-blue-green text-[#143F7E] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Account Settings
          </button>
        </nav>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2">
            <ProfileForm />
          </div>

          {/* Right Column - Profile summary */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-[#143F7E] to-[#297B46] flex items-center justify-center text-white text-xl font-bold">
                    {userProfile?.displayName?.charAt(0) || '?'}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{userProfile?.displayName || 'User'}</h4>
                    <p className="text-sm text-gray-500">{userProfile?.email}</p>
                    <p className="text-sm mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {userProfile?.subscriptionPlan || 'Free'} Plan
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
