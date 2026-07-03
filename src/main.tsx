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
import { NotificationProvider } from "./contexts/NotificationContext.tsx";
import { GroupsProvider } from "./contexts/GroupsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <OidcProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NotificationProvider>
              <UserProvider>
                <DatasetsProvider>
                  <FavoritesProvider>
                    <CredentialsProvider>
                      <GroupsProvider>
                        <App />
                      </GroupsProvider>
                    </CredentialsProvider>
                  </FavoritesProvider>
                </DatasetsProvider>
              </UserProvider>
            </NotificationProvider>
          </LocalizationProvider>
        </OidcProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
