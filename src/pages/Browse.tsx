import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useDatasets } from "../contexts/DatasetsContext";
import DatasetCard from "../components/datasets/DatasetCard";
import DatasetCardSkeleton from "../components/datasets/DatasetCardSkeleton";
import { AddOutlined } from "@mui/icons-material";
import UploadDialog from "../components/UploadDialog";
import { useUser } from "../contexts/UserContext";

const SKELETON_COUNT = 4;

export default function Browse() {
  const {
    hasMore,
    isFetchingMore,
    lastSearch,
    datasets,
    isLoading,
    searchDatasets,
    fetchMore,
    createDataset,
  } = useDatasets();
  const { isAdmin } = useUser();
  const [search, setSearch] = useState(lastSearch ?? "");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    name: "",
    displayName: "",
    description: "",
    isPublic: false,
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      searchDatasets(search);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, searchDatasets]);

  const showEmptyState = !isLoading && datasets.length === 0;

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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Browse datasets
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "text.secondary",
                }}
              >
                Search datasets by name or description.
              </Typography>
            </Box>

            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search datasets"
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                maxWidth: 520,
                "& .MuiInputBase-root": {
                  fontSize: "0.85rem",
                  backgroundColor: "background.paper",
                },
              }}
            />
          </Box>
          {isAdmin && (
            <Box
              sx={{
                mt: "auto",
              }}
            >
              <Button
                aria-label="Create dataset"
                color="success"
                disabled={isLoading}
                onClick={() => setUploadDialogOpen(true)}
                size="small"
                sx={{
                  backgroundColor: "success.main",
                  color: "success.contrastText",
                }}
              >
                <AddOutlined fontSize="medium" />
              </Button>
            </Box>
          )}
        </Box>

        {showEmptyState ? (
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            No datasets found.
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                    <DatasetCardSkeleton key={index} />
                  ))
                : datasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                  ))}
            </Box>

            {hasMore && !isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <Button
                  onClick={() => {
                    fetchMore();
                  }}
                  disabled={isFetchingMore}
                  variant="outlined"
                  size="large"
                  sx={{
                    minWidth: 120,
                  }}
                >
                  {isFetchingMore ? "Loading..." : "Load more"}
                </Button>
              </Box>
            ) : null}
          </>
        )}
      </Box>

      <UploadDialog
        open={uploadDialogOpen}
        isLoading={
          isLoading || metadata.name === "" || metadata.displayName === ""
        }
        onClose={() => setUploadDialogOpen(false)}
        onUpload={(file) => createDataset(metadata, file)}
        title="Create dataset"
        description="Select a file to create a new dataset."
        create={true}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Name"
            value={metadata.name}
            onChange={(event) =>
              setMetadata((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            size="small"
            fullWidth
            required
          />

          <TextField
            label="Display name"
            value={metadata.displayName}
            onChange={(event) =>
              setMetadata((prev) => ({
                ...prev,
                displayName: event.target.value,
              }))
            }
            size="small"
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={metadata.description}
            onChange={(event) =>
              setMetadata((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            size="small"
            fullWidth
            multiline
            minRows={3}
          />

          <FormControlLabel
            control={
              <Switch
                checked={metadata.isPublic}
                onChange={(event) =>
                  setMetadata((prev) => ({
                    ...prev,
                    isPublic: event.target.checked,
                  }))
                }
              />
            }
            label="Public dataset"
          />
        </Box>
      </UploadDialog>
    </Container>
  );
}
