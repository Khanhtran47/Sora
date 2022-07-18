import { Form, Link } from '@remix-run/react';
import { Card, Button, Text, Input, Row, Checkbox, Spacer } from '@nextui-org/react';

import Mail from '../assets/icons/Mail.js';
import Password from '../assets/icons/Password.js';

interface IAuthForm {
  type: 'sign-in' | 'sign-up';
  error: string | null;
}

const AuthModal = ({ type, error }: IAuthForm) => (
  <Form method="post">
    <Card isHoverable variant="bordered" css={{ mw: '100%', padding: '$5' }}>
      <Card.Header>
        <Text
          h1
          size={30}
          css={{
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
          }}
          weight="bold"
        >
          Welcome to Remix Movie
        </Text>
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
          placeholder="Email"
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
          placeholder="Password"
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
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              contentLeft={<Password fill="currentColor" />}
            />
          </>
        )}
        {error && <Text color="error">{error}</Text>}
        <Spacer />
        <Row justify="space-between">
          {type === 'sign-in' ? (
            <>
              <Link to="/sign-up">
                <Text color="primary">Sign Up</Text>
              </Link>
              <Checkbox>
                <Text size={14}>Remember me</Text>
              </Checkbox>
              {/* <Text size={14}>Forgot password?</Text> */}
            </>
          ) : (
            <Link to="/sign-in">
              <Text color="primary">Sign In</Text>
            </Link>
          )}
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row justify="flex-end">
          <Button size="sm" type="submit">
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </Button>
        </Row>
      </Card.Footer>
    </Card>
  </Form>
);

export default AuthModal;
