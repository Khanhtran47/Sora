import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import sgConfigs from '~/services/configs.server';
import {
  commitAuthCookie,
  getSessionFromCookie,
  requestPayload,
  signUp,
} from '~/services/supabase';
import encode from '~/utils/encode';
import { addToast, redirectWithToast } from '~/utils/server/toast-session.server';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import AuthForm from '~/components/elements/shared/AuthForm';

type ActionData = {
  errorCode?: string | null;
  error?: string;
};

export const meta = mergeMeta(() => [
  { title: 'Sora - Sign Up' },
  { name: 'description', content: 'Sign up for a Sora account.' },
  { property: 'og:title', content: 'Sora - Sign Up' },
  { property: 'og:description', content: 'Sign up for a Sora account.' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/sign-up' },
  { property: 'twitter:title', content: 'Sora - Sign Up' },
  { property: 'twitter:description', content: 'Sign up for a Sora account.' },
]);

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
    const cookie = await addToast(request, {
      type: 'error',
      title: 'Invalid Email',
      description: 'Please enter a valid email address.',
    });
    return json<ActionData>({ errorCode: 'invalidEmail' }, { headers: { 'Set-Cookie': cookie } });
  }

  if (!password || !rePassword || password !== rePassword) {
    const cookie = await addToast(request, {
      type: 'error',
      title: 'Unmatched Password',
      description: 'Please enter the same password.',
    });
    return json<ActionData>(
      { errorCode: 'unmatchedPassword' },
      { headers: { 'Set-Cookie': cookie } },
    );
  }

  const {
    data: { session },
    error,
  } = await signUp(email, password);

  if (error) {
    const cookie = await addToast(request, {
      type: 'error',
      title: 'Sign Up Failed',
      description: error.message,
    });
    return json<ActionData>({ error: error.message }, { headers: { 'Set-Cookie': cookie } });
  }

  if (!session) {
    return redirectWithToast(
      request,
      `/sign-in?ref=${searchParams.get('ref') || '/'}&code=201-email`,
      {
        type: 'success',
        title: 'Sign Up Successfully',
        description: 'Please confirm your email before log in',
      },
    );
  }

  const authCookie = await getSessionFromCookie(request.headers.get('Cookie'));

  if (authCookie.has('auth_token')) {
    return redirectWithToast(request, searchParams.get('ref') || '/', {
      type: 'error',
      title: 'Sign Up Failed',
      description: 'You are already signed in.',
    });
  }

  const payload = process.env.NODE_ENV === 'production' ? await requestPayload(request) : undefined;
  authCookie.set('auth_token', {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: Date.now() + (session.expires_in - 10) * 1000,
    req_payload: payload,
  });

  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  return redirectWithToast(
    request,
    ref,
    {
      type: 'success',
      title: 'Sign Up Successfully',
      description: 'Welcome to Sora!',
    },
    { headers: { 'Set-Cookie': await commitAuthCookie(authCookie) } },
  );
};

export const loader = async ({ request }: LoaderArgs) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  if (session.has('auth_token')) {
    return redirectWithToast(request, ref, {
      type: 'error',
      title: 'Sign Up Failed',
      description: 'You are already signed in.',
    });
  }

  return null;
};

export const handle: Handle = {
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
