import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

/* ============================================================
   PROXY — Route Protection
   Runs on every request before the page renders.

   Step 1 — Session check: unauthenticated users are redirected
            to /login regardless of which page they requested.

   Step 2 — Portal access check: if NEXT_PUBLIC_APP_NAME is set
            and the app is registered in portal_apps, the user
            must have a row in portal_user_app_access for this
            app. Admins (portal_profiles.is_admin = true) bypass
            this check. Users without access are redirected to
            the App Portal.

   Add any public routes to the PUBLIC_ROUTES array below.
   ============================================================ */

const PUBLIC_ROUTES = ['/login']
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.amped-i.com'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next({ request })

  // Allow public routes through without auth check
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response
  }

  // Create a Supabase server client using the request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Step 1 — Check for a valid user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Step 2 — Portal access check
  // Only runs if NEXT_PUBLIC_APP_NAME is set (i.e. this interface is registered in the portal).
  // portal_apps.github_repo stores the value as "Amped-I-LLC/interface-<name>".
  const appName = process.env.NEXT_PUBLIC_APP_NAME

  if (appName) {
    const { data: app } = await supabase
      .from('portal_apps')
      .select('id')
      .ilike('github_repo', `%/${appName}`)
      .eq('is_active', true)
      .maybeSingle()

    if (app) {
      // Admins bypass the per-app access check
      const { data: profile } = await supabase
        .from('portal_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        // Verify the user has an explicit access row for this app
        const { data: access } = await supabase
          .from('portal_user_app_access')
          .select('id')
          .eq('user_id', user.id)
          .eq('app_id', app.id)
          .maybeSingle()

        if (!access) {
          return NextResponse.redirect(new URL(PORTAL_URL, request.url))
        }
      }
    }
  }

  return response
}

// Apply proxy to all routes except Next.js internals and static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
