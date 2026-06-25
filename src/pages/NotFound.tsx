import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // horizontal center
        justifyContent: "center",
        mt: "15%",
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 40, sm: 60 }, fontWeight: "bold" }}
      >
        404
      </Typography>
      <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
        Oops! Page Not Found
      </Typography>
      <Typography sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Box>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ color: "white" }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
