import { useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Checkbox, Input, useInput } from '@nextui-org/react';
import { Spacer } from '@nextui-org/spacer';
import { Form, Link, useLocation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import MailEdit from '~/assets/icons/MailEditIcon';
import Password from '~/assets/icons/Password';

interface IAuthForm {
  type: 'sign-in' | 'sign-up';
  error?: string | null;
  errorCode?: string | null;
  code?: string | null;
}

export const handle = {
  i18n: 'auth',
};

const AuthForm = ({ type, error, code, errorCode }: IAuthForm) => {
  const { t } = useTranslation('auth');
  const location = useLocation();

  const hasMessage = code === '201-email';
  const inviteCode = new URLSearchParams(location.search).get('code') ?? '';

  const { value, reset, bindings } = useInput('');

  const validateEmail = (text: string) => text.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const helper: {
    text: string;
    color: 'error' | 'default' | 'primary' | 'secondary' | 'success' | 'warning' | undefined;
  } = useMemo(() => {
    if (!value)
      return {
        text: '',
        color: undefined,
      };
    const isValid = validateEmail(value);
    return {
      text: isValid ? 'Correct email' : 'Enter a valid email',
      color: isValid ? 'success' : 'error',
    };
  }, [value]);

  return (
    <Form method="post" className="flex w-full justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex w-full justify-center">
          <h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('welcome')}
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-y-3 py-4">
          <Input
            {...bindings}
            clearable
            shadow={false}
            onClearClick={reset}
            status={helper.color}
            color={helper.color}
            helperColor={helper.color}
            helperText={helper.text}
            name="email"
            type="email"
            bordered
            fullWidth
            size="lg"
            placeholder={t('email')}
            aria-label="Email"
            contentLeft={<MailEdit fill="currentColor" />}
          />
          <Spacer y={2.5} />
          <Input.Password
            name="password"
            type="password"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder={t('password')}
            aria-label="Password"
            contentLeft={<Password fill="currentColor" />}
          />
          {type === 'sign-up' && (
            <>
              <Spacer y={2.5} />
              <Input.Password
                name="re-password"
                type="password"
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder={t('confirmPwd')}
                aria-label="Confirm Password"
                contentLeft={<Password fill="currentColor" />}
              />
              <input type="hidden" name="invite-code" hidden value={inviteCode} />
            </>
          )}
          {error ? <h4 className="text-danger">{error}</h4> : null}
          {errorCode ? <h4 className="text-danger">{t(errorCode)}</h4> : null}
          {!error && hasMessage ? <h4 className="text-success">{t(code)}</h4> : null}
          <div className="flex items-center justify-between">
            {type === 'sign-in' ? (
              <>
                <Link to="/sign-up" className="font-semibold text-primary">
                  {t('signUp')}
                </Link>
                <Checkbox>
                  <h6 className="!m-0">{t('rememberMe')}</h6>
                </Checkbox>
              </>
            ) : (
              <Link to="/sign-in" className="font-semibold text-primary">
                {t('signIn')}
              </Link>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-end p-5">
          <Button color="primary" type="submit" size="lg">
            {type === 'sign-in' ? t('signIn') : t('signUp')}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default AuthForm;
