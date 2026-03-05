export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quizfuse.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/access"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
