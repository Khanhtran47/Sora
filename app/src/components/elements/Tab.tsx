import { Row, Col, Text, Link as NextLink, useTheme } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';

import useMediaQuery from '~/hooks/useMediaQuery';

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
  const isMd = useMediaQuery(960);
  return (
    <Row
      fluid
      className="border-b"
      align="center"
      justify="flex-start"
      css={{
        p: 0,
        gap: '$lg',
        overflowX: 'auto',
        flexFlow: 'row nowrap',
        width: `${isMd ? '100%' : '70%'}`,
        margin: 'auto 0 0 0',
        borderColor: `${theme?.colors.primaryLightActive.value}`,
      }}
    >
      {pages?.map((page, index) => (
        <Col
          key={`row-item-${index}`}
          css={{
            dflex: 'center',
          }}
        >
          <NavLink
            to={`${linkTo}${page.pageLink}`}
            className={({ isActive }) => `${isActive ? 'border-b-2 border-solid' : ''}`}
            style={({ isActive }) =>
              isActive ? { borderColor: `${theme?.colors.primary.value}` } : {}
            }
          >
            {({ isActive }) => (
              <Text
                h1
                size={20}
                css={{
                  textTransform: 'uppercase',
                }}
              >
                <NextLink
                  block
                  color="primary"
                  css={{
                    height: '45px',
                    borderRadius: '14px 14px 0 0',
                    alignItems: 'center',
                    ...(isActive && {
                      background: `${theme?.colors.primaryLightActive.value}`,
                    }),
                  }}
                >
                  {page.pageName}
                </NextLink>
              </Text>
            )}
          </NavLink>
        </Col>
      ))}
    </Row>
  );
};

export default Tab;
