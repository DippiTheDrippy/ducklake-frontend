import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import type { AlertColor } from "@mui/material";

type MessagePageProps = {
  title?: string;
  message: ReactNode;
  severity?: AlertColor;
  details?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export default function MessagePage({
  title = "Something happened",
  message,
  severity = "info",
  details,
  actionLabel,
  onAction,
}: Readonly<MessagePageProps>) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.04em",
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            {message}
          </Typography>
        </Box>

        {details ? (
          <Alert
            severity={severity}
            sx={{
              textAlign: "left",
              mb: actionLabel && onAction ? 3 : 0,
              "& .MuiAlert-message": {
                width: "100%",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              },
            }}
          >
            {details}
          </Alert>
        ) : null}

        {actionLabel && onAction ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={onAction}>
              {actionLabel}
            </Button>
          </Box>
        ) : null}
      </Paper>
    </Container>
  );
}
