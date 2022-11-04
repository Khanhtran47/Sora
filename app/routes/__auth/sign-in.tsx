import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node';
import { useActionData, Link, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { signInWithPassword, getSessionFromCookie, commitAuthCookie } from '~/services/supabase';
import AuthForm from '~/src/components/AuthForm';

type ActionData = {
  error: string | null;
};

export const action: ActionFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const data = await request.clone().formData();

  const email = data.get('email')?.toString();
  const password = data.get('password')?.toString();

  if (!email || !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
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
    return redirect(searchParams.get('ref') || request.referrer || '/');
  }

  authCookie.set('auth_token', {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: Date.now() + (session.expires_in - 10) * 1000,
  });

  return redirect(searchParams.get('ref') || request.referrer || '/', {
    headers: {
      'Set-Cookie': await commitAuthCookie(authCookie),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const { searchParams } = new URL(request.url);

  if (session.has('auth_token')) {
    return redirect(searchParams.get('ref') || request.referrer || '/');
  }

  return null;
};

export const handle = {
  breadcrumb: () => <Link to="/sign-in">Sign In</Link>,
};

const SignInPage = () => {
  const actionData = useActionData<ActionData>();
  const location = useLocation();
  const code = new URLSearchParams(location.search).get('code');
  return (
    <Container fluid justify="center" display="flex">
      <AuthForm type="sign-in" error={actionData?.error} code={code} />
    </Container>
  );
};

export default SignInPage;
