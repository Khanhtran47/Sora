import { Grid, Row, Text, Link, useTheme } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

const DropdownPage = ({
  pagesDropdown,
}: {
  pagesDropdown: {
    pageName: string;
    pageLink: string;
  }[];
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('header');

  return (
    <Grid.Container
      css={{
        width: 'inherit',
        padding: '0.75rem',
        maxWidth: '200px',
      }}
    >
      {pagesDropdown.map((page) => (
        <Row key={page.pageName}>
          <NavLink to={`/${page.pageLink}`} end>
            {({ isActive }) => (
              <Text
                h1
                size={18}
                css={{
                  textTransform: 'uppercase',
                  display: 'none',
                  '@sm': {
                    display: 'flex',
                  },
                }}
              >
                <Link
                  block
                  color="primary"
                  css={{
                    ...(isActive && {
                      background: `${theme?.colors.primaryLightActive.value}`,
                    }),
                  }}
                >
                  {t(page.pageName)}
                </Link>
              </Text>
            )}
          </NavLink>
        </Row>
      ))}
    </Grid.Container>
  );
};

export default DropdownPage;
