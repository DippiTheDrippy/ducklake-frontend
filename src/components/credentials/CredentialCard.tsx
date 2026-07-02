import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Paper, Tooltip, Typography } from "@mui/material";
import { ArrowForwardOutlined, DeleteForever } from "@mui/icons-material";

import type { Credential } from "../../types/credentials";
import { useCredentials } from "../../contexts/CredentialsContext";
import { formatDate, isExpired } from "../../utils/credentialHelpers";

interface CredentialCardProps {
  credential: Credential;
  onDelete: (id: string) => void;
}

export default function CredentialCard({
  credential,
  onDelete,
}: Readonly<CredentialCardProps>) {
  const expired = isExpired(credential.expiresAt);
  const { loading } = useCredentials();

  const truncate = (value: string | null | undefined, max = 20) => {
    if (!value) return "—";
    return value.length > max ? `${value.slice(0, max)}...` : value;
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(6, minmax(0, auto))",
          },
          gap: { xs: 0.75, md: 2 },
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
            Name
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.primary",
              wordBreak: "break-word",
            }}
          >
            {truncate(credential.name, 20)}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
            PostgreSQL user
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.primary",
              wordBreak: "break-word",
            }}
          >
            {credential.postgresUsername || "—"}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
            Access key ID
          </Typography>

          <Tooltip title={credential.garageAccessKeyId || ""}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "text.primary",
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {credential.garageAccessKeyId || "—"}
            </Typography>
          </Tooltip>
        </Box>

        <Box>
          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
            Expires
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: expired ? "error.main" : "text.primary",
            }}
          >
            {formatDate(credential.expiresAt)}
          </Typography>
        </Box>

        <Chip
          label={credential.accessLevel}
          size="small"
          color="warning"
          variant="outlined"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            textTransform: "capitalize",
          }}
        />

        <Chip
          label={expired ? "Expired" : "Active"}
          size="small"
          color={expired ? "error" : "success"}
          variant="outlined"
          sx={{
            height: 22,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
        <Button
          aria-label="Delete credential"
          color="error"
          disabled={loading}
          onClick={() => onDelete(credential.id)}
          size="small"
          sx={{
            backgroundColor: "error.main",
            color: "error.contrastText",
          }}
        >
          <DeleteForever fontSize="small" />
        </Button>

        <Button
          component={RouterLink}
          to={`/dataset/${credential.datasetId}`}
          variant="outlined"
          size="small"
          endIcon={<ArrowForwardOutlined />}
          sx={{
            alignSelf: { xs: "flex-start", sm: "center" },
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
        >
          Go to dataset
        </Button>
      </Box>
    </Paper>
  );
}
