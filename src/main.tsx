import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { OidcProvider } from "./contexts/OidcContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <OidcProvider>
          <App />
        </OidcProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
