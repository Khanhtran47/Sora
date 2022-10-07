import { Modal, Loading } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';

import useWindowSize from '~/hooks/useWindowSize';

type SearchSubtitlesProps = {
  visible: boolean;
  closeHandler: () => void;
};

const SearchSubtitles = ({ visible, closeHandler }: SearchSubtitlesProps) => {
  const { width } = useWindowSize();
  return (
    <ClientOnly fallback={<Loading type="default" />}>
      {() => (
        <Modal
          closeButton
          blur
          aria-labelledby="Search Subtitles"
          open={visible}
          onClose={closeHandler}
          className="!max-w-fit"
          width={width && width < 960 ? `${width}px` : '960px'}
        >
          <Modal.Body>
            <div>Search Subtitles</div>
          </Modal.Body>
        </Modal>
      )}
    </ClientOnly>
  );
};

export default SearchSubtitles;
