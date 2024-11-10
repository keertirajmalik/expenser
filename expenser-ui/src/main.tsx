import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import NavigationBar from "./NavigationBar.tsx";
import TransactionTable from "./TransactionTable.tsx";
import { TransactionsProvider } from "./providers/TransactionsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <TransactionsProvider>
    <StrictMode>
      <CssBaseline />
      <NavigationBar />
      <TransactionTable />
    </StrictMode>
  </TransactionsProvider>,
);

// TODO: create sidebar with navigation links to transactions and types pages
