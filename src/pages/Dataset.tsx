import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

import ConfirmDialog from "../components/ConfirmDialog";
import ColumnSummaryTable from "../components/datasets/ColumnSummaryTable";
import DatasetHeader from "../components/datasets/DatasetHeader";
import DatasetMetadata from "../components/datasets/DatasetMetadata";
import DatasetPageSkeleton from "../components/datasets/DatasetPageSkeleton";
import { useDatasets } from "../contexts/DatasetsContext";
import { useUser } from "../contexts/UserContext";
import Message from "./Message";
import UploadDialog from "../components/UploadDialog";

export default function Dataset() {
  const { id } = useParams<{ id: string }>();
  const { isAuthReady, isAdmin, isAuthenticated } = useUser();
  const { dataset, getDataset, deleteDataset, uploadDatasetFile, isLoading } =
    useDatasets();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const navigate = useNavigate();

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
    </Container>
  );
}
