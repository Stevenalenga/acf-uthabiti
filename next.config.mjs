/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfkit", "fontkit", "linebreak", "png-js"],
  async redirects() {
    return [
      { source: "/acf-blog-preview", destination: "/blog", permanent: true },
      { source: "/acf-blog-preview/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
