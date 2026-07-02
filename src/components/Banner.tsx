import { Box, Typography } from "@mui/material";
import { useTheme } from "../hooks/useTheme";

interface Banner {
  image: string;
  title: string | React.ReactNode;
  subtitle?: string;
  height?: string | number | { xs: string; md: string; lg?: string };
  overlayLight?: number;
  overlayDark?: number;
  position?: { xs: string; md: string };
}

export default function Banner({
  image,
  title,
  subtitle,
  height = "100vh",
  overlayLight = 0.35,
  overlayDark = 0.6,
  position = { xs: "center", md: "center 35%" },
}: Readonly<Banner>) {
  const { isDark } = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: height,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // Parallax background
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: position,
        backgroundAttachment: { xs: "scroll", md: "fixed" }, // parallax on desktop only

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(0,0,0,${isDark ? overlayDark : overlayLight})`,
          zIndex: 1,
        },
      }}
    >
      {/* Content Box */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          maxWidth: 1000,
          color: "white",
          p: { xs: 2, sm: 3 },
        }}
      >
        {subtitle && (
          <Typography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1.2em" },
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              opacity: 0.85,
              mb: 1,
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Typography
          sx={{
            fontWeight: 800,
            lineHeight: 1.05,
            textTransform: "uppercase",
            fontSize: {
              xs: "1.8rem",
              sm: "2.4rem",
              md: "3.2rem",
              lg: "3.8rem",
            },
            letterSpacing: { xs: "0.03em", md: "0.08em" },
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
}
