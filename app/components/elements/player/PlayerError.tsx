import { Container } from '@nextui-org/react';

import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';
import { H1, H4 } from '~/components/styles/Text.styles';

interface IPlayerErrorProps {
  title: string;
  message: string;
}

const PlayerError = (props: IPlayerErrorProps) => {
  const { title, message } = props;
  return (
    <AspectRatio.Root ratio={7 / 3}>
      <Container
        fluid
        responsive={false}
        direction="column"
        display="flex"
        alignItems="center"
        justify="center"
        css={{ h: '100%' }}
      >
        <H1 h1 color="warning">
          {title}
        </H1>
        <H4 h4 color="warning">
          {message}
        </H4>
      </Container>
    </AspectRatio.Root>
  );
};

export default PlayerError;
