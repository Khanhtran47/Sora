import { env } from 'process';
import { createCookieSessionStorage } from '@remix-run/node';

const {
  getSession: getSessionFromCookie,
  commitSession: commitAuthCookie,
  destroySession: destroyAuthCookie,
} = createCookieSessionStorage({
  cookie: {
    name: 'remix-movie-auth',
    httpOnly: true,
    maxAge: env.NODE_ENV === 'production' ? 3600 * 24 * 30 : 3600 * 2, // about 1 month
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_KEY || 's3cret1'],
    secure: env.NODE_ENV === 'production',
  },
});

export { getSessionFromCookie, commitAuthCookie, destroyAuthCookie };
