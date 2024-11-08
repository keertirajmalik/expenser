import { AddIcon } from "@imtf/icons";
import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";

function App() {
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
          <Button variant="contained" endIcon={<AddIcon fontSize="inherit" />}>
            Create Expense
          </Button>
          <Avatar sx={{ marginLeft: 2 }} />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default App;
