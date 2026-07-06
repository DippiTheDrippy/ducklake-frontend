import { useState } from "react";
import { NavLink, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { LightMode, DarkMode, Menu, Close } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha, useTheme as useMuiTheme } from "@mui/material/styles";
import { useAuth } from "react-oidc-context";
import { useTheme } from "../../hooks/useTheme";
import { useUser } from "../../contexts/UserContext";

export default function Header() {
  const muiTheme = useMuiTheme();
  const { isDark, toggleTheme } = useTheme();
  const auth = useAuth();
  const { backendUser } = useUser();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

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

  const userLabel = auth.isLoading
    ? "Loading..."
    : auth.isAuthenticated
      ? `${backendUser?.firstName ?? ""} ${backendUser?.lastName ?? ""}`.trim()
      : "Sign in";

  const navItems = [
    { label: "Browse", path: "/browse" },
    { label: "Favorites", path: "/favorites" },
    { label: "My Keys", path: "/keys" },
    { label: "My Groups", path: "/groups" },
  ];

  const getNavButtonSx = (isActive: boolean, admin?: boolean) => ({
    color: admin
      ? "warning.main"
      : isActive
        ? "text.primary"
        : "text.secondary",
    fontSize: "0.8rem",
    px: 1.25,
    minHeight: 28,
    borderRadius: 1.5,
    fontWeight: admin ? 600 : 500,
    backgroundColor: isActive
      ? alpha(muiTheme.palette.mode === "dark" ? "#FFFFFF" : "#000000", 0.1)
      : "transparent",
    "&:hover": {
      color: admin ? "warning.main" : "text.primary",
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
            alt="cbhpond icon"
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

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" } }}
        />

        {/* Desktop navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={NavLink}
              to={item.path}
              end={false}
              color="inherit"
              size="small"
              sx={getNavButtonSx(isActiveRoute(item.path))}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Desktop actions */}
        <Box
          sx={{
            ml: "auto",
            display: { xs: "none", md: "flex" },
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
              py: 0.5,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {userLabel}
          </Button>
        </Box>

        {/* Mobile actions */}
        <Box
          sx={{
            ml: "auto",
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            size="small"
            aria-label="Toggle theme"
            sx={{
              color: "text.secondary",
            }}
          >
            {isDark ? (
              <LightMode fontSize="small" />
            ) : (
              <DarkMode fontSize="small" />
            )}
          </IconButton>

          <IconButton
            onClick={() => setMobileOpen(true)}
            color="inherit"
            aria-label="Open navigation menu"
            sx={{
              color: "text.primary",
            }}
          >
            <Menu />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundColor: "background.default",
              color: "text.primary",
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            sx={{
              mb: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              cbhpond
            </Typography>

            <IconButton
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              <Close />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 1 }} />

          <List disablePadding>
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.path);

              return (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    my: 0.5,
                    color: isActive ? "text.primary" : "text.secondary",
                    backgroundColor: isActive
                      ? alpha(
                          muiTheme.palette.mode === "dark"
                            ? "#FFFFFF"
                            : "#000000",
                          0.08,
                        )
                      : "transparent",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ fontWeight: isActive ? 700 : 500 }}
                        noWrap
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          <Button
            onClick={handleAuthClick}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<LogoutIcon />}
            disabled={auth.isLoading}
            sx={{
              borderRadius: 2,
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {userLabel}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
