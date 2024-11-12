import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonGroup,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTransactionType from "./modal/CreateTransactionType";
import CreateTransaction from "./modal/CreateTransaction";
import { useUser } from "./providers/UserContext";

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

export default function NavigationBar() {
  const { username } = useUser();
  const [openTransactionType, setTransactionTypeModalOpen] = useState(false);
  const [openTransaction, setTransactionModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTransactionTypeOpen = () => setTransactionTypeModalOpen(true);
  const closeTransactionTypeModal = () => setTransactionTypeModalOpen(false);

  const handleTransactionOpen = () => setTransactionModalOpen(true);
  const closeTransactionModal = () => setTransactionModalOpen(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (type: string) => {
    if (type === "expense") {
      handleTransactionOpen();
    } else if (type === "transactionType") {
      handleTransactionTypeOpen();
    }
    handleMenuClose();
  };

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
        <ButtonGroup variant="contained" sx={{ marginRight: 2 }}>
          <Button
            startIcon={<AddIcon fontSize="inherit" />}
            onClick={handleTransactionOpen}
          >
            Create Expense
          </Button>
          <Button onClick={handleMenuOpen}>▼</Button>
        </ButtonGroup>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("expense")}>
            Create Expense
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("transactionType")}>
            Create Transaction Type
          </MenuItem>
        </Menu>
        <CreateTransaction
          open={openTransaction}
          handleClose={closeTransactionModal}
        />
        <CreateTransactionType
          open={openTransactionType}
          handleClose={closeTransactionTypeModal}
        />
        <Avatar {...stringAvatar(username)} />
        {/* TODO: Add a profile menu https://mui.com/material-ui/react-menu/ */}
      </Toolbar>
    </AppBar>
  );
}
