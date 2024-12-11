import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('sessionToken');
  const url = req.nextUrl;

  

 
  if (!sessionToken) {
    if (url.pathname.startsWith('/admindashboard') || url.pathname.startsWith('/employedashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    const decodedToken = jwtDecode<{ Role?: string }>(sessionToken.value);
    const userRole = decodedToken.Role;

    if (userRole === 'admin' && url.pathname.startsWith('/admindashboard')) {
      return NextResponse.next();
    }

    if (userRole === 'employee' && url.pathname.startsWith('/employedashboard')) {
      return NextResponse.next();
    }

    console.warn('Unauthorized access attempt detected. Redirecting to access denied...');
    return NextResponse.redirect(new URL('/accessdenied', req.url));

  } catch (error) {
    console.error('Error decoding session token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}


export const config = {
  matcher: ['/admindashboard/:path*', '/employedashboard/:path*'],
};
