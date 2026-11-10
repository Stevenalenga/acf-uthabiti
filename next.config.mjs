/** @type {import('next').NextConfig} */
const mombasaArchiveRoutes = [
  "accommodation",
  "ceo-invites",
  "conference-details",
  "event",
  "exhibitions-details",
  "field-visits",
  "livestream",
  "media",
  "participants",
  "partnership-dinner",
  "programme",
  "promo-invoice",
  "sessions",
  "speakers",
  "sponsors",
  "steering-committee",
  "tamarind-dinner",
  "venue",
];

const nextConfig = {
  serverExternalPackages: ["pdfkit", "fontkit", "linebreak", "png-js"],
  async redirects() {
    return [
      { source: "/acf-blog-preview", destination: "/blog", permanent: true },
      { source: "/acf-blog-preview/:slug", destination: "/blog/:slug", permanent: true },
      ...mombasaArchiveRoutes.map((route) => ({
        source: `/${route}/:path*`,
        destination: `/acf-mombasa-2026/${route}/:path*`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [
      {
        source: "/acf-mombasa-2026/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
