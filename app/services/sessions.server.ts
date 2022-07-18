// app/sessions.js
import { createCookieSessionStorage } from '@remix-run/node'; // or "@remix-run/cloudflare"

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'remix-movie',
    httpOnly: true,
    maxAge: 3659,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_KEY ?? 's3cret1'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export { getSession, commitSession, destroySession };
