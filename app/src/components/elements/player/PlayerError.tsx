import { Container } from '@nextui-org/react';

import { H1, H4 } from '~/src/components/styles/Text.styles';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';

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
