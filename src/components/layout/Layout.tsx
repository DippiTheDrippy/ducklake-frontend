import { Outlet, useLocation, matchPath } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";

const fullWidthRoutes = ["/"];

export default function Layout() {
  const location = useLocation();

  const isFullWidth = fullWidthRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 64px)",
          mx: "auto",

          width: isFullWidth ? "100%" : { xs: "100%", md: "60%" },

          px: isFullWidth ? 0 : { xs: 2, sm: 3, md: 0 },
          py: isFullWidth ? 0 : { xs: 0, md: 3 },

          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
