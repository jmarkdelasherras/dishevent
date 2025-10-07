'use client';

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Preview Toolbar Component
 * Appears only in preview mode to provide navigation back to template selection
 */
export default function PreviewToolbar() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  if (!isPreview) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 text-white p-3 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2 bg-blue-500 text-white px-2 py-0.5 rounded-md">PREVIEW MODE</span>
        <span className="text-sm hidden sm:inline">This is a template preview only</span>
      </div>
      <div className="flex space-x-3">
        <Link 
          href="/events/create/wedding" 
          className="text-sm px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 rounded transition font-medium"
        >
          Back to Templates
        </Link>
        <Link 
          href="#" 
          onClick={() => window.close()} 
          className="text-sm px-3 py-1.5 bg-transparent hover:bg-gray-700 border border-gray-400 text-white rounded transition"
        >
          Close Preview
        </Link>
      </div>
    </div>
  );
}