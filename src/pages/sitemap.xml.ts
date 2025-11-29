import type { APIRoute } from 'astro';
import { events } from '../data/events';

const site = 'https://wsag.org';

export const GET: APIRoute = () => {
  const staticPages = [
    '',
    '/en',
    '/privacy',
    '/en/privacy',
    '/code-of-conduct',
    '/en/code-of-conduct',
    '/events',
    '/en/events',
  ];

  // Generate event URLs
  const eventPages = events.flatMap(event => {
    const eventPath = `/events/${event.date}/meetup-${event.id}`;
    return [
      eventPath,
      `/en${eventPath}`
    ];
  });

  const allPages = [...staticPages, ...eventPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(page => {
  const url = `${site}${page}`;
  const isEnglish = page.startsWith('/en');
  const alternateUrl = isEnglish 
    ? `${site}${page.replace(/^\/en/, '')}`
    : `${site}/en${page}`;
  
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.includes('/events/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '' || page === '/en' ? '1.0' : page.includes('/events/') ? '0.8' : '0.7'}</priority>
    ${!isEnglish ? `<xhtml:link rel="alternate" hreflang="en" href="${alternateUrl}" />` : ''}
    ${isEnglish ? `<xhtml:link rel="alternate" hreflang="pl" href="${alternateUrl}" />` : ''}
    <xhtml:link rel="alternate" hreflang="x-default" href="${isEnglish ? alternateUrl : url}" />
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};