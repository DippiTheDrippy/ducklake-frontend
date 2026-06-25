import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material/styles";

import { getComponents } from "./components";
import { getPalette } from "./palette";
import { baseTypography } from "./typography";

const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    typography: baseTypography,
    palette: getPalette(mode),
    components: getComponents(mode),
  });

export const darkTheme = createAppTheme("dark");
export const lightTheme = createAppTheme("light");
