import { Box, alpha, Avatar, Typography } from "@mui/material";
import { Group, Person } from "@mui/icons-material";
import {
  getGroupSubtitle,
  getUserDisplayName,
} from "../../../utils/accessUtils";
import type { GroupWithAccess, UserWithAccess } from "../../../types/access";
import { AccessControls } from "./AccessControls";
import { useAccess } from "../../../contexts/AccessContext";

export function MemberRow({
  datasetId,
  user,
}: Readonly<{
  datasetId: string;
  user: UserWithAccess;
}>) {
  const { removeUserAccess, updateUserAccess, loading } = useAccess();

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.25,
        px: 1.25,
        py: 0.85,
        borderRadius: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha("#FFFFFF", 0.035)
            : alpha("#000000", 0.025),
        border: "1px solid",
        borderColor: "divider",
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          minWidth: 0,
          flex: 1,
        }}
      >
        <Avatar
          sx={(theme) => ({
            width: 28,
            height: 28,
            color: "text.secondary",
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha("#FFFFFF", 0.08)
                : alpha("#000000", 0.06),
            flexShrink: 0,
          })}
        >
          <Person sx={{ fontSize: 16 }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 550,
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getUserDisplayName(user)}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email || user.username}
          </Typography>
        </Box>
      </Box>

      <AccessControls
        accessLevel={user.accessLevel}
        disabled={loading}
        removing={loading}
        onAccessChange={(accessLevel) => {
          updateUserAccess(datasetId, user, accessLevel);
        }}
        onRemove={() => {
          removeUserAccess(datasetId, user);
        }}
      />
    </Box>
  );
}

export function GroupRow({
  datasetId,
  group,
}: Readonly<{
  datasetId: string;
  group: GroupWithAccess;
}>) {
  const { removeGroupAccess, updateGroupAccess, loading } = useAccess();

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.25,
        px: 1.25,
        py: 0.85,
        borderRadius: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha("#FFFFFF", 0.035)
            : alpha("#000000", 0.025),
        border: "1px solid",
        borderColor: "divider",
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          minWidth: 0,
          flex: 1,
        }}
      >
        <Avatar
          sx={(theme) => ({
            width: 28,
            height: 28,
            color: "text.secondary",
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha("#FFFFFF", 0.08)
                : alpha("#000000", 0.06),
            flexShrink: 0,
          })}
        >
          <Group sx={{ fontSize: 16 }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 550,
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {group.name}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getGroupSubtitle(group)}
          </Typography>
        </Box>
      </Box>

      <AccessControls
        accessLevel={group.accessLevel}
        disabled={loading}
        removing={loading}
        onAccessChange={(accessLevel) => {
          updateGroupAccess(datasetId, group, accessLevel);
        }}
        onRemove={() => {
          removeGroupAccess(datasetId, group);
        }}
      />
    </Box>
  );
}
