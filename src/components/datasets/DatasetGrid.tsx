import { Box, Button, Typography } from "@mui/material";

import type { Dataset } from "../../types/dataset";
import DatasetCard from "./DatasetCard";
import DatasetCardSkeleton from "./DatasetCardSkeleton";

const DEFAULT_SKELETON_COUNT = 4;

interface DatasetGridProps {
  datasets: Dataset[];
  isLoading: boolean;
  emptyMessage?: string;
  skeletonCount?: number;

  hasMore?: boolean;
  isFetchingMore?: boolean;
  onFetchMore?: () => void;
}

export default function DatasetGrid({
  datasets,
  isLoading,
  emptyMessage = "No datasets found.",
  skeletonCount = DEFAULT_SKELETON_COUNT,
  hasMore = false,
  isFetchingMore = false,
  onFetchMore,
}: DatasetGridProps) {
  const showEmptyState = !isLoading && datasets.length === 0;
  const showLoadMore = hasMore && !isLoading && onFetchMore;

  if (showEmptyState) {
    return (
      <Typography
        sx={{
          fontSize: "0.85rem",
          color: "text.secondary",
        }}
      >
        {emptyMessage}
      </Typography>
    );
  }

  return (
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
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <DatasetCardSkeleton key={index} />
            ))
          : datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
      </Box>

      {showLoadMore ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <Button
            onClick={onFetchMore}
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
  );
}
