export { middleware } from './proxy.js'

// config must be statically defined here — re-exporting it from proxy.js
// prevents Next.js from reading the matcher at compile time, causing middleware
// to run on all routes including /_next/static/* assets.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
