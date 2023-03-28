import { json, redirect } from '@remix-run/node';
import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { useActionData, NavLink, useLocation } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import {
  signInWithPassword,
  getSessionFromCookie,
  commitAuthCookie,
  requestPayload,
} from '~/services/supabase';
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/services/message.server';

import AuthForm from '~/components/AuthForm';

type ActionData = {
  error: string | null;
};

export const action = async ({ request }: ActionArgs) => {
  const { searchParams } = new URL(request.url);
  const [data, messageSession] = await Promise.all([
    request.clone().formData(),
    getSession(request.headers.get('cookie')),
  ]);

  const email = data.get('email')?.toString();
  const password = data.get('password')?.toString();

  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email)) {
    setErrorMessage(messageSession, 'Please enter a valid email!');
    return json<ActionData>(
      { error: 'Please enter a valid email!' },
      {
        headers: { 'Set-Cookie': await commitSession(messageSession) },
      },
    );
  }

  if (!password) {
    setErrorMessage(messageSession, 'Password is required!');
    return json<ActionData>(
      { error: 'Password is required!' },
      {
        headers: { 'Set-Cookie': await commitSession(messageSession) },
      },
    );
  }

  const {
    data: { session },
    error,
  } = await signInWithPassword(email, password);

  if (error) {
    setErrorMessage(messageSession, error.message);
    return json<ActionData>(
      { error: error.message },
      {
        headers: { 'Set-Cookie': await commitSession(messageSession) },
      },
    );
  }

  if (!session) {
    setErrorMessage(messageSession, 'Something went wrong. Please sign in again!');
    return json<ActionData>(
      { error: 'Something went wrong. Please sign in again!' },
      {
        headers: { 'Set-Cookie': await commitSession(messageSession) },
      },
    );
  }

  const authCookie = await getSessionFromCookie(request.headers.get('Cookie'));

  if (authCookie.has('auth_token')) {
    setSuccessMessage(messageSession, 'You are already signed in!');
    return redirect(searchParams.get('ref') || '/', {
      headers: { 'Set-Cookie': await commitSession(messageSession) },
    });
  }

  setSuccessMessage(messageSession, 'You are signed in!');
  const payload = await requestPayload(request);

  authCookie.set('auth_token', {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: Date.now() + (session.expires_in - 10) * 1000,
    req_payload: payload,
  });

  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');
  const headers = new Headers();
  headers.set('Set-Cookie', await commitSession(messageSession));
  headers.set('Set-Cookie', await commitAuthCookie(authCookie));
  return redirect(ref, { headers });
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

export const handle = {
  breadcrumb: () => (
    <NavLink to="/sign-in" aria-label="Sign In Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Sign In
        </Badge>
      )}
    </NavLink>
  ),
};

const SignInPage = () => {
  const actionData = useActionData<ActionData>();
  const location = useLocation();
  const code = new URLSearchParams(location.search).get('code');
  return (
    <Container fluid responsive={false} justify="center" display="flex">
      <AuthForm type="sign-in" error={actionData?.error} code={code} />
    </Container>
  );
};

export default SignInPage;
