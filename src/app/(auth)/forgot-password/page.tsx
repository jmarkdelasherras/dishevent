'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { FirebaseError } from 'firebase/app';

// Define validation schema with Zod
const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const { forgotPassword } = useAuth();
  
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setResetError(null);
    setResetSuccess(false);
    
    try {
      await forgotPassword(data.email);
      setResetSuccess(true);
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            setResetError('No account found with this email address.');
            break;
          case 'auth/invalid-email':
            setResetError('Invalid email address format.');
            break;
          default:
            setResetError('An error occurred. Please try again later.');
            break;
        }
      } else {
        setResetError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md m-auto p-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/assets/logo.png" 
              alt="DiShEvent Logo" 
              width={80} 
              height={80} 
              priority
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {resetSuccess ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <p className="text-green-700">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </p>
            <div className="mt-4">
              <Link 
                href="/login"
                className="text-sm font-medium text-[#143F7E] hover:text-[#297B46]"
              >
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {resetError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <p className="text-sm text-red-700">{resetError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#143F7E] focus:border-[#143F7E] border-gray-300 text-gray-800"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:from-[#0d2c59] hover:to-[#1d6234] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#143F7E] font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-medium text-[#143F7E] hover:text-[#297B46]">
                Return to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}