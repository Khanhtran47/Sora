import { Tooltip, Link, NextUITheme } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';

import SearchIcon from '~/src/assets/icons/SearchIcon.js';
import DropdownPage from './DropdownPage';

const searchDropdown = [
  { pageName: 'searchMovie', pageLink: 'search/movie' },
  { pageName: 'searchTv', pageLink: 'search/tv' },
  { pageName: 'searchPeople', pageLink: 'search/people' },
];

interface ISearchProps {
  theme?: NextUITheme;
}

const Search = ({ theme }: ISearchProps) => (
  <Tooltip placement="bottom" content={<DropdownPage pagesDropdown={searchDropdown || []} />}>
    <NavLink to="/search" end style={{ marginTop: '3px' }}>
      {({ isActive }) => (
        <Link
          block
          color="primary"
          css={{
            ...(isActive && {
              background: `${theme?.colors.primaryLightActive.value}`,
            }),
          }}
        >
          <SearchIcon fill="currentColor" filled />
        </Link>
      )}
    </NavLink>
  </Tooltip>
);

export default Search;
