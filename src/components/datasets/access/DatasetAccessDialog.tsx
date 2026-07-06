import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

import SimpleDialog from "../../dialog/SimpleDialog";
import { useAccess } from "../../../contexts/AccessContext";
import {
  getGroupSubtitle,
  getUserDisplayName,
} from "../../../utils/accessUtils";
import type { AccessLevel } from "../../../types/access";
import type { Group } from "../../../types/groups";
import type { User } from "../../../types/user";
import SearchResultRow from "./SearchRow";
import { GroupRow, MemberRow } from "./DisplayRows";

type AccessTab = "users" | "groups";

type DatasetAccessDialogProps = Readonly<{
  open: boolean;
  datasetId: string;
  datasetName?: string;
  onClose: () => void;
}>;

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_ACCESS_LEVEL: AccessLevel = "READ";

export default function DatasetAccessDialog({
  open,
  datasetId,
  datasetName,
  onClose,
}: DatasetAccessDialogProps) {
  const access = useAccess();

  const [activeTab, setActiveTab] = useState<AccessTab>("users");
  const [search, setSearch] = useState("");
  const [userResults, setUserResults] = useState<User[]>([]);
  const [groupResults, setGroupResults] = useState<Group[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedSearch = search.trim();

  const title = datasetName
    ? `Manage access for ${datasetName}`
    : "Manage dataset access";

  const currentUsers = access.usersWithAccess;
  const currentGroups = access.groupsWithAccess;
  const activeResultCount =
    activeTab === "users" ? userResults.length : groupResults.length;

  useEffect(() => {
    if (!open || !datasetId) return;

    resetSearchState();

    access.getDatasetAccess(datasetId);
  }, [open, datasetId, access.getDatasetAccess]);

  useEffect(() => {
    if (!open || !normalizedSearch) {
      setSearching(false);
      setUserResults([]);
      setGroupResults([]);
      return;
    }

    let cancelled = false;

    setSearching(true);
    setError(null);

    const timeoutId = window.setTimeout(async () => {
      try {
        if (activeTab === "users") {
          const users = await access.searchUsers(normalizedSearch);

          if (!cancelled) {
            setUserResults(users);
            setGroupResults([]);
          }

          return;
        }

        const groups = await access.searchGroups(normalizedSearch);

        if (!cancelled) {
          setGroupResults(groups);
          setUserResults([]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("search access targets:", err);
          setError(
            activeTab === "users"
              ? "Failed to search users."
              : "Failed to search groups.",
          );
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    open,
    activeTab,
    normalizedSearch,
    access.searchUsers,
    access.searchGroups,
  ]);

  const searchHelpText = useMemo(() => {
    if (
      !normalizedSearch ||
      searching ||
      access.loading ||
      activeResultCount > 0
    )
      return null;

    return activeTab === "users" ? "No users found." : "No groups found.";
  }, [
    activeTab,
    activeResultCount,
    normalizedSearch,
    searching,
    access.loading,
  ]);

  const handleTabChange = (_: unknown, value: AccessTab) => {
    setActiveTab(value);
    resetSearchState();
  };

  function resetSearchState() {
    setSearch("");
    setUserResults([]);
    setGroupResults([]);
    setSearching(false);
    setError(null);
  }

  return (
    <SimpleDialog
      open={open}
      title={title}
      description="Grant access to individual users or groups. New entries are added with READ access by default."
      buttonLabel=""
      cancelLabel="Close"
      maxWidth="md"
      fullWidth
      isLoading={access.loading}
      error={error}
      closeOnComplete={false}
      onClose={onClose}
      onComplete={() => undefined}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab value="users" label="Users" />
          <Tab value="groups" label="Groups" />
        </Tabs>

        <Box>
          <SectionLabel>Current access</SectionLabel>

          {activeTab === "users" ? (
            <AccessListEmptyState
              visible={!access.loading && currentUsers.length === 0}
              label="No users have direct access yet."
            />
          ) : (
            <AccessListEmptyState
              visible={!access.loading && currentGroups.length === 0}
              label="No groups have access yet."
            />
          )}

          <Stack spacing={1}>
            {activeTab === "users" &&
              currentUsers.map((user) => (
                <MemberRow key={user.id} datasetId={datasetId} user={user} />
              ))}

            {activeTab === "groups" &&
              currentGroups.map((group) => (
                <GroupRow key={group.id} datasetId={datasetId} group={group} />
              ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <SectionLabel>
            Add {activeTab === "users" ? "user" : "group"}
          </SectionLabel>

          <TextField
            fullWidth
            size="small"
            value={search}
            placeholder={
              activeTab === "users"
                ? "Search users by name, username, or email"
                : "Search groups by name"
            }
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {activeTab === "users" &&
              userResults.map((user) => (
                <SearchResultRow
                  key={user.id}
                  icon={<PersonIcon fontSize="small" />}
                  title={getUserDisplayName(user)}
                  subtitle={user.email || user.username || user.id}
                  alreadyAdded={access.existingUserIds.has(user.id)}
                  adding={access.loading}
                  onAdd={() =>
                    access.addUserAccess(datasetId, user, DEFAULT_ACCESS_LEVEL)
                  }
                />
              ))}

            {activeTab === "groups" &&
              groupResults.map((group) => (
                <SearchResultRow
                  key={group.id}
                  icon={<GroupsIcon fontSize="small" />}
                  title={group.name}
                  subtitle={getGroupSubtitle(group)}
                  alreadyAdded={access.existingGroupIds.has(group.id)}
                  adding={access.loading}
                  onAdd={() =>
                    access.addGroupAccess(
                      datasetId,
                      group,
                      DEFAULT_ACCESS_LEVEL,
                    )
                  }
                />
              ))}

            {searchHelpText && (
              <Typography variant="body2" color="text.secondary">
                {searchHelpText}
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </SimpleDialog>
  );
}

function SectionLabel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Typography
      sx={{
        fontSize: "0.8rem",
        fontWeight: 650,
        color: "text.secondary",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

function AccessListEmptyState({
  visible,
  label,
}: Readonly<{
  visible: boolean;
  label: string;
}>) {
  if (!visible) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        borderStyle: "dashed",
        color: "text.secondary",
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );
}
