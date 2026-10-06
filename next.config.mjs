/** @type {import('next').NextConfig} */

// Guest photo uploads are served from Supabase Storage. Derive the allowed
// image host from the same env var the Supabase client uses, so there is one
// source of truth and no hardcoded project ref in the repo.
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The page was renamed to match its title (Erick, 6 October 2026). Links
  // already shared to /guestbook keep working.
  async redirects() {
    return [{ source: "/guestbook", destination: "/wishingwall", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
