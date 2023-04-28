import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';

import { getExt } from '~/utils/file';
import usePlayerState from '~/store/player/usePlayerState';
import { DialogHeader, DialogTitle } from '~/components/elements/Dialog';

const AddSubtitles = () => {
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [subtitle, setSubtitle] = useState<File | null>(null);
  const { updateSubtitleSelector } = usePlayerState((state) => state);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = getExt(file.name);
    if (!type || !['ass', 'vtt', 'srt'].includes(type)) {
      toast.error('Invalid file type', {
        description: 'Type support: .srt, .vtt, .ass',
        duration: 5000,
      });
      return;
    }
    setDisabledSubmit(false);
    setSubtitle(file);
  };

  const handleSubtitleSubmit = () => {
    if (subtitle) {
      const type = getExt(subtitle.name);
      const url = URL.createObjectURL(subtitle);
      const newSubtitle = [
        {
          html: subtitle.name,
          url,
          type,
        },
      ];
      updateSubtitleSelector(newSubtitle);
      toast.success('Open Subtitle', {
        description: 'Subtitle added successfully',
        duration: 3000,
      });
      setDisabledSubmit(true);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Subtitle</DialogTitle>
      </DialogHeader>
      <div className="w-full">
        <div className="mb-5 flex flex-col items-center justify-start gap-x-4 sm:flex-row">
          <input
            type="file"
            id="subtitle"
            name="subtitle"
            accept=".srt,.vtt,.ass"
            onChange={(e) => handleFileChange(e)}
            className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-alpha focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
          <Button
            type="submit"
            auto
            disabled={disabledSubmit}
            onPress={() => handleSubtitleSubmit()}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddSubtitles;
