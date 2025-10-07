'use client';

import React from 'react';
import BaseEventForm from '@/components/forms/BaseEventForm';

export default function BirthdayEventForm() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Birthday Event</h1>
        <p className="text-gray-600 mt-1">Fill in the details for your birthday event</p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <BaseEventForm eventType="birthday" defaultTheme="Fun" />
      </div>
    </div>
  );
}