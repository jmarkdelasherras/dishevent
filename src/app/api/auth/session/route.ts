import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  // First check if Firebase Admin is initialized
  if (!adminAuth) {
    console.error('Session API: Firebase Admin SDK not initialized, adminAuth is null');
    return NextResponse.json(
      { 
        error: 'Server configuration error', 
        message: 'Firebase Admin SDK is not initialized. Check server configuration.' 
      }, 
      { status: 500 }
    );
  }

  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log('Token verified for user:', decodedToken.uid);
    
    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating session:', error);
    // Add more detailed error information to help debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Unauthorized', message: errorMessage }, { status: 401 });
  }
}

// Check session validity
export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.json({ isLoggedIn: false });
  }

  // First check if Firebase Admin is initialized
  if (!adminAuth) {
    console.error('Session API: Firebase Admin SDK not initialized, adminAuth is null');
    return NextResponse.json(
      { 
        error: 'Server configuration error', 
        message: 'Firebase Admin SDK is not initialized. Check server configuration.',
        isLoggedIn: false
      }, 
      { status: 500 }
    );
  }
  
  try {
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    console.log('Session validated for user:', decodedClaims.uid);
    return NextResponse.json({ 
      isLoggedIn: true,
      userId: decodedClaims.uid,
      email: decodedClaims.email || null
    });
  } catch (error) {
    console.error('Session verification error:', error);
    cookieStore.delete('session');
    return NextResponse.json({ isLoggedIn: false });
  }
}

// Sign out and clear session
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json({ success: false, error: 'Failed to sign out' }, { status: 500 });
  }
}