import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node';
import { useActionData, Link } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import {
  getSessionFromCookie,
  commitAuthCookie,
  signUp,
  requestPayload,
} from '~/services/supabase';
import AuthForm from '~/src/components/AuthForm';
import sgConfigs from '~/services/configs.server';
import encode from '~/utils/encode';

type ActionData = {
  errorCode?: string | null;
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const data = await request.clone().formData();

  const email = data.get('email')?.toString();
  const password = data.get('password')?.toString();
  const rePassword = data.get('re-password')?.toString();
  const inviteCode = data.get('invite-code')?.toString();

  if (sgConfigs.__invitedSignUpOnly) {
    if (!inviteCode) {
      return json<ActionData>({ errorCode: 'noInviteCode' });
    }
    if (encode(inviteCode || '') !== sgConfigs.__invitedSignUpKey) {
      return json<ActionData>({ errorCode: 'invalidInviteCode' });
    }
  }

  if (!email || !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    return json<ActionData>({ errorCode: 'invalidEmail' });
  }

  if (!password || !rePassword || password !== rePassword) {
    return json<ActionData>({ errorCode: 'unmatchedPassword' });
  }

  const {
    data: { session },
    error,
  } = await signUp(email, password);

  if (error) {
    return json<ActionData>({ error: error.message });
  }

  if (!session) {
    return redirect(`/sign-in?ref=${searchParams.get('ref') || '/'}&code=201-email`);
  }

  const authCookie = await getSessionFromCookie(request.headers.get('Cookie'));

  if (authCookie.has('auth_token')) {
    return redirect(searchParams.get('ref') || request.referrer || '/');
  }

  const payload = await requestPayload(request);
  authCookie.set('auth_token', {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: Date.now() + (session.expires_in - 10) * 1000,
    req_payload: payload,
  });

  return redirect(searchParams.get('ref') || request.referrer || '/', {
    headers: {
      'Set-Cookie': await commitAuthCookie(authCookie),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));

  if (session.has('auth_token')) {
    return redirect(searchParams.get('ref') || request.referrer || '/');
  }

  return null;
};

export const handle = {
  breadcrumb: () => <Link to="/sign-up">Sign Up</Link>,
};

const SignUpPage = () => {
  const actionData = useActionData<ActionData>();

  return (
    <Container fluid justify="center" display="flex">
      <AuthForm type="sign-up" error={actionData?.error} errorCode={actionData?.errorCode} />
    </Container>
  );
};

export default SignUpPage;
