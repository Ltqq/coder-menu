
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'flavorverse_admin_auth';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME); // Get the full cookie object
  const isAuthenticated = adminCookie?.value === 'true';

  // --- Detailed Logging ---
  console.log(`[Middleware] === Request Start ===`);
  console.log(`[Middleware] Pathname: ${pathname}`);
  if (adminCookie) {
      // Using JSON.stringify might be verbose for a simple cookie, let's log key properties
      console.log(`[Middleware] Found cookie '${ADMIN_COOKIE_NAME}': name=${adminCookie.name}, value=${adminCookie.value}, path=${adminCookie.path}`); // Add more props if needed
      console.log(`[Middleware] Cookie value type: ${typeof adminCookie.value}, Expected value: 'true'`);
      console.log(`[Middleware] isAuthenticated evaluated as: ${isAuthenticated}`);
  } else {
      console.log(`[Middleware] Cookie '${ADMIN_COOKIE_NAME}' not found.`);
      console.log(`[Middleware] isAuthenticated evaluated as: ${isAuthenticated}`);
  }
  // --- End Detailed Logging ---


  // Allow access to the login page regardless of authentication status
  if (pathname === '/admin/login') {
    // If already authenticated and trying to access login, redirect to admin dashboard
    if (isAuthenticated) {
        // Prevent infinite redirect loops by checking if already at target
        if (request.nextUrl.pathname !== '/admin') {
             console.log('[Middleware] Authenticated user on /admin/login -> redirecting to /admin');
             return NextResponse.redirect(new URL('/admin', request.url));
        } else {
            // Already at /admin, but somehow hit the /admin/login check? Log and proceed.
             console.log('[Middleware] Authenticated user on /admin/login check, but already at /admin. Allowing.');
             // This case might not be strictly necessary if redirects are handled correctly, but added for safety.
             return NextResponse.next();
        }
    }
     console.log('[Middleware] Unauthenticated user on /admin/login -> allowing access');
    return NextResponse.next(); // Allow access to login page if not authenticated
  }

  // Protect all other admin routes (since matcher ensures pathname starts with /admin)
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    console.log(`[Middleware] Unauthenticated user accessing protected route ${pathname} -> redirecting to /admin/login`);
    const loginUrl = new URL('/admin/login', request.url);
    // Avoid adding 'next' param if redirecting from login page itself (prevent loops) - This check might be redundant now
    // if (pathname !== '/admin/login') {
    //  loginUrl.searchParams.set('next', pathname); // Optional: Add redirect after login
    //}
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed for authenticated users on admin routes
  console.log(`[Middleware] Authenticated user accessing ${pathname} -> allowing request.`);
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  /*
   * Match all request paths starting with /admin.
   * The logic inside the middleware function handles the specific
   * case for /admin/login.
   * Exclude static assets and API routes implicitly handled by Next.js.
   */
   matcher: ['/admin/:path*'],
}

