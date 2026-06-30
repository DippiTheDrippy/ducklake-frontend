import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useDatasets } from "../contexts/DatasetsContext";
import DatasetCard from "../components/datasets/DatasetCard";
import DatasetCardSkeleton from "../components/datasets/DatasetCardSkeleton";

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
  } = useDatasets();
  const [search, setSearch] = useState(lastSearch === null ? "" : lastSearch);

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
    </Container>
  );
}
