import { createCookieSessionStorage, redirect } from '@remix-run/node';

const TOAST_SESSION = 'toast';

export type ToastMessage = {
  title: string;
  type: 'default' | 'success' | 'error';
  description?: string;
};

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: TOAST_SESSION,
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_KEY || 's3cret1'],
    secure: process.env.NODE_ENV === 'production',
  },
});

function getSessionFromRequest(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

/**
 * Helper method used to add flash session values to the session
 */
export async function flashMessageHeaders(
  request: Request,
  toastMessage: ToastMessage,
  headers?: ResponseInit['headers'],
) {
  const cookie = await addToast(request, toastMessage);
  const newHeaders = new Headers(headers);
  newHeaders.append('Set-Cookie', cookie);
  return newHeaders;
}

export async function redirectWithToast(
  request: Request,
  url: string,
  toastMessage: ToastMessage,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: await flashMessageHeaders(request, toastMessage, init?.headers),
  });
}

export function addToast(request: Request, toastMessage: ToastMessage): Promise<string> {
  const toasts = getToastSession(request);
  toasts.add(toastMessage);
  return toasts.commit();
}

export function getToastSession(request: Request) {
  let nextMessage: ToastMessage | undefined;

  async function getMessage(): Promise<ToastMessage> {
    const session = await getSessionFromRequest(request);
    const toast = (JSON.parse(session.get(TOAST_SESSION) || 'null') as ToastMessage) || undefined;
    return toast;
  }

  async function commit(): Promise<string> {
    const session = await getSessionFromRequest(request);
    session.flash(TOAST_SESSION, JSON.stringify(nextMessage));
    return sessionStorage.commitSession(session);
  }

  function add(toastMessage: ToastMessage): void {
    nextMessage = toastMessage;
  }

  return {
    getMessage,
    commit,
    add,
  };
}
