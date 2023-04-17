/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Avatar, Button, Divider, Grid, Switch, styled, useTheme } from '@nextui-org/react';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { useTheme as useRemixTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import languages from '~/constants/languages';
/* Components */
import { H5, H6 } from '~/components/styles/Text.styles';
import GlobalIcon from '~/assets/icons/GlobalIcon';
import MoonIcon from '~/assets/icons/MoonIcon';
import SunIcon from '~/assets/icons/SunIcon';
/* Assets */
import kleeCute from '~/assets/images/avatar.png';
import arrowLeft from '~/assets/lotties/lottieflow-arrow-08-1-0072F5-easey.json';

const slideHorizontalAnimation = {
  left: {
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  right: {
    x: -250,
    transition: {
      duration: 0.3,
    },
  },
};

interface IMultiLevelDropdownProps {
  user?: User | undefined;
}

const PlayerStyled = styled(Player, {
  '& path': {
    stroke: '$primary',
  },
});

const MultiLevelDropdown = (props: IMultiLevelDropdownProps) => {
  const { user } = props;
  const { isDark } = useTheme();
  const { setTheme } = useRemixTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [search] = useSearchParams();
  const [isLeftMenu, setIsLeftMenu] = useState(true);
  const [isLanguageTab, setIsLanguageTab] = useState(false);
  const [isDisplayTab, setIsDisplayTab] = useState(false);
  const { t } = useTranslation('header');

  const ref = (search.get('ref') || location.pathname + location.search)
    .replace('?', '_0x3F_')
    .replace('&', '_0x26');
  const parts = user?.email?.split('@');
  const username = parts?.shift();

  return (
    <motion.div
      className="dropdown"
      initial="left"
      animate={isLeftMenu ? 'left' : 'right'}
      variants={slideHorizontalAnimation}
      layout
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: '100%',
        position: 'relative',
        transition: 'height 0.3s',
        width: '240px',
        transform: `${isLeftMenu ? 'none' : ' translateZ(0px) translateX(-250px)'}`,
      }}
    >
      <motion.div>
        <Grid.Container css={{ flexDirection: 'column' }}>
          <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
            <Button
              type="button"
              light
              color="primary"
              size="md"
              css={{ w: 220, h: 50 }}
              icon={
                <Avatar
                  size="md"
                  alt="Klee Cute"
                  src={kleeCute}
                  color="primary"
                  bordered
                  css={{ cursor: 'pointer' }}
                />
              }
              onPress={() => {
                if (!user) navigate(`/sign-in?ref=${ref}`);
              }}
            >
              {user ? (
                <H6
                  h6
                  weight="bold"
                  color="primary"
                  className="line-clamp-1"
                  css={{ marginLeft: '3.5rem !important' }}
                >
                  {username ?? 'klee@example.com'}
                </H6>
              ) : (
                <H6 h6 weight="bold" color="primary" css={{ textTransform: 'uppercase' }}>
                  Sign In
                </H6>
              )}
            </Button>
            <Divider x={1} css={{ width: 220, margin: '10px 40px 0 0' }} />
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
            <Button
              type="button"
              flat
              color="primary"
              size="md"
              onPress={() => {
                setIsLanguageTab(true);
                setIsLeftMenu(false);
              }}
              css={{ w: 220, h: 50 }}
              icon={<GlobalIcon />}
            >
              <H6 h6 color="primary">
                Language
              </H6>
            </Button>
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
            <Button
              type="button"
              flat
              color="primary"
              size="md"
              onPress={() => {
                setIsDisplayTab(true);
                setIsLeftMenu(false);
              }}
              css={{ w: 220, h: 50 }}
            >
              <H6 h6 color="primary">
                Display
              </H6>
            </Button>
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
            {user ? (
              <Button
                type="button"
                flat
                color="error"
                size="md"
                onPress={() => {
                  navigate(`/sign-out?ref=${ref}`);
                }}
                css={{ w: 220, h: 50 }}
              >
                <H5 h5 color="error">
                  Log out
                </H5>
              </Button>
            ) : (
              <Button
                type="button"
                flat
                color="primary"
                size="md"
                onPress={() => {
                  navigate(`/sign-up?ref=${ref}`);
                }}
                css={{ w: 220, h: 50 }}
              >
                Sign Up
              </Button>
            )}
          </Grid>
        </Grid.Container>
      </motion.div>
      <motion.div>
        <Grid.Container css={{ flexDirection: 'column' }}>
          {isLanguageTab && (
            <>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  light
                  color="primary"
                  size="md"
                  onPress={() => {
                    setIsLanguageTab(false);
                    setIsLeftMenu(true);
                  }}
                  css={{ w: 220, h: 50 }}
                  icon={
                    <PlayerStyled
                      src={arrowLeft}
                      hover
                      autoplay={false}
                      speed={0.75}
                      className="h-8 w-8"
                      loop
                    />
                  }
                >
                  <H6 h6 color="primary">
                    Language
                  </H6>
                </Button>
                <Divider x={1} css={{ width: 220, margin: '10px 40px 0 0' }} />
              </Grid>
              {languages.map((lng) => (
                <Grid
                  key={lng}
                  css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}
                >
                  <Button
                    type="button"
                    flat
                    color="primary"
                    size="md"
                    onPress={() => {
                      setIsLanguageTab(false);
                      setIsLeftMenu(true);
                      navigate(`${location.pathname}?lng=${lng}`);
                    }}
                    css={{ w: 220, h: 50 }}
                  >
                    <H6 h6 color="primary">
                      {t(lng)}
                    </H6>
                  </Button>
                </Grid>
              ))}
            </>
          )}
          {isDisplayTab && (
            <>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  light
                  color="primary"
                  size="md"
                  onPress={() => {
                    setIsDisplayTab(false);
                    setIsLeftMenu(true);
                  }}
                  css={{ w: 220, h: 50 }}
                  icon={
                    <PlayerStyled
                      src={arrowLeft}
                      hover
                      autoplay={false}
                      speed={0.75}
                      className="h-8 w-8"
                      loop
                    />
                  }
                >
                  <H6 h6 color="primary">
                    Display
                  </H6>
                </Button>
                <Divider x={1} css={{ width: 220, margin: '10px 40px 0 0' }} />
              </Grid>
              <Grid
                direction="row"
                justify="space-around"
                alignItems="center"
                css={{
                  display: 'flex',
                  width: 240,
                  minHeight: 65,
                }}
              >
                <H6 h6>Light mode</H6>
                <Switch
                  checked={isDark}
                  size="md"
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                  iconOn={<MoonIcon filled />}
                  iconOff={<SunIcon filled />}
                  css={{ padding: 0 }}
                />
                <H6 h6>Dark mode</H6>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  flat
                  size="md"
                  onPress={() => {
                    setTheme('light');
                    setTheme('bumblebee');
                  }}
                  css={{
                    w: 220,
                    h: 50,
                    color: '#C08921 !important',
                    backgroundColor: '#FBEAAB !important',
                  }}
                >
                  Bumblebee
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  flat
                  size="md"
                  onPress={() => {
                    setTheme('dark');
                    setTheme('synthwave');
                  }}
                  css={{
                    w: 220,
                    h: 50,
                    color: '#D427A5 !important',
                    backgroundColor: '#FEAEC9 !important',
                  }}
                >
                  Synthwave
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  flat
                  size="md"
                  onPress={() => {
                    setTheme('light');
                    setTheme('retro');
                  }}
                  css={{
                    w: 220,
                    h: 50,
                    color: '#CD6C70 !important',
                    backgroundColor: '#FDE2D7 !important',
                  }}
                >
                  Retro
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  flat
                  size="md"
                  onPress={() => {
                    setTheme('dark');
                    setTheme('dracula');
                  }}
                  css={{
                    w: 220,
                    h: 50,
                    color: '#DB58B0 !important',
                    backgroundColor: '#FFC9D8 !important',
                  }}
                >
                  Dracula
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  flat
                  size="md"
                  onPress={() => {
                    setTheme('light');
                    setTheme('autumn');
                  }}
                  css={{
                    w: 220,
                    h: 50,
                    color: '#78022C !important',
                    backgroundColor: '#F39694 !important',
                  }}
                >
                  Autumn
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 240, minHeight: 65, display: 'block' }}>
                <Button
                  type="button"
                  flat
                  size="md"
                  onPress={() => {
                    setTheme('dark');
                    setTheme('night');
                  }}
                  css={{
                    w: 220,
                    h: 50,
                    color: '#2894D5 !important',
                    backgroundColor: '#AFF5FE !important',
                  }}
                >
                  Night
                </Button>
              </Grid>
            </>
          )}
        </Grid.Container>
      </motion.div>
    </motion.div>
  );
};

export default MultiLevelDropdown;
