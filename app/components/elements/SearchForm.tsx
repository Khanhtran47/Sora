import { Button, Input, useInput } from '@nextui-org/react';
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
  const { value, bindings } = useInput(defaultValue || '');

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="flex flex-row gap-4 mt-10 mb-4 justify-center items-center w-full"
    >
      <Input
        {...bindings}
        labelPlaceholder={textPlaceHolder}
        clearable
        bordered
        color="primary"
        fullWidth
        helperText={textHelper}
      />
      <Button auto type="submit">
        {textOnButton}
      </Button>
    </Form>
  );
};

export default SearchForm;
