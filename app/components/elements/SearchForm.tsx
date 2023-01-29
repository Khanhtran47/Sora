import { Button, Grid, Input, useInput } from '@nextui-org/react';
import { Form } from '@remix-run/react';

interface ISearchForm {
  onSubmit: (value: string) => void;
  textPlaceHolder: string;
  textHelper: string;
  textOnButton: string;
}

const SearchForm = (props: ISearchForm) => {
  const { value, bindings } = useInput('');
  const { onSubmit, textOnButton, textHelper, textPlaceHolder } = props;

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <Form onSubmit={submitHandler}>
      <Grid.Container gap={1} css={{ m: 0, padding: '30px 10px', width: '100%' }}>
        <Grid>
          <Input
            {...bindings}
            labelPlaceholder={textPlaceHolder}
            clearable
            bordered
            color="primary"
            fullWidth
            helperText={textHelper}
          />
        </Grid>
        <Grid>
          <Button auto type="submit">
            {textOnButton}
          </Button>
        </Grid>
      </Grid.Container>
    </Form>
  );
};

export default SearchForm;
