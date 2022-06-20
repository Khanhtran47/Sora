import { useParams } from '@remix-run/react';

const MovieDetail = () => {
  const { id } = useParams();
  return (
    <p>
      Hello, there, this is a movie detail page, <b>id : {id}</b>
    </p>
  );
};

export default MovieDetail;
