
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from "react";

const StatBox = ({ reason, admin, player, icon, timeat, expired }) => {
  const colors = tokens('dark');

  return (
    <Box width="100%" m="0 20px" p="6px 0">
      <Box display="flex" justifyContent="space-between">
        <Box>
        {icon} BAN NADANY <b className= "color: white">{timeat}</b> DO <b className= "color: white">{expired}</b>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {reason}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h6" sx={{ color: colors.blueAccent[50] }}>
          Admin: {admin}
        </Typography>
        <Typography
          variant="h6"
          fontStyle="italic"
          sx={{ color: colors.blueAccent[50] }}
        >
          Gracz: {player}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
