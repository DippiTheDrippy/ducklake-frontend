import { NavLink, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha, useTheme as useMuiTheme } from "@mui/material/styles";
import { useAuth } from "react-oidc-context";
import { useTheme } from "../../hooks/useTheme";
import { useUser } from "../../contexts/UserContext";

export default function Header() {
  const muiTheme = useMuiTheme();
  const { isDark, toggleTheme } = useTheme();
  const auth = useAuth();
  const user = useUser();

  const location = useLocation();
  const isActiveRoute = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleAuthClick = () => {
    if (auth.isAuthenticated) {
      void auth.signoutRedirect();
      return;
    }

    void auth.signinRedirect();
  };

  const getNavButtonSx = (isActive: boolean) => ({
    color: isActive ? "text.primary" : "text.secondary",
    fontSize: "0.8rem",
    px: 1.25,
    minHeight: 28,
    borderRadius: 1.5,
    backgroundColor: isActive
      ? alpha(muiTheme.palette.mode === "dark" ? "#FFFFFF" : "#000000", 0.1)
      : "transparent",
    "&:hover": {
      color: "text.primary",
    },
  });

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: muiTheme.zIndex.appBar,
        backgroundColor: "background.default",
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: "56px !important",
          width: { xs: "100%", md: "95%" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 0 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          boxSizing: "border-box",
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mr: 1,
            color: "text.primary",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src="/favicon.ico"
            alt="cbhcloud icon"
            sx={{
              width: 32,
              height: 32,
              display: "block",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            cbhpond
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1 },
          }}
        >
          <Button
            component={NavLink}
            to="/browse"
            end={false}
            color="inherit"
            size="small"
            sx={getNavButtonSx(isActiveRoute("/browse"))}
          >
            Browse
          </Button>

          <Button
            component={NavLink}
            to="/favorites"
            end={false}
            color="inherit"
            size="small"
            sx={getNavButtonSx(isActiveRoute("/favorites"))}
          >
            Favorites
          </Button>

          <Button
            component={NavLink}
            to="/keys"
            end={false}
            color="inherit"
            size="small"
            sx={getNavButtonSx(isActiveRoute("/keys"))}
          >
            My Keys
          </Button>
        </Box>

        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            size="small"
            aria-label="Toggle theme"
            sx={{
              color: "text.secondary",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "text.primary",
                backgroundColor: "transparent",
              },
              px: 2,
            }}
          >
            {isDark ? (
              <LightMode fontSize="medium" />
            ) : (
              <DarkMode fontSize="medium" />
            )}
          </IconButton>

          <Button
            onClick={handleAuthClick}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<LogoutIcon />}
            disabled={auth.isLoading}
            sx={{
              fontSize: "0.8rem",
              borderRadius: 1.5,
              px: 1.5,
              py: 0,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {auth.isLoading ? "Loading..." : `${user.backendUser?.firstName}`}{" "}
            {`${user.backendUser?.lastName}`}
          </Button>
        </Box>
      </Toolbar>
    </Box>
  );
}
