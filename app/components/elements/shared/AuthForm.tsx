import { useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@nextui-org/input';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
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

const AuthForm = ({ type, error, code, errorCode }: IAuthForm) => {
  const { t } = useTranslation('auth');
  const location = useLocation();

  const hasMessage = code === '201-email';
  const inviteCode = new URLSearchParams(location.search).get('code') ?? '';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRePasswordVisible, setIsRePasswordVisible] = useState(false);
  const [value, setValue] = useState<string | undefined>('');

  const validateEmail = (text: string) => text.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const validationState = useMemo(() => {
    if (value === '') return undefined;

    return validateEmail(value ?? '') ? 'valid' : 'invalid';
  }, [value]);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleRePasswordVisibility = () => setIsRePasswordVisible(!isRePasswordVisible);

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
            value={value}
            onValueChange={setValue}
            onClear={() => setValue('')}
            color={
              validationState === 'invalid'
                ? 'danger'
                : validationState === 'valid'
                ? 'success'
                : 'default'
            }
            name="email"
            type="email"
            variant="faded"
            fullWidth
            size="lg"
            placeholder={t('email')}
            aria-label="Email"
            startContent={<MailEdit fill="currentColor" />}
            errorMessage={validationState === 'invalid' && 'Please enter a valid email'}
            validationState={validationState}
          />
          <Spacer y={2.5} />
          <Input
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            variant="faded"
            fullWidth
            color="default"
            size="lg"
            placeholder={t('password')}
            aria-label="Password"
            startContent={<Password fill="currentColor" />}
          />
          {type === 'sign-up' ? (
            <>
              <Spacer y={2.5} />
              <Input
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleRePasswordVisibility}
                  >
                    {isRePasswordVisible ? (
                      <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </button>
                }
                type={isRePasswordVisible ? 'text' : 'password'}
                name="re-password"
                variant="faded"
                fullWidth
                color="default"
                size="lg"
                placeholder={t('confirmPwd')}
                aria-label="Confirm Password"
                startContent={<Password fill="currentColor" />}
              />
              <input type="hidden" name="invite-code" hidden value={inviteCode} />
            </>
          ) : null}
          {error ? <h4 className="text-danger">{error}</h4> : null}
          {errorCode ? <h4 className="text-danger">{t(errorCode)}</h4> : null}
          {!error && hasMessage ? <h4 className="text-success">{t(code)}</h4> : null}
          <div className="flex items-center justify-between">
            {type === 'sign-in' ? (
              <>
                <Link
                  to="/sign-up"
                  className="font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-focus"
                >
                  {t('signUp')}
                </Link>
                <Checkbox>
                  <h6 className="!m-0">{t('rememberMe')}</h6>
                </Checkbox>
              </>
            ) : (
              <Link
                to="/sign-in"
                className="font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-focus"
              >
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
