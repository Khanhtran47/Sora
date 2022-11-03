import { Form, Link } from '@remix-run/react';
import { Card, Button, Input, Row, Checkbox, Spacer } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { H2, H4, H5 } from '~/src/components/styles/Text.styles';

import Mail from '../assets/icons/Mail.js';
import Password from '../assets/icons/Password.js';

interface IAuthForm {
  type: 'sign-in' | 'sign-up';
  error?: string | null;
  code?: string | null;
}

export const handle = {
  i18n: 'auth',
};

const AuthForm = ({ type, error, code }: IAuthForm) => {
  const { t } = useTranslation('auth');
  const hasMessage = code === '201-email';

  return (
    <Form method="post">
      <Card variant="bordered" css={{ mw: '100%', padding: '$5' }}>
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
            name="email"
            type="email"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder={t('email')}
            aria-label="Email"
            contentLeft={<Mail fill="currentColor" />}
          />
          <Spacer />
          <Input
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
              <Spacer />
              <Input
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
            </>
          )}
          {error && (
            <H4 h4 color="error">
              {error}
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
                  <H4 h4 color="primary">
                    {t('signUp')}
                  </H4>
                </Link>
                <Checkbox>
                  <H5 h5>{t('rememberMe')}</H5>
                </Checkbox>
                {/* <H4 h4 size={14}>Forgot password?</H4> */}
              </>
            ) : (
              <Link to="/sign-in">
                <H4 h4 color="primary">
                  {t('signIn')}
                </H4>
              </Link>
            )}
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row justify="flex-end">
            <Button size="sm" type="submit">
              {type === 'sign-in' ? t('signIn') : t('signUp')}
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    </Form>
  );
};

export default AuthForm;
