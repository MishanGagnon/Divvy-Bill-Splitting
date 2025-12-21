/**
 * Returns the base URL of the application based on the environment.
 * In production, it uses NEXT_PUBLIC_SITE_URL or VERCEL_URL.
 * In development, it defaults to localhost:3000.
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }

  // Server-side
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
