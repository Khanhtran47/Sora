import { Row } from '@nextui-org/react';

const StaffPage = () => (
  <Row
    fluid
    align="stretch"
    justify="center"
    css={{
      marginTop: '0.75rem',
      padding: '0 0.75rem',
      '@xs': {
        padding: '0 3vw',
      },
      '@sm': {
        padding: '0 6vw',
      },
      '@md': {
        padding: '0 12vw',
      },
    }}
  >
    <h4>In development</h4>
  </Row>
);

export default StaffPage;
