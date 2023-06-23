import AspectRatio from '~/components/elements/AspectRatio';

interface IPlayerErrorProps {
  title: string;
  message: string;
}

const PlayerError = (props: IPlayerErrorProps) => {
  const { title, message } = props;
  return (
    <AspectRatio ratio={7 / 3}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-warning">{title}</h1>
        <p className="text-warning">{message}</p>
      </div>
    </AspectRatio>
  );
};

export default PlayerError;
