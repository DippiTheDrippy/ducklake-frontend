import { alpha } from "@mui/material/styles";
import type { PaletteMode, ThemeOptions } from "@mui/material/styles";

import { DARK_COLORS, LIGHT_COLORS, MELLOW_BLUE } from "./colors";

export const getPalette = (mode: PaletteMode): ThemeOptions["palette"] => {
  const isDark = mode === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return {
    mode,

    primary: {
      main: MELLOW_BLUE,
      contrastText: colors.primaryContrast,
    },

    secondary: {
      main: colors.secondary,
    },

    background: {
      default: colors.background,
      paper: colors.paper,
    },

    onBackground: colors.onBackground,
    onPaper: colors.onPaper,

    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },

    divider: isDark ? alpha("#FFFFFF", 0.09) : alpha("#000000", 0.09),
  };
};
