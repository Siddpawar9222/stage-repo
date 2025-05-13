import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer: React.FC = () => {
  const theme = useTheme();

  let backgroundColor = theme.palette.primary.main; 
  let color = theme.palette.customText.main;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        paddingTop: 2,
        paddingBottom: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} All rights Reserved !
      </Typography>
    </Box>
  );
};

export default Footer;