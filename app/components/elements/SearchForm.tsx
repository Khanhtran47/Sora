import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Form } from '@remix-run/react';

interface ISearchForm {
  onSubmit: (value: string) => void;
  textPlaceHolder?: string;
  textHelper?: string;
  textOnButton: string;
  defaultValue?: string;
}

const SearchForm = (props: ISearchForm) => {
  const { onSubmit, textOnButton, textHelper, textPlaceHolder, defaultValue } = props;
  const [value, setValue] = useState<string | undefined>(defaultValue ?? '');

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value ?? '');
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="mb-4 mt-10 flex w-full flex-row items-start justify-center gap-4"
    >
      <Input
        value={value}
        onValueChange={setValue}
        onClear={() => setValue('')}
        label={textPlaceHolder}
        variant="faded"
        color="default"
        fullWidth
        description={textHelper}
      />
      <Button color="primary" type="submit" size="lg" className="h-[3.4rem]">
        {textOnButton}
      </Button>
    </Form>
  );
};

export default SearchForm;
