'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageTransition from '@/components/ui/page-transition';
import { ReactNode } from 'react';
// @ts-expect-error - TypeScript may not recognize the export
import { ToastProvider } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <DashboardLayout>
        <PageTransition>{children}</PageTransition>
        <ToastContainer />
      </DashboardLayout>
    </ToastProvider>
  );
}