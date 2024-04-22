import React, { FC, ReactElement } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import BlockIcon from '@mui/icons-material/Block';
export const Footer: FC = (): ReactElement => {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
    <BottomNavigation
      sx = {{ backgroundColor:"#3e4396"}}
      showLabels
      className="fixed bottom-0 left-0 w-full"
      >
      <BottomNavigationAction label="Copyright MajorkaRP" icon={<PeopleIcon sx={{  }} />} />
    </BottomNavigation>
  </Paper>
  );
};

export default Footer;
