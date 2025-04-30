
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE_NAME = 'flavorverse_admin_auth';
// Ensure environment variables are loaded correctly.
// Use default values for local development if needed, but prefer environment variables for production.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'; // Example fallback
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'; // Example fallback

// Define a return type that includes potential errors, even though success leads to redirect.
export async function loginAction(formData: FormData): Promise<{ error?: string } | void> { // Return void on success (redirect)
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // --- Debugging: Log environment variables used for check ---
  console.log(`[LoginAction] Checking against ADMIN_USERNAME: "${ADMIN_USERNAME}"`);
  // Avoid logging the actual password in production logs if possible,
  // but log its presence for debugging configuration issues.
  console.log(`[LoginAction] ADMIN_PASSWORD is set: ${!!ADMIN_PASSWORD}`);
  // --- End Debugging ---


  // Basic validation
  if (!username || !password) {
    console.log('[LoginAction] Validation failed: Missing username or password.');
    return { error: 'Username and password are required.' };
  }

  // Check if admin credentials are configured in the environment (important for production)
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      // Only log this error on the server, don't expose details to the client.
      console.error("[LoginAction] CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD environment variables are not set.");
       // Provide a generic error message to the user.
      return { error: 'Server configuration error. Please contact the administrator.' };
  }

  // Check credentials against environment variables
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set authentication cookie upon successful login
    try {
        console.log('[LoginAction] Credentials match. Attempting to set cookie...');
        // --- Isolate cookie setting ---
        try {
             cookies().set(ADMIN_COOKIE_NAME, 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/', // Cookie available across the entire site
                sameSite: 'lax', // Recommended for security and usability
             });
             console.log('[LoginAction] Cookie set successfully for user:', username);
        } catch (cookieError) {
             console.error('[LoginAction] Error specifically during cookies().set():', cookieError);
             // Log the specific error object for better debugging
             if (cookieError instanceof Error) {
                console.error('Cookie Error name:', cookieError.name);
                console.error('Cookie Error message:', cookieError.message);
                console.error('Cookie Error stack:', cookieError.stack);
             }
             // Return a specific error related to cookie setting failure
             return { error: 'Failed to set authentication state. Check server logs for details.' };
        }
        // --- End Isolate cookie setting ---


        // --- Redirect on Success ---
        // redirect() throws an error that Next.js catches to perform the redirect.
        // Code after redirect() in the successful path will not execute.
        console.log('[LoginAction] Cookie set, attempting redirect to /admin...');
        redirect('/admin'); // This throws NEXT_REDIRECT internally
        // No return needed here due to redirect throwing an error

    } catch (error) {
        // Catch errors during the login process *before* redirect is called, or if redirect fails unexpectedly.
        // Or, potentially catch the NEXT_REDIRECT error if it bubbles up unexpectedly.
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            // This is the expected error from redirect(), rethrow it so Next.js can handle it.
            console.log('[LoginAction] Caught NEXT_REDIRECT error, rethrowing for framework handling.');
            throw error;
        } else {
             // Log other unexpected errors.
            console.error('[LoginAction] Unexpected error during login/redirect process:', error);
            if (error instanceof Error) {
                console.error('Unexpected Error name:', error.name);
                console.error('Unexpected Error message:', error.message);
                console.error('Unexpected Error stack:', error.stack);
            }
             // If it's not a redirect error, return a generic failure message.
             // This might occur if cookie setting fails or another unexpected issue arises before redirect.
            return { error: 'An unexpected server error occurred during login attempt. Check server logs.' };
        }
    }
  } else {
    console.log('[LoginAction] Admin login failed: Invalid credentials provided.');
    // Return specific error for invalid credentials.
    return { error: 'Invalid username or password.' };
  }
}

export async function logoutAction() {
    // Clear authentication cookie
    console.log('[LogoutAction] Admin logout initiated.');
    try {
        cookies().set(ADMIN_COOKIE_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: -1, // Expire the cookie immediately
            path: '/',
            sameSite: 'lax',
        });
        console.log('[LogoutAction] Admin cookie cleared.');
    } catch(error) {
        console.error('[LogoutAction] Failed to clear admin cookie:', error);
        // Log details but proceed with redirect anyway
        if (error instanceof Error) {
            console.error('Logout Error name:', error.name);
            console.error('Logout Error message:', error.message);
        }
    }


    // Redirect to login page after logout
    console.log('[LogoutAction] Redirecting to /admin/login...');
    redirect('/admin/login');
}
