import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import { useUser } from "../../providers/UserContext";
import ExpenseButtonMenu from "./ExpenseButton";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0][0];

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(),
  };
}

export default function Appbar() {
  const { username } = useUser();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1c2543",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Expenser
        </Typography>
        <ExpenseButtonMenu />
        <Avatar {...stringAvatar(username)} />
        {/* TODO: Add a profile menu https://mui.com/material-ui/react-menu/ */}
      </Toolbar>
    </AppBar>
  );
}
