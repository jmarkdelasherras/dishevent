'use client';

import React from 'react';
import BaseEventForm from '@/components/forms/BaseEventForm';

export default function CorporateEventForm() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Corporate Event</h1>
        <p className="text-gray-600 mt-1">Fill in the details for your corporate event</p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <BaseEventForm eventType="corporate" defaultTheme="Professional" />
      </div>
    </div>
  );
}