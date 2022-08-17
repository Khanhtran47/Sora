import { Link } from '@remix-run/react';
import { Avatar, Dropdown } from '@nextui-org/react';
import { TFunction } from 'react-i18next';
import GlobalIcon from '~/src/assets/icons/GlobalIcon.js';

const languages = ['en', 'fr', 'vi'];

interface IProps {
  t: TFunction<'header', undefined>;
}

const LanguageSelector = ({ t }: IProps) => (
  <Dropdown placement="bottom-left">
    <Dropdown.Trigger>
      <Avatar squared icon={<GlobalIcon fill="currentColor" />} />
    </Dropdown.Trigger>
    <Dropdown.Menu color="primary" aria-label="Languages">
      {languages.map((lng) => (
        <Dropdown.Item key={lng}>
          <Link key={lng} to={`/?lng=${lng}`}>
            {t(lng)}
          </Link>
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default LanguageSelector;
