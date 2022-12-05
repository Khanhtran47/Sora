/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';
import { Avatar, Button, Grid, Switch, useTheme, Divider } from '@nextui-org/react';
import { useTheme as useRemixTheme } from 'next-themes';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

/* Components */
import { H5, H6 } from '~/src/components/styles/Text.styles';
import { PlayerStyled } from './Layout.styles';

/* Assets */
import kleeCute from '../../assets/images/avatar.png';
import SunIcon from '../../assets/icons/SunIcon.js';
import MoonIcon from '../../assets/icons/MoonIcon.js';
import GlobalIcon from '../../assets/icons/GlobalIcon.js';
import arrowLeft from '../../assets/lotties/lottieflow-arrow-08-1-0072F5-easey.json';

const slideHorizontalAnimation = {
  left: {
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  right: {
    x: -290,
    transition: {
      duration: 0.3,
    },
  },
};

const languages = ['en', 'fr', 'vi'];

const MultiLevelDropdown = ({ user }: { user: User | undefined }) => {
  const { isDark } = useTheme();
  const { setTheme } = useRemixTheme();
  const navigate = useNavigate();
  const [isLeftMenu, setIsLeftMenu] = React.useState(true);
  const [isLanguageTab, setIsLanguageTab] = React.useState(false);
  const [isDisplayTab, setIsDisplayTab] = React.useState(false);
  const { t } = useTranslation('header');

  const location = useLocation();
  const [search] = useSearchParams();

  const ref = (search.get('ref') || location.pathname + location.search)
    .replace('?', '_0x3F_')
    .replace('&', '_0x26');

  return (
    <motion.div
      className="dropdown"
      initial="left"
      animate={isLeftMenu ? 'left' : 'right'}
      variants={slideHorizontalAnimation}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: '100%',
        position: 'relative',
        transition: 'height 0.3s',
        width: '590px',
        transform: `${isLeftMenu ? 'none' : ' translateZ(0px) translateX(-290px)'}`,
      }}
    >
      <motion.div>
        <Grid.Container
          css={{
            flexDirection: 'column',
          }}
        >
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            <Button
              light
              color="primary"
              size="md"
              css={{ w: 260, h: 50 }}
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
              onClick={() => {
                if (!user) navigate(`/sign-in?ref=${ref}`);
              }}
            >
              {user ? (
                <H6 h6 weight="bold" color="primary" css={{ marginLeft: '3.5rem !important' }}>
                  {user?.email ?? 'klee@example.com'}
                </H6>
              ) : (
                <H6 h6 weight="bold" color="primary" css={{ textTransform: 'uppercase' }}>
                  Sign In
                </H6>
              )}
            </Button>
            <Divider x={1} css={{ width: 260, margin: '10px 40px 0 0' }} />
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            <Button
              flat
              color="primary"
              size="md"
              onClick={() => {
                setIsLanguageTab(true);
                setIsLeftMenu(false);
              }}
              css={{ w: 260, h: 50 }}
              icon={<GlobalIcon />}
            >
              <H6 h6 color="primary">
                Language
              </H6>
            </Button>
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            <Button
              flat
              color="primary"
              size="md"
              onClick={() => {
                setIsDisplayTab(true);
                setIsLeftMenu(false);
              }}
              css={{ w: 260, h: 50 }}
            >
              <H6 h6 color="primary">
                Display
              </H6>
            </Button>
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            {user ? (
              <Button
                flat
                color="error"
                size="md"
                onClick={() => {
                  navigate(`/sign-out?ref=${ref}`);
                }}
                css={{ w: 260, h: 50 }}
              >
                <H5 h5 color="error">
                  Log out
                </H5>
              </Button>
            ) : (
              <Button
                flat
                color="primary"
                size="md"
                onClick={() => {
                  navigate(`/sign-up?ref=${ref}`);
                }}
                css={{ w: 260, h: 50 }}
              >
                Sign Up
              </Button>
            )}
          </Grid>
        </Grid.Container>
      </motion.div>
      <motion.div>
        <Grid.Container
          css={{
            flexDirection: 'column',
          }}
        >
          {isLanguageTab && (
            <>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  light
                  color="primary"
                  size="md"
                  onClick={() => {
                    setIsLanguageTab(false);
                    setIsLeftMenu(true);
                  }}
                  css={{ w: 260, h: 50 }}
                  icon={
                    <PlayerStyled
                      src={arrowLeft}
                      hover
                      autoplay={false}
                      speed={0.75}
                      className="w-8 h-8"
                      loop
                    />
                  }
                >
                  <H6 h6 color="primary">
                    Language
                  </H6>
                </Button>
                <Divider x={1} css={{ width: 260, margin: '10px 40px 0 0' }} />
              </Grid>
              {languages.map((lng) => (
                <Grid
                  key={lng}
                  css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}
                >
                  <Button
                    flat
                    color="primary"
                    size="md"
                    onClick={() => {
                      setIsLanguageTab(false);
                      setIsLeftMenu(true);
                      navigate(`${location.pathname}?lng=${lng}`);
                    }}
                    css={{ w: 260, h: 50 }}
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
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  light
                  color="primary"
                  size="md"
                  onClick={() => {
                    setIsDisplayTab(false);
                    setIsLeftMenu(true);
                  }}
                  css={{ w: 260, h: 50 }}
                  icon={
                    <PlayerStyled
                      src={arrowLeft}
                      hover
                      autoplay={false}
                      speed={0.75}
                      className="w-8 h-8"
                      loop
                    />
                  }
                >
                  <H6 h6 color="primary">
                    Display
                  </H6>
                </Button>
                <Divider x={1} css={{ width: 260, margin: '10px 40px 0 0' }} />
              </Grid>
              <Grid
                direction="row"
                justify="space-around"
                alignItems="center"
                css={{
                  display: 'flex',
                  width: 280,
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
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  size="md"
                  onClick={() => {
                    setTheme('light');
                    setTheme('bumblebee');
                  }}
                  css={{
                    w: 260,
                    h: 50,
                    color: '#C08921 !important',
                    backgroundColor: '#FBEAAB !important',
                  }}
                >
                  Bumblebee Theme
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  size="md"
                  onClick={() => {
                    setTheme('dark');
                    setTheme('synthwave');
                  }}
                  css={{
                    w: 260,
                    h: 50,
                    color: '#D427A5 !important',
                    backgroundColor: '#FEAEC9 !important',
                  }}
                >
                  Synthwave Theme
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  size="md"
                  onClick={() => {
                    setTheme('light');
                    setTheme('retro');
                  }}
                  css={{
                    w: 260,
                    h: 50,
                    color: '#CD6C70 !important',
                    backgroundColor: '#FDE2D7 !important',
                  }}
                >
                  Retro Theme
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  size="md"
                  onClick={() => {
                    setTheme('dark');
                    setTheme('dracula');
                  }}
                  css={{
                    w: 260,
                    h: 50,
                    color: '#DB58B0 !important',
                    backgroundColor: '#FFC9D8 !important',
                  }}
                >
                  Dracula Theme
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  size="md"
                  onClick={() => {
                    setTheme('light');
                    setTheme('autumn');
                  }}
                  css={{
                    w: 260,
                    h: 50,
                    color: '#78022C !important',
                    backgroundColor: '#F39694 !important',
                  }}
                >
                  Autumn Theme
                </Button>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  size="md"
                  onClick={() => {
                    setTheme('dark');
                    setTheme('night');
                  }}
                  css={{
                    w: 260,
                    h: 50,
                    color: '#2894D5 !important',
                    backgroundColor: '#AFF5FE !important',
                  }}
                >
                  Night Theme
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
