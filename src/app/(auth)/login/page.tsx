'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import FormError from '@/components/ui/form-error';
import { formatAuthError } from '@/lib/utils/error-helpers';

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<{ title: string; message: string; actionType?: string } | null>(null);
  const { signIn, signInWithGoogleProvider, forgotPassword } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    getValues,
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await signIn(data.email, data.password);
      // Auth state changes will redirect to dashboard via the AuthGuard
    } catch (error: unknown) {
      console.error('Login error:', error);
      setLoginError(formatAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await signInWithGoogleProvider();
      // Auth state changes will redirect to dashboard via the AuthGuard
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      setLoginError({
        title: 'Google Sign-In Failed',
        message: 'An error occurred while signing in with Google. Please try again or use email sign-in.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Left side with illustration - visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#143F7E] to-[#297B46]">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-8">
          <Image 
            src="/assets/logo.png" 
            alt="DiShEvent Logo" 
            width={120} 
            height={120} 
            className="mb-6"
          />
          
          <div className="max-w-sm text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Create Memorable Events</h2>
            <p className="text-lg text-white/90 mb-6">
              Design beautiful invitations with ease and manage your events all in one place.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-sm">Venue Mapping</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <p className="text-white text-sm">RSVP Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/assets/logo.png" 
                alt="DiShEvent Logo" 
                width={60} 
                height={60} 
                priority
                className="mx-auto lg:mx-0"
              />
            </Link>
            <h2 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#143F7E] to-[#297B46]">Welcome!</h2>
            <p className="mt-1 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          {loginError && (
            <div className="mb-4">
              <Alert 
                type="error" 
                title={loginError.title} 
                message={loginError.message}
                onDismiss={() => setLoginError(null)}
              />
              
              {loginError.actionType === 'RESET_PASSWORD' && (
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => forgotPassword(getValues('email'))}
                    className="text-sm text-[#143F7E] hover:underline"
                  >
                    Reset your password
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                autoComplete="email"
              />
              <FormError error={errors.email?.message} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-[#143F7E]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#143F7E] focus:border-[#143F7E] border-gray-300 text-gray-800"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <FormError error={errors.password?.message} />
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-[#143F7E] focus:ring-[#297B46] border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                loadingText="Signing in"
                fullWidth
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                isLoading={isLoading}
                loadingText="Signing in"
                fullWidth
                className="py-2.5"
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-3 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  <span>Sign in with Google</span>
                </div>
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-[#143F7E] hover:text-[#297B46]">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}