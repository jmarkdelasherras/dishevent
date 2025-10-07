'use client';

import { AuthProvider } from '@/hooks/useAuth';
import { LoadingProvider } from '@/hooks/useLoading';
import AuthGuard from '@/components/auth/AuthGuard';
import DeveloperAccessGuard from '@/components/auth/DeveloperAccessGuard';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <DeveloperAccessGuard>
          <AuthGuard>{children}</AuthGuard>
        </DeveloperAccessGuard>
      </AuthProvider>
    </LoadingProvider>
  );
}