import { Row, Col } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { H5 } from '~/src/components/styles/Text.styles';

// import useMediaQuery from '~/hooks/useMediaQuery';

interface ITabProps {
  pages?: {
    pageName: string;
    pageLink: string;
  }[];
  linkTo?: string;
}

const Tab = (props: ITabProps) => {
  const { pages, linkTo } = props;
  const { t } = useTranslation();
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
        borderColor: '$primaryLightActive',
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
                ? { borderColor: 'var(--nextui-colors-primary)', height: '50px' }
                : { height: '50px' }
            }
          >
            {({ isActive }) => (
              <H5
                h5
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
                    background: '$primaryLightActive',
                  }),
                  '&:hover': {
                    opacity: '0.8',
                    backgroundColor: '$primaryLightHover',
                  },
                }}
              >
                {t(page.pageName)}
              </H5>
            )}
          </NavLink>
        </Col>
      ))}
    </Row>
  );
};

export default Tab;
