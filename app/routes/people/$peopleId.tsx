import { useParams } from '@remix-run/react';
import { Container, Text } from '@nextui-org/react';

const PeopleDetail = () => {
  const { peopleId } = useParams();
  return (
    <Container
      css={{
        margin: 0,
        paddingTop: '92px',
        paddingLeft: '88px',
      }}
    >
      <Text>
        Hello, there, this is a people detail page, <b>id : {peopleId}</b>
      </Text>
    </Container>
  );
};

export default PeopleDetail;
