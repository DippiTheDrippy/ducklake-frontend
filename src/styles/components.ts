import { alpha } from "@mui/material/styles";
import type { PaletteMode, ThemeOptions } from "@mui/material/styles";

import { DARK_COLORS, LIGHT_COLORS, MELLOW_BLUE } from "./colors";

export const getComponents = (
  mode: PaletteMode,
): NonNullable<ThemeOptions["components"]> => {
  const isDark = mode === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: colors.background,
          color: colors.textPrimary,
          fontSize: "0.875rem",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          "&::-webkit-scrollbar": { width: 0, height: 0 },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        "*::-webkit-scrollbar": {
          display: "none",
          width: 0,
          height: 0,
        },
        "*": {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.paper,
          ...(isDark && {
            color: colors.textPrimary,
          }),
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.card,
          border: `1px solid ${
            isDark ? alpha("#FFFFFF", 0.06) : alpha("#000000", 0.07)
          }`,
          boxShadow: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          boxShadow: "none",
          minHeight: "2vh",
          minWidth: "2vw",
        },

        contained: {
          boxShadow: "none",

          ...(isDark && {
            backgroundColor: MELLOW_BLUE,
            color: colors.primaryContrast,
          }),

          "&:hover": {
            boxShadow: "none",

            ...(isDark && {
              backgroundColor: "#82BFE0",
            }),
          },
        },
      },
    },

    MuiLink: {
      defaultProps: {
        underline: "hover",
      },

      styleOverrides: {
        root: {
          color: MELLOW_BLUE,
          textUnderlineOffset: "3px",

          ...(isDark && {
            "&:hover": {
              color: DARK_COLORS.linkHover,
            },
          }),
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          opacity: 0.7,
        },
      },
    },
  };
};
