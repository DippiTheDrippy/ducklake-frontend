import { Add } from "@mui/icons-material";
import {
  Paper,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export default function SearchResultRow({
  icon,
  title,
  subtitle,
  alreadyAdded,
  adding,
  onAdd,
}: Readonly<{
  icon: ReactNode;
  title: string;
  subtitle?: string;
  alreadyAdded: boolean;
  adding: boolean;
  onAdd: () => Promise<void> | void;
}>) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: 2,
      }}
    >
      <SubjectSummary icon={icon} title={title} subtitle={subtitle} />

      {alreadyAdded ? (
        <Chip size="small" label="Already added" />
      ) : (
        <Button
          size="small"
          variant="outlined"
          startIcon={
            adding ? <CircularProgress size={14} /> : <Add fontSize="small" />
          }
          disabled={adding}
          onClick={onAdd}
        >
          Add
        </Button>
      )}
    </Paper>
  );
}

function SubjectSummary({
  icon,
  title,
  subtitle,
}: Readonly<{
  icon: ReactNode;
  title: string;
  subtitle?: string;
}>) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{ alignItems: "center", minWidth: 0 }}
    >
      <Avatar
        sx={{
          width: 30,
          height: 30,
          color: "primary.main",
          backgroundColor: "action.hover",
          flexShrink: 0,
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.88rem",
            fontWeight: 550,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
