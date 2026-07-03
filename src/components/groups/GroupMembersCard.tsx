import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import type { Group } from "../../types/groups";
import type { User } from "../../types/user";

interface GroupMembersCardProps {
  group: Group;
  members: User[] | undefined;
  loading?: boolean;
  onLoadMembers: (groupId: string) => Promise<void>;
}

export default function GroupMembersCard({
  group,
  members,
  loading = false,
  onLoadMembers,
}: Readonly<GroupMembersCardProps>) {
  const [expanded, setExpanded] = useState(false);

  const hasLoadedMembers = members !== undefined;
  const memberList = members ?? [];

  const handleToggle = async () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    if (nextExpanded && members === undefined) {
      await onLoadMembers(group.id);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 2.5,
        overflow: "hidden",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition:
          "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.45),
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 10px 28px ${alpha("#000", 0.28)}`
              : `0 10px 28px ${alpha("#000", 0.08)}`,
        },
      })}
    >
      <CardActionArea
        onClick={handleToggle}
        sx={{
          px: 1.75,
          py: 1.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={(theme) => ({
                width: 40,
                height: 40,
                color: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              })}
            >
              <GroupsIcon sx={{ fontSize: 19 }} />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.90rem",
                  fontWeight: 650,
                  lineHeight: 1.25,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {group.name}
              </Typography>

              {"path" in group && group.path && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 0.15,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.path}
                </Typography>
              )}
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {hasLoadedMembers && (
              <Chip
                size="small"
                variant="outlined"
                label={`${memberList.length} member${
                  memberList.length === 1 ? "" : "s"
                }`}
                sx={{
                  height: 24,
                  fontSize: "0.72rem",
                  borderRadius: 999,
                }}
              />
            )}

            <IconButton
              component="span"
              size="small"
              aria-label={expanded ? "Collapse group" : "Expand group"}
              sx={{
                width: 30,
                height: 30,
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 160ms ease",
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />

        <Box sx={{ px: 1.75, py: 1.25 }}>
          {loading && !hasLoadedMembers ? (
            <Typography variant="body2" color="text.secondary">
              Loading members...
            </Typography>
          ) : memberList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No members found.
            </Typography>
          ) : (
            <Stack spacing={0.75}>
              {memberList.map((user) => {
                const displayName =
                  user.firstName || user.lastName
                    ? `${user.firstName} ${user.lastName}`.trim()
                    : user.username;

                return (
                  <Box
                    key={user.id}
                    sx={(theme) => ({
                      display: "flex",
                      alignItems: "center",
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
                    <Avatar
                      sx={(theme) => ({
                        width: 28,
                        height: 28,
                        color: "text.secondary",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? alpha("#FFFFFF", 0.08)
                            : alpha("#000000", 0.06),
                      })}
                    >
                      <PersonIcon sx={{ fontSize: 16 }} />
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
                        {displayName}
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
                );
              })}
            </Stack>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}
