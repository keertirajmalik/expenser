import { App } from "@/App";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: false, // Disable retries for all queries
    },
    mutations: {
      retry: false, // Disable retries for all mutations
    },
  },
};

const queryClient = new QueryClient(queryClientOptions);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
