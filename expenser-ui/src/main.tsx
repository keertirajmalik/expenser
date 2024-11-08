import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import Home from "./home.tsx";


// const theme = createTheme({
//   palette: muiPalette,
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <ThemeProvider theme={theme}> */}
      <CssBaseline />
    <App />
    <Home />
    {/* </ThemeProvider> */}
  </StrictMode>,
);
