import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";

interface UploadDialogProps {
  title: string;
  description: string;
  open: boolean;
  isLoading?: boolean;
  accept?: string;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  onUploaded?: () => Promise<void> | void;
}

export default function UploadDialog({
  title = "Upload file",
  description = "Select a file to upload to this dataset.",
  open,
  isLoading = false,
  accept = ".csv,.json,.parquet",
  onClose,
  onUpload,
  onUploaded,
}: Readonly<UploadDialogProps>) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const disabled = isLoading || isUploading;

  useEffect(() => {
    if (!open) {
      setFile(null);
      setError(null);
      setIsUploading(false);
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      await onUpload(file);
      await onUploaded?.();

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={disabled ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          {isUploading && <LinearProgress />}

          {error && <Alert severity="error">{error}</Alert>}

          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
            {description}
          </Typography>

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileOutlined />}
            disabled={disabled}
            sx={{
              alignSelf: "flex-start",
              textTransform: "none",
            }}
          >
            Choose file
            <input
              hidden
              type="file"
              accept={accept}
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Box>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                Selected file
              </Typography>

              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                {file.name}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={disabled}>
          Cancel
        </Button>

        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={disabled || !file}
          sx={{
            backgroundColor: "success.main",
            color: "success.contrastText",
          }}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
