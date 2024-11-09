import { AppBar, Avatar, Button, Icon, Toolbar, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import CreateTransaction from "./modal/createTransaction";

function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
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
          <Button
            variant="contained"
            startIcon={<AddIcon fontSize="inherit" />}
            sx={{ marginRight: 2 }}
            onClick={handleOpen}
          >
            Create Expense
          </Button>
          <CreateTransaction open={open} handleClose={handleClose} />
          <Avatar />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default App;
