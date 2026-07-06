import {
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import type { AccessLevel } from "../../../types/access";
import { DeleteOutlined } from "@mui/icons-material";

export function AccessControls({
  accessLevel,
  disabled,
  removing,
  onAccessChange,
  onRemove,
}: Readonly<{
  accessLevel: AccessLevel;
  disabled: boolean;
  removing: boolean;
  onAccessChange: (accessLevel: AccessLevel) => void;
  onRemove: () => void;
}>) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: "center", flexShrink: 0 }}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={accessLevel}
        disabled={disabled}
        onChange={(_, value: AccessLevel | null) => {
          if (value) onAccessChange(value);
        }}
        sx={{
          "& .MuiToggleButton-root": {
            px: 1.25,
            py: 0.35,
            fontSize: "0.72rem",
            fontWeight: 650,
          },
        }}
      >
        <ToggleButton value="READ">Read</ToggleButton>
        <ToggleButton value="WRITE">Write</ToggleButton>
      </ToggleButtonGroup>

      <Tooltip title="Remove access">
        <span>
          <IconButton size="small" disabled={disabled} onClick={onRemove}>
            {removing ? (
              <CircularProgress size={18} />
            ) : (
              <DeleteOutlined fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
