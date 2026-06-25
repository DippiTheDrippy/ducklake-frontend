import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";

export default function Layout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 64px)",
          width: { xs: "100%", md: "70%" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 0 },
          py: { xs: 2, md: 3 },
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
