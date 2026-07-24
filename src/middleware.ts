import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin and /api/admin routes
  const isAdminRoute = path.startsWith('/admin') || path.startsWith('/api/admin');
  
  // Exceptions for login and auth API
  const isAuthRoute = path === '/admin/login' || path === '/api/admin/auth';

  if (isAdminRoute && !isAuthRoute) {
    const adminToken = request.cookies.get('printysell_admin_token')?.value;

    if (!adminToken || adminToken !== 'secure_admin_session_active') {
      // If the request is an API request, return 401 JSON
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ success: false, error: 'Unauthorized. Firewall active.' }, { status: 401 });
      }
      
      // If it's a page request, redirect to the custom firewall login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify which routes should be processed by the middleware
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
