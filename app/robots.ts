import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Protect any API routes
          '/_next/', // Prevent crawling Next.js system files
          '/static/images/og/', // Prevent crawling OG images directly
        ],
      },
      {
        userAgent: 'GPTBot', // Handle AI crawlers specifically
        allow: ['/practice', '/'], // Allow main pages for AI indexing
        disallow: '*', // Disallow other pages
      },
    ],
    sitemap: 'https://breathbetter.io/sitemap.xml',
    host: 'https://breathbetter.io',
  };
} 