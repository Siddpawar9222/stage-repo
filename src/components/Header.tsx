import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, useTheme, Avatar, IconButton, Menu, MenuItem, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { lightTheme } from "../utils/theme";

const Header: React.FC<{ styles: any }> = ({ styles }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useTheme();

  return (
    <ThemeProvider theme={lightTheme}>
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{
          textAlign: "start",}} marginLeft={user ? "40px" : "0px"}>
          SSIK
        </Typography>
      </Toolbar>
    </AppBar>
    </ThemeProvider>
  );
};

export default Header;
