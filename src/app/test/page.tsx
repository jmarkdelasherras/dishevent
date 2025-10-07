'use client';

import FirebaseTestComponent from '@/components/tests/FirebaseTestComponent';
import './test.css';

export default function TestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Firebase Integration Tests</h1>
      <p className="mb-6">
        This page allows you to test the Firebase Realtime Database and Storage functionality.
        Use the component below to create, update, and delete events, add guests, and upload files.
      </p>
      
      <FirebaseTestComponent />
    </div>
  );
}