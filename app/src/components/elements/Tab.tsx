import { Row, Col, Text, useTheme } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';

// import useMediaQuery from '~/hooks/useMediaQuery';

interface ITabProps {
  pages: {
    pageName: string;
    pageLink: string;
  }[];
  linkTo: string;
}

const Tab = (props: ITabProps) => {
  const { pages, linkTo } = props;
  const { theme } = useTheme();
  // const isMd = useMediaQuery(960);
  return (
    <Row
      className="border-b"
      align="center"
      justify="flex-start"
      css={{
        p: 0,
        gap: '$lg',
        overflowX: 'auto',
        flexFlow: 'row nowrap',
        width: '100%',
        margin: 'auto 0 0 0',
        borderColor: `${theme?.colors.primaryLightActive.value}`,
      }}
    >
      {pages?.map((page, index) => (
        <Col
          key={`row-item-${index}`}
          css={{
            flexGrow: '1',
            flexShrink: '0',
            dflex: 'center',
            width: 'max-content',
          }}
        >
          <NavLink
            to={`${linkTo}${page.pageLink}`}
            className={({ isActive }) => `${isActive ? 'border-b-2 border-solid' : ''}`}
            style={({ isActive }) =>
              isActive
                ? { borderColor: `${theme?.colors.primary.value}`, height: '50px' }
                : { height: '50px' }
            }
          >
            {({ isActive }) => (
              <Text
                h4
                size={16}
                weight="bold"
                transform="uppercase"
                color="primary"
                css={{
                  height: '40px',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '14px',
                  alignItems: 'center',
                  transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
                  ...(isActive && {
                    background: `${theme?.colors.primaryLightActive.value}`,
                  }),
                  '&:hover': {
                    opacity: '0.8',
                    backgroundColor: `${theme?.colors.primaryLightHover.value}`,
                  },
                  '@xs': {
                    fontSize: '18px',
                  },
                  '@sm': {
                    fontSize: '20px',
                  },
                }}
              >
                {page.pageName}
              </Text>
            )}
          </NavLink>
        </Col>
      ))}
    </Row>
  );
};

export default Tab;
