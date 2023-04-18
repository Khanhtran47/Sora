import { Badge, Container } from '@nextui-org/react';
import { json, redirect, type ActionArgs, type LoaderArgs } from '@remix-run/node';
import { NavLink, useActionData, useLocation } from '@remix-run/react';

import {
  commitAuthCookie,
  getSessionFromCookie,
  requestPayload,
  signInWithPassword,
} from '~/services/supabase';
import AuthForm from '~/components/AuthForm';

type ActionData = {
  error: string | null;
};

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
  const payload = await requestPayload(request);

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
  miniTitle: () => ({
    title: 'Sign In',
    showImage: false,
  }),
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
