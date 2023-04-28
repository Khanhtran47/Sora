// import { Button, Input } from '@nextui-org/react';
// import { Form } from '@remix-run/react';
// import { toast } from 'sonner';

import usePlayerState from '~/store/player/usePlayerState';
import { DialogHeader, DialogTitle } from '~/components/elements/Dialog';

const AddSubtitles = () => {
  const { updateSubtitleSelector } = usePlayerState((state) => state);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Subtitle</DialogTitle>
      </DialogHeader>
      <div className="w-full">
        {/* <Form className="mb-5 flex flex-row items-center justify-start gap-x-4">
          <Input size="sm" bordered color="primary" type="file" />
        </Form> */}
      </div>
    </>
  );
};

export default AddSubtitles;
