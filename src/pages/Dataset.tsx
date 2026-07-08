import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
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
import DatasetAccessDialog from "../components/datasets/access/DatasetAccessDialog";
import { Check, ContentCopy } from "@mui/icons-material";

export default function Dataset() {
  const { id } = useParams<{ id: string }>();
  const { isAuthReady, isAdmin, isAuthenticated } = useUser();
  const {
    credential,
    createCredentials,
    resetCredential,
    getCredential,
    rotateCredentials,
  } = useCredentials();
  const { dataset, getDataset, deleteDataset, uploadDatasetFile, isLoading } =
    useDatasets();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [rotateCredentialDialogOpen, setRotateCredentialDialogOpen] =
    useState(false);
  const [showCreatedCredential, setShowCreatedCredential] = useState(false);
  const navigate = useNavigate();
  const [createCred, setCreateCred] = useState({
    name: "",
    accessLevel: "READ" as "READ" | "WRITE",
    expiresAt: null as null | Dayjs,
    neverExpires: true,
  });

  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (!isAuthReady) return;
    if (!isAuthenticated) return;

    if (dataset?.dataset.id !== id) {
      getDataset(id);
    }
    getCredential(id);
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

  const credentialText = credential
    ? buildDuckLakeConnectionString(credential)
    : "";

  const handleCopyCredential = async () => {
    if (!credentialText) return;

    await navigator.clipboard.writeText(credentialText);
    setCopied(true);

    setTimeout(() => setCopied(false), 1600);
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
          onCreateCredentials={() => {
            credential
              ? setRotateCredentialDialogOpen(true)
              : setCredentialDialogOpen(true);
          }}
          onAccess={() => setAccessDialogOpen(true)}
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
          if (credential !== null) {
            setShowCreatedCredential(true);
          }
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

      <ConfirmDialog
        open={rotateCredentialDialogOpen && credential !== undefined}
        title="Rotate credentials?"
        message="This will renew your credentials. This action cannot be undone."
        confirmLabel="Rotate"
        loadingLabel="Rotating..."
        isLoading={isLoading}
        onClose={() => setRotateCredentialDialogOpen(false)}
        onConfirm={async () => {
          await rotateCredentials(credential!.id);
          setRotateCredentialDialogOpen(false);
          setShowCreatedCredential(true);
        }}
        color="warning.main"
      />

      <SimpleDialog
        open={showCreatedCredential && credential !== null}
        title="Dataset credentials created"
        description="Copy and save these credentials securely. They will not be shown again."
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
        maxWidth="md"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Alert severity="warning" variant="outlined">
            This script contains database and object storage secrets. Store it
            securely; it cannot be viewed again after closing this dialog.
          </Alert>

          <Box
            sx={{
              borderRadius: 1,
              px: 1.5,
              py: 1.25,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Tip: paste this into a trusted DuckDB session. Do not share it in
              logs, screenshots, commits, or support tickets.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                }}
              >
                DuckLake connection script
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.25,
                }}
              >
                Run this from an environment that can reach the catalog Postgres
                and Garage.
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={handleCopyCredential}
              disabled={!credentialText}
              sx={{
                backgroundColor: "transparent",
                color: "text.primary",
              }}
            >
              {copied ? (
                <Check fontSize="medium" />
              ) : (
                <ContentCopy fontSize="medium" />
              )}
            </IconButton>
          </Box>

          <TextField
            value={credentialText}
            multiline
            minRows={18}
            maxRows={40}
            slotProps={{
              input: {
                readOnly: true,
                sx: {
                  fontFamily:
                    '"JetBrains Mono", "Fira Code", "SFMono-Regular", Consolas, monospace',
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  color: "text.primary",
                  borderRadius: 1,
                  "& textarea": {
                    whiteSpace: "pre",
                    overflowX: "auto",
                  },
                },
              },
            }}
          />
        </Box>
      </SimpleDialog>

      {dataset && (
        <DatasetAccessDialog
          open={accessDialogOpen}
          datasetId={dataset.dataset.id}
          datasetName={dataset.dataset.name}
          onClose={() => setAccessDialogOpen(false)}
        />
      )}
    </Container>
  );
}
