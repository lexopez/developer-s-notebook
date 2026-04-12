import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 0, // Always consider data stale to ensure fresh data on each access
      refetchOnWindowFocus: false,
    },
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("theme", state.notes.theme);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
      <Toaster
        toastOptions={{
          style: {
            padding: "3px 5px",
            background: "#f1eeee",
            color: "#a19f9f",
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
