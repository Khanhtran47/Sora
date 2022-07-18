import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getSession, commitSession } from '~/services/sessions.server';
import { signIn } from '~/services/auth.server';
import AuthForm from '~/src/components/AuthForm';

type ActionData = {
  error: string | null;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.clone().formData();

  const email = data.get('email')?.toString();
  const password = data.get('password')?.toString();

  if (!email || !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    return json<ActionData>({ error: 'Please enter a valid email!' });
  }

  if (!password) {
    return json<ActionData>({ error: 'Password is required!' });
  }

  const { session: supaSession, error } = await signIn(email, password);

  if (error) {
    return json<ActionData>({ error: error.message });
  }

  const curSession = await getSession(request.headers.get('Cookie'));

  if (curSession.has('access_token')) {
    return redirect('/');
  }

  curSession.set('access_token', supaSession?.access_token);

  return redirect(request.referrer ?? '/', {
    headers: {
      'Set-Cookie': await commitSession(curSession),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('access_token')) {
    return redirect('/');
  }

  return null;
};

const SignInPage = () => {
  const actionData = useActionData<ActionData>();
  return (
    <Container fluid justify="center" display="flex">
      <AuthForm type="sign-in" error={actionData?.error ?? null} />
    </Container>
  );
};

export default SignInPage;
