import type { NextConfig } from "next";

/**
 * THEIA's game shell moved from the app root to /artifacts/theia. These keep old
 * links working. Temporary (307) rather than permanent so the mapping can still be
 * revised without poisoning browser caches.
 *
 * The in-fiction prop routes (/theia/41, /archive/*, /legacy/*) and /api/mock/*
 * deliberately stay at the top level — their URLs are part of the puzzle content.
 */
const THEIA_MOVED_PATHS = [
  "/prologue",
  "/hub",
  "/finale",
  "/facilitator",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...THEIA_MOVED_PATHS.map((path) => ({
        source: path,
        destination: `/artifacts/theia${path}`,
        permanent: false,
      })),
      {
        source: "/milestone/:id",
        destination: "/artifacts/theia/milestone/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
