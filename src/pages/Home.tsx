import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Banner from "../components/Banner";
import duckBanner from "../assets/banner.webp";

const shortcuts = [
  {
    title: "Browse datasets",
    description: "Search and explore datasets available through cbhpond.",
    href: "/browse",
  },
  {
    title: "Favorites",
    description: "Return to datasets you have saved for later.",
    href: "/favorites",
  },
  {
    title: "Access keys",
    description:
      "Create keys that give you direct access to the DuckLake catalog behind the dataset.",
    href: "/keys",
  },
];

export default function Home() {
  const theme = useTheme();

  return (
    <Box>
      <Banner
        image={duckBanner}
        subtitle="KTH CBH DATA PORTAL"
        title="CBHPond"
        height={{ xs: "78vh", md: "84vh", lg: "88vh" }}
        overlayLight={0}
        overlayDark={0.3}
        position={{ xs: "center", md: "center 40%" }}
      />

      <Box
        sx={{
          py: { xs: 6, md: 9 },
          backgroundColor: "background.default",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={{ xs: 5, md: 7 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 750,
                  letterSpacing: "-0.04em",
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                A calm place for KTH datasets.
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  mx: "auto",
                  maxWidth: 680,
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.12rem" },
                  lineHeight: 1.8,
                }}
              >
                cbhpond is a data portal for students at KTH, hosted by the CBH
                school on our cloud. It helps you browse datasets, save useful
                resources, and access data for coursework and projects.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4, justifyContent: "center" }}
              >
                <Button
                  component={RouterLink}
                  to="/browse"
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Browse datasets
                </Button>

                <Button
                  component={RouterLink}
                  to="/keys"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Manage access keys
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {shortcuts.map((item) => (
                <Card
                  key={item.title}
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: `1px solid ${alpha(
                      theme.palette.text.primary,
                      0.1,
                    )}`,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.035)
                        : alpha(theme.palette.common.white, 0.72),
                    transition: "transform 160ms ease, border-color 160ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: alpha(theme.palette.primary.main, 0.35),
                    },
                  }}
                >
                  <CardActionArea
                    component={RouterLink}
                    to={item.href}
                    sx={{ height: "100%" }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 750,
                          mb: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          fontSize: "0.95rem",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>

            <Box
              sx={{
                pt: { xs: 2, md: 4 },
                borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: { xs: 3, md: 6 },
                alignItems: "start",
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "primary.main",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                  }}
                >
                  DuckLake beneath the surface
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mt: 1,
                    fontWeight: 750,
                    letterSpacing: "-0.03em",
                  }}
                >
                  A catalog you can actually wade into.
                </Typography>
              </Box>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                  fontSize: { xs: "0.9rem", md: "0.9rem" },
                }}
              >
                Access keys are your way into the DuckLake catalog for the
                datasets you have permission to use. DuckLake keeps the
                lakehouse idea pleasantly familiar: metadata lives in a SQL
                catalog, while the actual data can sit below the surface as
                Parquet files. So if PostgreSQL feels like solid ground,
                DuckLake should not feel like deep water.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
