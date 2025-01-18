import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "../../assets/css/index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "../../components/theme/theme-provider.tsx";
import ReactQueryProvider from "../../react-query/index.tsx";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <NextUIProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ReactQueryProvider>
            <App />
            <Toaster  position="bottom-left" richColors theme="dark" />
          </ReactQueryProvider>
        </ThemeProvider>
      </NextUIProvider>
    </ClerkProvider>
  </React.StrictMode>
);

// Use contextBridge
// window.ipcRenderer.on("main-process-message", (_event, message) => {
//   console.log(message);
// });
