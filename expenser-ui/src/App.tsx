import { AppBar, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#1c2543",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expenser
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default App;
