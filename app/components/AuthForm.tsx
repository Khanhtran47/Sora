import { useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Card, Checkbox, Input, Row, Spacer, useInput } from '@nextui-org/react';
import { Form, Link, useLocation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { H2, H4, H5 } from '~/components/styles/Text.styles';
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
    <Form method="post">
      <Card variant="bordered" css={{ mw: '100%', padding: '$5' }} role="form">
        <Card.Header>
          <H2
            h2
            css={{
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
            }}
          >
            {t('welcome')}
          </H2>
        </Card.Header>
        <Card.Body css={{ py: '$10' }}>
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
          <Spacer y={1.5} />
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
              <Spacer y={1.5} />
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
          {error && (
            <H4 h4 color="error">
              {error}
            </H4>
          )}
          {errorCode && (
            <H4 h4 color="error">
              {t(errorCode)}
            </H4>
          )}
          {!error && hasMessage && (
            <H4 h4 color="green">
              {t(code)}
            </H4>
          )}
          <Spacer />
          <Row justify="space-between" align="center">
            {type === 'sign-in' ? (
              <>
                <Link to="/sign-up">
                  <H5 h5 weight="semibold" color="primary">
                    {t('signUp')}
                  </H5>
                </Link>
                <Checkbox>
                  <H5 h5 size={14}>
                    {t('rememberMe')}
                  </H5>
                </Checkbox>
                {/* <H4 h4 size={14}>Forgot password?</H4> */}
              </>
            ) : (
              <Link to="/sign-in">
                <H5 h5 weight="semibold" color="primary">
                  {t('signIn')}
                </H5>
              </Link>
            )}
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row justify="flex-end">
            <Button color="primary" type="submit">
              {type === 'sign-in' ? t('signIn') : t('signUp')}
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    </Form>
  );
};

export default AuthForm;
