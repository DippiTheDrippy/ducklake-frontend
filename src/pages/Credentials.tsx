import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useCredentials } from "../contexts/CredentialsContext";
import { useUser } from "../contexts/UserContext";
import CredentialCard from "../components/credentials/CredentialCard";
import ConfirmDialog from "../components/dialog/ConfirmDialog";

export default function Credentials() {
  const { credentials, loading, fetchCredentials, delCredentials } =
    useCredentials();
  const { isAuthReady, isAuthenticated } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) return;

    fetchCredentials();
  }, [fetchCredentials]);

  const handleConfirmDelete = async () => {
    if (!selectedCredentialId) return;

    const success = await delCredentials(selectedCredentialId);
    if (!success) return;

    setDeleteDialogOpen(false);
  };

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
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: "1.15rem",
              fontWeight: 500,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Dataset credentials
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            Manage your dataset credentials.
          </Typography>
        </Box>

        {credentials.length > 0 ? (
          credentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onDelete={() => {
                setSelectedCredentialId(credential.id);
                setDeleteDialogOpen(true);
              }}
            />
          ))
        ) : (
          <Typography sx={{ color: "text.secondary" }}>
            No credentials found.
          </Typography>
        )}
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete credential?"
        message="This will permanently delete the credential. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={loading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
