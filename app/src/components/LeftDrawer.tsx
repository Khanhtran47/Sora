import * as React from 'react';
import { Link } from '@remix-run/react';
import { Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded';
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

/* Components */
import Drawer from './Drawer';
import DrawerHeader from './DrawerHeader';

interface ILeftDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
  theme: Theme;
}

const LeftDrawer: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const { open, handleDrawerClose, theme } = props;
  const iconItem = (index: number) => {
    let icon;
    switch (index) {
      case 0:
        icon = <WhatshotRoundedIcon />;
        break;
      case 1:
        icon = <RecommendRoundedIcon />;
        break;
      case 2:
        icon = <NewReleasesRoundedIcon />;
        break;
      case 3:
        icon = <EmojiEventsRoundedIcon />;
        break;
      case 4:
        icon = <HistoryRoundedIcon />;
        break;
      default:
    }
    return icon;
  };
  const leftDrawerLink = [
    {
      pageName: 'Trending',
      pageLink: 'trending',
    },
    {
      pageName: 'Recommendations',
      pageLink: 'recommendations',
    },
    {
      pageName: 'New Releases',
      pageLink: 'new-releases',
    },
    {
      pageName: 'IMDB Top',
      pageLink: 'imdb-top',
    },
    {
      pageName: 'Watch History',
      pageLink: 'watch-history',
    },
  ];
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <List>
        {leftDrawerLink.map((page, index: number) => (
          <ListItem key={page.pageName} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Link to={`/${page.pageLink}`}>{iconItem(index)}</Link>
              </ListItemIcon>
              <ListItemText primary={page.pageName} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            <Divider />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default LeftDrawer;
