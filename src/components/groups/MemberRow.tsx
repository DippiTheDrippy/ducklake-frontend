import { Box, alpha, Avatar, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { getUserDisplayName } from "../../utils/accessUtils";
import type { User } from "../../types/user";

interface MemberRowProps {
  user: User;
}

export function MemberRow({ user }: Readonly<MemberRowProps>) {
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
    </Box>
  );
}
