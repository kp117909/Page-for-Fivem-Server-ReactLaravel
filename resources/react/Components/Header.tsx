import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens('dark');

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.blueAccent[50]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

const HeaderSmaller = ({ title, icon}) => {
    const theme = useTheme();
    const colors = tokens('dark');

    return (
      <Box mb="30px">
        <Typography variant="h5"   fontWeight="bold" color={colors.primary[100]}>
          {title} {icon}
        </Typography>
      </Box>
    );
  };

export { Header, HeaderSmaller };
