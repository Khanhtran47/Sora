import { json, redirect, type ActionArgs, type LoaderArgs } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import sgConfigs from '~/services/configs.server';
import {
  commitAuthCookie,
  getSessionFromCookie,
  requestPayload,
  signUp,
} from '~/services/supabase';
import encode from '~/utils/encode';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import AuthForm from '~/components/elements/shared/AuthForm';

type ActionData = {
  errorCode?: string | null;
  error?: string;
};

export const action = async ({ request }: ActionArgs) => {
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

  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email)) {
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
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  if (session.has('auth_token')) {
    return redirect(ref);
  }

  return null;
};

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/sign-up" key="sign-up">
      Sign Up
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Sign Up',
    showImage: false,
  }),
};

const SignUpPage = () => {
  const actionData = useActionData<ActionData>();

  return <AuthForm type="sign-up" error={actionData?.error} errorCode={actionData?.errorCode} />;
};

export default SignUpPage;
