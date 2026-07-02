import { Box, Button, Chip, Container, Typography } from "@mui/material";
import { DatasetOutlined, KeyOutlined } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import duckPng from "../assets/duck.png";

import { DARK_COLORS, LIGHT_COLORS } from "../styles/colors";

const duckPath = keyframes`
  0% {
    transform: translateX(-76px) translateY(3px);
  }

  42% {
    transform: translateX(calc(min(760px, 76vw))) translateY(-9px);
  }

  50% {
    transform: translateX(calc(min(760px, 76vw))) translateY(2px);
  }

  92% {
    transform: translateX(-76px) translateY(6px);
  }

  100% {
    transform: translateX(-76px) translateY(3px);
  }
`;

const duckFace = keyframes`
  0%, 44% {
    transform: scaleX(1) rotate(-4deg);
  }

  47%, 50% {
    transform: scaleX(1) rotate(8deg);
  }

  53%, 94% {
    transform: scaleX(-1) rotate(-5deg);
  }

  97%, 100% {
    transform: scaleX(1) rotate(-4deg);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-14px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: 200% center;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.65);
    opacity: 0.42;
  }

  100% {
    transform: scale(2.35);
    opacity: 0;
  }
`;

const drift = keyframes`
  0%, 100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(22px);
  }
`;

export default function Home() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        px: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
              radial-gradient(circle at 12% 16%, ${alpha(
                colors.homeGlowPrimary,
                isDark ? 0.18 : 0.38,
              )}, transparent 30%),
              radial-gradient(circle at 88% 20%, ${alpha(
                colors.homeGlowSecondary,
                isDark ? 0.16 : 0.42,
              )}, transparent 30%),
              linear-gradient(
                180deg,
                ${colors.homePaper} 0%,
                ${colors.homeBackground} 100%
              )
            `,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: { xs: 36, md: 80 },
          left: { xs: -120, md: 70 },
          width: { xs: 230, md: 280 },
          height: { xs: 230, md: 280 },
          borderRadius: "50%",
          backgroundColor: alpha(colors.homeGlowPrimary, isDark ? 0.14 : 0.32),
          filter: "blur(48px)",
          animation: `${float} 7s ease-in-out infinite`,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          right: { xs: -150, md: 90 },
          bottom: { xs: 160, md: 90 },
          width: { xs: 280, md: 340 },
          height: { xs: 280, md: 340 },
          borderRadius: "50%",
          backgroundColor: alpha(
            colors.homeGlowSecondary,
            isDark ? 0.13 : 0.34,
          ),
          filter: "blur(54px)",
          animation: `${float} 9s ease-in-out infinite`,
        }}
      />

      <Box
        sx={{
          minHeight: "calc(100dvh - 96px)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 920,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            component="h1"
            sx={{
              width: "100%",
              maxWidth: 920,
              color: "text.primary",
              fontSize: {
                xs: "clamp(2.45rem, 12vw, 3.5rem)",
                sm: "clamp(3.3rem, 9vw, 4.8rem)",
                md: "clamp(4.6rem, 7vw, 6.2rem)",
              },
              fontWeight: 750,
              lineHeight: { xs: 1.03, md: 0.98 },
              letterSpacing: { xs: "-0.035em", md: "-0.055em" },
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            Your data,
            <Box
              component="span"
              sx={{
                display: "block",
                pb: 0.5,
                background: `linear-gradient(
                    90deg,
                    ${theme.palette.primary.main},
                    ${colors.secondary},
                    ${colors.linkHover},
                    ${theme.palette.primary.main}
                  )`,
                backgroundSize: "220% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmer} 4.8s linear infinite`,
              }}
            >
              in one pond.
            </Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 620,
              color: "text.secondary",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              lineHeight: 1.75,
              px: { xs: 0.5, sm: 0 },
            }}
          >
            A page with a lake, a duck, and all the datasets you could ever
            want. Use the buttons below for quick
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            href="/browse"
            variant="contained"
            size="medium"
            startIcon={<DatasetOutlined fontSize="small" />}
            sx={{
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: 320, sm: "none" },
              px: 2.75,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 650,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                transform: "translateY(-1px)",
              },
              transition: "all 180ms ease",
            }}
          >
            Browse datasets
          </Button>

          <Button
            href="/keys"
            variant="outlined"
            size="medium"
            startIcon={<KeyOutlined fontSize="small" />}
            sx={{
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: 320, sm: "none" },
              px: 2.75,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 650,
              backgroundColor: alpha(colors.homePaper, isDark ? 0.7 : 0.9),
              "&:hover": {
                transform: "translateY(-1px)",
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.08 : 0.05,
                ),
              },
              transition: "all 180ms ease",
            }}
          >
            Your keys
          </Button>
        </Box>

        <Box
          sx={{
            width: "min(920px, 100%)",
            height: {
              xs: "clamp(205px, 44vw, 245px)",
              md: 292,
            },
            mt: { xs: 0.5, md: 2.5 },
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 3, md: 4 },
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 1 : 0.9)}`,
            background: `
                linear-gradient(
                  180deg,
                  ${colors.lakeTop} 0%,
                  ${colors.lakeMiddle} 46%,
                  ${colors.lakeBottom} 100%
                )
              `,
            boxShadow: `0 24px 70px ${alpha(
              theme.palette.common.black,
              isDark ? 0.32 : 0.12,
            )}`,
            transition: "transform 220ms ease, box-shadow 220ms ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: `0 30px 90px ${alpha(
                theme.palette.common.black,
                isDark ? 0.4 : 0.16,
              )}`,
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: isDark ? 0.18 : 0.36,
              background: `
                  repeating-linear-gradient(
                    176deg,
                    ${alpha(colors.lakeFoam, 0.72)} 0px,
                    ${alpha(colors.lakeFoam, 0.72)} 2px,
                    transparent 4px,
                    transparent 30px
                  )
                `,
              animation: `${drift} 8s ease-in-out infinite`,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `
                  radial-gradient(circle at 28% 24%, ${alpha(
                    colors.lakeFoam,
                    isDark ? 0.13 : 0.34,
                  )}, transparent 24%),
                  radial-gradient(circle at 74% 70%, ${alpha(
                    theme.palette.primary.main,
                    isDark ? 0.16 : 0.18,
                  )}, transparent 28%),
                  linear-gradient(
                    180deg,
                    transparent 0%,
                    ${alpha(theme.palette.common.black, isDark ? 0.08 : 0.03)} 100%
                  )
                `,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              left: 0,
              bottom: { xs: 76, md: 102 },
              zIndex: 3,
              animation: `${duckPath} 18s ease-in-out infinite`,
              willChange: "transform",
            }}
          >
            <Box
              component="img"
              src={duckPng}
              sx={{
                display: "inline-block",
                width: { xs: 124, md: 142 },
                height: { xs: 124, md: 142 },
                objectFit: "contain",
                userSelect: "none",
                transformOrigin: "center",
                animation: `${duckFace} 18s ease-in-out infinite`,
                filter: `drop-shadow(0 12px 14px ${alpha(
                  theme.palette.common.black,
                  isDark ? 0.34 : 0.18,
                )})`,
              }}
            ></Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: "31%",
              bottom: { xs: 72, md: 94 },
              width: { xs: 76, md: 96 },
              height: { xs: 18, md: 23 },
              borderRadius: "50%",
              border: `1px solid ${alpha(colors.lakeFoam, isDark ? 0.4 : 0.68)}`,
              animation: `${ripple} 2.8s ease-out infinite`,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              left: "54%",
              bottom: { xs: 72, md: 94 },
              width: { xs: 92, md: 116 },
              height: { xs: 20, md: 25 },
              borderRadius: "50%",
              border: `1px solid ${alpha(colors.lakeFoam, isDark ? 0.3 : 0.52)}`,
              animation: `${ripple} 3.2s ease-out infinite`,
              animationDelay: "0.65s",
            }}
          />

          <Typography
            sx={{
              position: "absolute",
              left: { xs: 14, md: 26 },
              right: { xs: 14, sm: "auto" },
              bottom: { xs: 14, md: 22 },
              zIndex: 4,
              width: { xs: "auto", sm: "fit-content" },
              maxWidth: { xs: "none", sm: 420 },
              color: "text.secondary",
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
              lineHeight: 1.45,
              backgroundColor: alpha(
                colors.lakeTextBubble,
                isDark ? 0.72 : 0.84,
              ),
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.9 : 0.75)}`,
              borderRadius: 2,
              px: 1.25,
              py: 0.75,
              backdropFilter: "blur(10px)",
            }}
          >
            The duck is currently doing important research.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
