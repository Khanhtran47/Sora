import { generateRobotsTxt } from '@nasa-gcn/remix-seo';

export function loader() {
  return generateRobotsTxt(
    [
      { type: 'userAgent', value: 'Bingbot' },
      { type: 'allow', value: '/$' },
      { type: 'allow', value: '/movies$' },
      { type: 'allow', value: '/tv-shows$' },
      { type: 'allow', value: '/anime$' },
      { type: 'allow', value: '/trending$' },
      { type: 'allow', value: '/sign-in$' },
      { type: 'allow', value: '/sign-up$' },
      { type: 'disallow', value: '/' },
      { type: 'crawlDelay', value: '10' },
      { type: 'userAgent', value: 'SemrushBot' },
      { type: 'disallow', value: '/' },
      { type: 'userAgent', value: '*' },
      { type: 'disallow', value: '' },
      { type: 'sitemap', value: 'https://sorachill.vercel.app/sitemap.xml' },
    ],
    {
      appendOnDefaultPolicies: false,
      headers: {
        'Cache-Control': `public, max-age=${60 * 5}`,
      },
    },
  );
}
