import * as React from 'react';
import { Grid, Switch, useTheme, Spacer } from '@nextui-org/react';
import { useTheme as useRemixTheme } from 'next-themes';
import type { User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

/* Assets */
import SunIcon from '~/src/assets/icons/SunIcon.js';
import MoonIcon from '~/src/assets/icons/MoonIcon.js';

/* Components */
import AppBar from './AppBar';
import Logo from './Logo';
import Search from './Search';
import LinkPage from './LinkPage';
import LanguageSelector from './LanguageSelector';
import UserAction from './UserAction';

interface IHeaderProps {
  open: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  user?: User;
}

export const handle = {
  i18n: 'header',
};

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { t } = useTranslation('header');
  const { setTheme } = useRemixTheme();
  const { isDark, theme } = useTheme();
  const { open, handleDrawerOpen, handleDrawerClose, user } = props;

  return (
    <AppBar
      className={`flex justify-between backdrop-blur-md border-b ${
        isDark ? 'bg-black/70 border-b-slate-700' : ' border-b-slate-300 bg-white/70'
      }`}
    >
      {/* button and logo */}
      <Grid
        xs={3}
        alignItems="center"
        css={{
          '@xsMax': {
            justifyContent: 'space-between',
          },
        }}
      >
        <Logo
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
        />
      </Grid>

      {/* link page */}
      <Grid sm={6} alignItems="center">
        <LinkPage t={t} theme={theme} />
      </Grid>

      <Grid xs={6} sm={3} justify="flex-end" alignItems="center">
        <Search theme={theme} />
        <Spacer y={1} />

        <LanguageSelector t={t} />
        <Spacer y={1} />

        {/* Dark/Light mode switcher */}
        <Switch
          checked={isDark}
          size="md"
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          iconOn={<MoonIcon filled />}
          iconOff={<SunIcon filled />}
          css={{
            padding: 0,
            '@xsMax': {
              display: 'none',
            },
          }}
        />
        <Spacer y={1} />

        {/* Avatar */}
        <UserAction user={user} theme={theme} t={t} />
      </Grid>
    </AppBar>
  );
};

export default Header;
