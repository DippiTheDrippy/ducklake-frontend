import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  color?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  loadingLabel = "Deleting...",
  cancelLabel = "Cancel",
  isLoading = false,
  color = "error.main",
  onConfirm,
  onClose,
}: Readonly<ConfirmDialogProps>) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
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
        <DialogContentText
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          color="inherit"
          size="small"
        >
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: color,
          }}
        >
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
