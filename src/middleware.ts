import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/waitlist', '/verify', '/checkout', '/plans'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin and /api/admin routes
  const isAdminRoute = path.startsWith('/admin') || path.startsWith('/api/admin');
  
  // Exceptions for admin login and auth API
  const isAdminAuthRoute = path === '/admin/login' || path === '/api/admin/auth';

  if (isAdminRoute && !isAdminAuthRoute) {
    const adminToken = request.cookies.get('printysell_admin_token')?.value;

    if (!adminToken || adminToken !== 'secure_admin_session_active') {
      // If the request is an API request, return 401 JSON
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ success: false, error: 'Unauthorized. Firewall active.' }, { status: 401 });
      }
      
      // If it's a page request, redirect to the custom firewall login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Normal user routes protection
  const isApiRoute = path.startsWith('/api');
  
  // 1. Developer / Admin Access Bypass Logic
  const hasDevAccess = request.cookies.get('dev_access')?.value === 'granted';
  const queryAdmin = request.nextUrl.searchParams.get('admin');

  // If they visit with ?admin=yusuf2026, grant access and redirect to login
  if (queryAdmin === 'yusuf2026') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('dev_access', 'granted', { path: '/', maxAge: 60 * 60 * 24 * 30 }); // 30 days
    return response;
  }

  // 2. If no dev access, restrict everything EXCEPT waitlist and its APIs
  if (!hasDevAccess) {
    // Only these paths are allowed for the public (Waitlist)
    const isWaitlistRoute = 
      path === '/waitlist' || 
      path === '/api/auth/register' || 
      path === '/api/auth/google' ||
      path === '/api/etsy/callback'; // etsy callback might be needed if testing

    if (!isAdminRoute && !isWaitlistRoute) {
      // Redirect all public traffic to waitlist
      return NextResponse.redirect(new URL('/waitlist', request.url));
    }
  }

  // 3. Normal Authentication Logic (Only runs if they have dev_access)
  const isPublicRoute = publicRoutes.includes(path);
  
  // If the route is not an API, not an admin route, and not explicitly public, it requires a user session.
  if (!isAdminRoute && !isApiRoute && !isPublicRoute && hasDevAccess) {
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      // User is not logged in, redirect them to login page (since they have dev_access)
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify which routes should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with static extensions (svg, png, jpg, jpeg, gif, webp, mp4, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
