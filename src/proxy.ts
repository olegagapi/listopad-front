import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ['/cabinet'];
const AUTH_ROUTES = ['/brand-login'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.includes(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.includes(route));
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route needs auth handling
  const needsAuth = isProtectedRoute(pathname);
  const isAuthPage = isAuthRoute(pathname);

  // If no auth handling needed, just run intl middleware
  if (!needsAuth && !isAuthPage) {
    return intlMiddleware(request);
  }

  // Create Supabase client for auth check
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If no Supabase config, just run intl middleware
    return intlMiddleware(request);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(uk|en)/);
  const locale = localeMatch ? localeMatch[1] : 'uk';

  // Redirect unauthenticated users from protected routes
  if (needsAuth && !user) {
    const loginUrl = new URL(`/${locale}/brand-login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && user) {
    const cabinetUrl = new URL(`/${locale}/cabinet`, request.url);
    return NextResponse.redirect(cabinetUrl);
  }

  // Run intl middleware on the modified response
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
