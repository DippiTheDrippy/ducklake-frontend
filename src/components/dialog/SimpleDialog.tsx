import { useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  type DialogProps,
} from "@mui/material";

type SimpleDialogProps = Readonly<{
  open: boolean;
  title?: string;
  description?: ReactNode;
  buttonLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string | null;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  closeOnComplete?: boolean;
  onClose: () => void;
  onComplete: () => Promise<void> | void;
  children?: ReactNode;
}>;

export default function SimpleDialog({
  open,
  title = "Dialog",
  description,
  buttonLabel = "Save",
  loadingLabel = "Saving...",
  cancelLabel = "Cancel",
  isLoading = false,
  disabled = false,
  error = null,
  maxWidth = "sm",
  fullWidth = true,
  closeOnComplete = true,
  onClose,
  onComplete,
  children,
}: SimpleDialogProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const busy = isLoading || isCompleting;
  const completeDisabled = busy || disabled;
  const visibleError = error ?? internalError;

  const handleClose = () => {
    if (!busy) {
      setInternalError(null);
      onClose();
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      setInternalError(null);

      await onComplete();

      if (closeOnComplete) {
        onClose();
      }
    } catch (err) {
      setInternalError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          {busy && <LinearProgress />}

          {visibleError && <Alert severity="error">{visibleError}</Alert>}

          {description && (
            <DialogContentText
              sx={{
                fontSize: "0.85rem",
                color: "text.secondary",
              }}
            >
              {description}
            </DialogContentText>
          )}

          {children}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={busy}
          color="inherit"
          size="small"
        >
          {cancelLabel}
        </Button>

        {buttonLabel !== "" && (
          <Button
            onClick={handleComplete}
            disabled={completeDisabled}
            variant="contained"
            size="small"
          >
            {busy ? loadingLabel : buttonLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
