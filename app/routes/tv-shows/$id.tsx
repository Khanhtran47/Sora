import { useParams } from '@remix-run/react';

const TvShowDetail = () => {
  const { id } = useParams();
  return (
    <p>
      Hello, there, this is a tv show detail page, <b>id : {id}</b>
    </p>
  );
};

export default TvShowDetail;
