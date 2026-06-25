import type { ThemeOptions } from "@mui/material/styles";

export const baseTypography: ThemeOptions["typography"] = {
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: 13,

  h1: {
    fontSize: "2rem",
    fontWeight: 500,
    letterSpacing: "-0.04em",
  },

  h2: {
    fontSize: "1.6rem",
    fontWeight: 500,
    letterSpacing: "-0.035em",
  },

  h3: {
    fontSize: "1.35rem",
    fontWeight: 500,
    letterSpacing: "-0.03em",
  },

  h4: {
    fontSize: "1.15rem",
    fontWeight: 500,
  },

  h5: {
    fontSize: "1rem",
    fontWeight: 500,
  },

  h6: {
    fontSize: "0.95rem",
    fontWeight: 500,
  },

  body1: {
    fontSize: "0.875rem",
    lineHeight: 1.7,
  },

  body2: {
    fontSize: "0.8rem",
    lineHeight: 1.6,
  },

  button: {
    fontSize: "0.8rem",
    fontWeight: 500,
    textTransform: "none",
  },
};
