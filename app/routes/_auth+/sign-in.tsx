import { json, redirect, type ActionArgs, type LoaderArgs } from '@remix-run/node';
import { useActionData, useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import {
  commitAuthCookie,
  getSessionFromCookie,
  requestPayload,
  signInWithPassword,
} from '~/services/supabase';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import AuthForm from '~/components/elements/shared/AuthForm';

type ActionData = {
  error: string | null;
};

export const meta = mergeMeta(() => [
  { title: 'Sora - Sign In' },
  { name: 'description', content: 'Sign in to your Sora account.' },
  { property: 'og:title', content: 'Sora - Sign In' },
  { property: 'og:description', content: 'Sign in to your Sora account.' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/sign-in' },
  { property: 'twitter:title', content: 'Sora - Sign In' },
  { property: 'twitter:description', content: 'Sign in to your Sora account.' },
]);

export const action = async ({ request }: ActionArgs) => {
  const { searchParams } = new URL(request.url);
  const data = await request.clone().formData();

  const email = data.get('email')?.toString();
  const password = data.get('password')?.toString();

  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email)) {
    return json<ActionData>({ error: 'Please enter a valid email!' });
  }

  if (!password) {
    return json<ActionData>({ error: 'Password is required!' });
  }

  const {
    data: { session },
    error,
  } = await signInWithPassword(email, password);

  if (error) {
    return json<ActionData>({ error: error.message });
  }

  if (!session) {
    return json<ActionData>({ error: 'Something went wrong. Please sign in again!' });
  }

  const authCookie = await getSessionFromCookie(request.headers.get('Cookie'));

  if (authCookie.has('auth_token')) {
    return redirect(searchParams.get('ref') || '/');
  }
  const payload = process.env.NODE_ENV === 'production' ? await requestPayload(request) : undefined;

  authCookie.set('auth_token', {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: Date.now() + (session.expires_in - 10) * 1000,
    req_payload: payload,
  });

  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  return redirect(ref, {
    headers: {
      'Set-Cookie': await commitAuthCookie(authCookie),
    },
  });
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const { searchParams } = new URL(request.url);
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  if (session.has('auth_token')) {
    return redirect(ref);
  }

  return null;
};

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/sign-in" key="sign-in">
      Sign In
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Sign In',
    showImage: false,
  }),
};

const SignInPage = () => {
  const actionData = useActionData<ActionData>();
  const location = useLocation();
  const code = new URLSearchParams(location.search).get('code');
  return <AuthForm type="sign-in" error={actionData?.error} code={code} />;
};

export default SignInPage;
