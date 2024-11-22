import { AppBar, Toolbar, Typography } from "@mui/material";
import ExpenseButtonMenu from "./ExpenseButton";
import ProfileMenu from "./ProfileMenu";

export default function Appbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1c2543",
      }}
    >
      <Toolbar component="nav" aria-label="main navigation">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Expenser
        </Typography>
        <ExpenseButtonMenu />
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
