import { Box, Container, Typography } from "@mui/material";

export default function Admin() {
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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: { xs: 3, md: 5 },
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: "1.15rem",
            fontWeight: 500,
            color: "warning.main",
            mb: 0.5,
          }}
        >
          Admin Panel
        </Typography>
      </Box>
    </Container>
  );
}
