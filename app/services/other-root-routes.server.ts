/* eslint-disable arrow-body-style */
import { generateRobotsTxt, generateSitemap } from '@balavishnuvj/remix-seo';
import { EntryContext } from '@remix-run/node';

type Handler = (request: Request, remixContext: EntryContext) => Promise<Response | null> | null;

export const otherRootRoutes: Record<string, Handler> = {
  '/sitemap.xml': async (request, remixContext) => {
    return generateSitemap(request, remixContext, {
      siteUrl: 'https://sora-anime.vercel.app',
      headers: {
        'Cache-Control': `public, max-age=${60 * 5}`,
      },
    });
  },
  '/robots.txt': async () => {
    return generateRobotsTxt(
      [
        { type: 'userAgent', value: '*' },
        { type: 'allow', value: '/$' },
        { type: 'allow', value: '/movies$' },
        { type: 'allow', value: '/tv-shows$' },
        { type: 'allow', value: '/anime$' },
        { type: 'allow', value: '/trending$' },
        { type: 'allow', value: '/sign-in$' },
        { type: 'allow', value: '/sign-up$' },
        { type: 'disallow', value: '/' },
        { type: 'crawlDelay', value: '100' },
        { type: 'sitemap', value: 'https://sora-anime.vercel.app/sitemap.xml' },
      ],
      {
        appendOnDefaultPolicies: false,
        headers: {
          'Cache-Control': `public, max-age=${60 * 5}`,
        },
      },
    );
  },
};

export const otherRootRouteHandlers: Array<Handler> = [
  ...Object.entries(otherRootRoutes).map(([path, handler]) => {
    return (request: Request, remixContext: EntryContext) => {
      if (new URL(request.url).pathname !== path) return null;
      return handler(request, remixContext);
    };
  }),
];
