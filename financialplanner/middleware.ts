import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: Integrate with actual authentication provider (Clerk, Auth.js, Supabase)
// This is a basic middleware structure for route protection

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile-setup'];
  
  // Public routes
  const publicRoutes = ['/', '/signup', '/signin', '/aboutus', '/payment'];

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // TODO: Check for actual authentication session with real auth provider
    // For now, we'll allow access since auth is not fully implemented
    // When auth is integrated, check for session cookie/token here
    
    // Example with Clerk:
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.redirect(new URL('/signin', request.url));
    // }
    // Check if they have a profile for dashboard access
    // if (pathname.startsWith('/dashboard')) {
    //   const hasProfile = await checkUserProfile(userId);
    //   if (!hasProfile) {
    //     return NextResponse.redirect(new URL('/profile-setup', request.url));
    //   }
    // }

    // Example with Auth.js:
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.redirect(new URL('/signin', request.url));
    // }

    // Example with Supabase:
    // const supabase = createServerClient();
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session) {
    //   return NextResponse.redirect(new URL('/signin', request.url));
    // }

    // Placeholder: Allow access for now
    // Client-side route guards will handle the rest
    return NextResponse.next();
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
