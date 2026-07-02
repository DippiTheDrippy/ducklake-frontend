import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { OidcProvider } from "./contexts/OidcContext.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserProvider } from "./contexts/UserContext.tsx";
import { DatasetsProvider } from "./contexts/DatasetsContext.tsx";
import { FavoritesProvider } from "./contexts/FavoritesContext.tsx";
import { CredentialsProvider } from "./contexts/CredentialsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <OidcProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UserProvider>
              <DatasetsProvider>
                <FavoritesProvider>
                  <CredentialsProvider>
                    <App />
                  </CredentialsProvider>
                </FavoritesProvider>
              </DatasetsProvider>
            </UserProvider>
          </LocalizationProvider>
        </OidcProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
