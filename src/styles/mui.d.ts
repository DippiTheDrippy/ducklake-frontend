import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    onBackground: string;
    onPaper: string;
  }

  interface PaletteOptions {
    onBackground?: string;
    onPaper?: string;
  }
}
