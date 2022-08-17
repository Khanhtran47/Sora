import { NavLink, Link } from '@remix-run/react';
import { Avatar, Dropdown, Link as NextLink, NextUITheme, Text } from '@nextui-org/react';
import { User } from '@supabase/supabase-js';
import { TFunction } from 'react-i18next';

import kleeCute from '~/src/assets/images/klee.jpg';

interface IUserProps {
  user?: User;
  theme?: NextUITheme;
  t: TFunction<'header', undefined>;
}

const UserAction = ({ user, theme, t }: IUserProps) => {
  if (!user) {
    return (
      <NavLink to="/sign-in" end>
        {({ isActive }) => (
          <Text
            h1
            size={14}
            css={{
              textTransform: 'uppercase',
              '@sm': {
                fontSize: '20px',
              },
            }}
          >
            <NextLink
              block
              color="primary"
              css={{
                ...(isActive && {
                  background: `${theme?.colors.primaryLightActive.value}`,
                }),
              }}
            >
              {t('sign-in')}
            </NextLink>
          </Text>
        )}
      </NavLink>
    );
  }

  return (
    <Dropdown placement="bottom-left">
      <Dropdown.Trigger>
        <Avatar
          size="md"
          alt="Klee Cute"
          src={kleeCute}
          color="primary"
          bordered
          css={{ cursor: 'pointer' }}
        />
      </Dropdown.Trigger>
      <Dropdown.Menu color="secondary" aria-label="Avatar Actions">
        <Dropdown.Item key="profile" css={{ height: '$18' }}>
          <Text b color="inherit" css={{ d: 'flex' }}>
            {t('signedInAs')}
          </Text>
          <Text b color="inherit" css={{ d: 'flex' }}>
            {user?.email ?? 'klee@example.com'}
          </Text>
        </Dropdown.Item>
        <Dropdown.Item key="settings" withDivider>
          {t('settings')}
        </Dropdown.Item>
        <Dropdown.Item key="analytics" withDivider>
          {t('analytics')}
        </Dropdown.Item>
        <Dropdown.Item key="system">{t('system')}</Dropdown.Item>
        <Dropdown.Item key="configurations">{t('configs')}</Dropdown.Item>
        <Dropdown.Item key="help_and_feedback" withDivider>
          {t('help&feedback')}
        </Dropdown.Item>
        <Dropdown.Item key="logout" color="error" withDivider>
          <Link to="/sign-out">
            <Text color="error">{t('logout')}</Text>
          </Link>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserAction;
