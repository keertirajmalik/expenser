import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import Appbar from "@/component/AppBar/AppBar";
import SignUp from "@/component/Signup";
import TransactionTable from "@/component/TransactionTable";
import { useAuth, AuthProvider } from "@/providers/AuthContext";
import { TransactionsProvider } from "@/providers/TransactionsContext";
import { UserProvider } from "@/providers/UserContext";
import Login from "@/component/Login";
// import TransactionTypeTable from "@/component/TransactionTypeTable";

const App = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <StrictMode>
      <CssBaseline />
      {isLoggedIn ? (
        <TransactionsProvider>
          <Appbar />
          <TransactionTable />
          {/* <TransactionTypeTable /> */}
        </TransactionsProvider>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </StrictMode>
  );
};

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const Main = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
