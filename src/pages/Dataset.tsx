import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ConfirmDialog from "../components/dialog/ConfirmDialog";
import ColumnSummaryTable from "../components/datasets/ColumnSummaryTable";
import DatasetHeader from "../components/datasets/DatasetHeader";
import DatasetMetadata from "../components/datasets/DatasetMetadata";
import DatasetPageSkeleton from "../components/datasets/DatasetPageSkeleton";
import { useDatasets } from "../contexts/DatasetsContext";
import { useUser } from "../contexts/UserContext";
import Message from "./Message";
import UploadDialog from "../components/dialog/UploadDialog";
import SimpleDialog from "../components/dialog/SimpleDialog";
import { useCredentials } from "../contexts/CredentialsContext";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { buildDuckLakeConnectionString } from "../utils/credentialHelpers";

export default function Dataset() {
  const { id } = useParams<{ id: string }>();
  const { isAuthReady, isAdmin, isAuthenticated } = useUser();
  const { credential, createCredentials, resetCredential } = useCredentials();
  const { dataset, getDataset, deleteDataset, uploadDatasetFile, isLoading } =
    useDatasets();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [showCreatedCredential, setShowCreatedCredential] = useState(false);
  const navigate = useNavigate();
  const [createCred, setCreateCred] = useState({
    name: "",
    accessLevel: "READ" as "READ" | "WRITE",
    expiresAt: null as null | Dayjs,
    neverExpires: true,
  });

  useEffect(() => {
    if (!id) return;
    if (!isAuthReady) return;
    if (!isAuthenticated) return;

    if (dataset?.dataset.id !== id) {
      getDataset(id);
    }
  }, [id, isAuthReady, isAuthenticated, dataset?.dataset.id, getDataset]);

  if (!id) {
    return <Message message="No dataset ID provided." severity="error" />;
  }

  const selectedDataset = dataset?.dataset.id === id ? dataset : null;

  if (!selectedDataset) {
    return <DatasetPageSkeleton />;
  }

  const { dataset: info, summary } = selectedDataset;

  const handleConfirmDelete = async () => {
    const success = await deleteDataset(id);
    if (!success) return;

    setDeleteDialogOpen(false);
    navigate("/browse");
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
        <DatasetHeader
          dataset={info}
          isAdmin={isAdmin}
          isLoading={isLoading}
          onDelete={() => setDeleteDialogOpen(true)}
          onUpload={() => setUploadDialogOpen(true)}
          onCreateCredentials={() => setCredentialDialogOpen(true)}
        />

        <DatasetMetadata dataset={info} columnCount={summary.length} />

        <ColumnSummaryTable summary={summary} />
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete dataset?"
        message="This will permanently delete the dataset. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <UploadDialog
        open={uploadDialogOpen}
        isLoading={isLoading}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={(file) => uploadDatasetFile(id, file)}
        onUploaded={() => getDataset(id)}
        title="Upload file"
        description="Select a file to upload to this dataset."
      />

      <SimpleDialog
        open={credentialDialogOpen}
        title="Create dataset credentials"
        description="Fill in the fields below."
        buttonLabel="Create"
        loadingLabel="Creating..."
        disabled={
          !createCred.name ||
          (!createCred.neverExpires && !createCred.expiresAt)
        }
        onClose={() => setCredentialDialogOpen(false)}
        onComplete={async () => {
          await createCredentials(
            id,
            createCred.name,
            createCred.accessLevel,
            createCred.expiresAt,
            createCred.neverExpires,
          );
          setShowCreatedCredential(true);
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Credential name"
            value={createCred.name}
            onChange={(event) =>
              setCreateCred((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            fullWidth
            required
            size="small"
          />

          <TextField
            select
            label="Access level"
            value={createCred.accessLevel}
            onChange={(event) =>
              setCreateCred((current) => ({
                ...current,
                accessLevel: event.target.value as "READ" | "WRITE",
              }))
            }
            fullWidth
            size="small"
          >
            <MenuItem value="READ">Read</MenuItem>
            <MenuItem value="WRITE">Write</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={createCred.neverExpires}
                onChange={(event) => {
                  const neverExpires = event.target.checked;

                  setCreateCred((current) => ({
                    ...current,
                    neverExpires,
                    expiresAt: neverExpires ? null : current.expiresAt,
                  }));
                }}
              />
            }
            label="Never expires"
          />

          <DatePicker
            label="Expires at"
            value={createCred.expiresAt}
            onChange={(date) =>
              setCreateCred((current) => ({
                ...current,
                expiresAt: date,
              }))
            }
            disabled={createCred.neverExpires}
            minDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                required: !createCred.neverExpires,
                size: "small",
                helperText: createCred.neverExpires
                  ? "This credential will not expire."
                  : "Choose an expiration date.",
              },
            }}
          />
        </Box>
      </SimpleDialog>

      <SimpleDialog
        open={showCreatedCredential && credential !== null}
        title="Dataset credentials created"
        description="The following credentials have been created. Please copy and save them securely, as they will not be shown again."
        buttonLabel=""
        onClose={() => {
          setShowCreatedCredential(false);
          resetCredential();
          setCreateCred({
            name: "",
            accessLevel: "READ",
            expiresAt: null,
            neverExpires: true,
          });
        }}
        onComplete={() => {}}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            value={credential ? buildDuckLakeConnectionString(credential) : ""}
            multiline
            fullWidth
            minRows={16}
            maxRows={32}
            disabled
          />

          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.secondary",
            }}
          >
            Keep this credential safe. It contains database and object storage
            secrets.
          </Typography>
        </Box>
      </SimpleDialog>
    </Container>
  );
}
