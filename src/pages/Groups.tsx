import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import GroupMembersCard from "../components/groups/GroupMembersCard";
import { useGroups } from "../contexts/GroupsContext";

export default function Groups() {
  const {
    groups,
    members,
    loading,
    isFetchingMore,
    hasMore,
    getGroups,
    getMoreGroups,
    getGroupMembers,
  } = useGroups();

  useEffect(() => {
    getGroups();
  }, [getGroups]);

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
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: "1.15rem",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Groups
          </Typography>

          <Typography variant="body2" color="text.secondary">
            View your Keycloak groups and inspect their members.
          </Typography>
        </Box>

        {loading && groups.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : groups.length === 0 ? (
          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>No groups found</Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              You are not currently a member of any groups.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {groups.map((group) => (
              <GroupMembersCard
                key={group.id}
                group={group}
                members={members[group.id]}
                loading={loading}
                onLoadMembers={getGroupMembers}
              />
            ))}
          </Stack>
        )}

        {groups.length > 0 && hasMore && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => getMoreGroups()}
              disabled={isFetchingMore}
            >
              {isFetchingMore ? "Loading..." : "Load more"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
