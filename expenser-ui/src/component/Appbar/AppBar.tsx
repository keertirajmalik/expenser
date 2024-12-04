import ExpenseButtonMenu from "@/component/AppBar/ExpenseButton";
import ProfileMenu from "@/component/AppBar/ProfileMenu";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import React from "react";

export default function Appbar(): React.ReactElement {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1c2543",
      }}
    >
      <Toolbar component="nav" aria-label="main navigation">
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Typography variant="h6" component="div">
            Expenser
          </Typography>
          <Button color="inherit">Type</Button>
        </Box>
        <ExpenseButtonMenu />
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
