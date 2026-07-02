import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useFavorites } from "../contexts/FavoritesContext";
import DatasetGrid from "../components/datasets/DatasetGrid";

export default function Browse() {
  const {
    hasMore,
    isFetchingMore,
    favorites,
    isLoading,
    listFavorites,
    fetchMore,
  } = useFavorites();

  useEffect(() => {
    listFavorites();
  }, [listFavorites]);

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
            Favorited datasets
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            Browse your favorited datasets.
          </Typography>
        </Box>

        <DatasetGrid
          datasets={favorites}
          isLoading={isLoading}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
          onFetchMore={fetchMore}
          emptyMessage="No favorited datasets found."
        />
      </Box>
    </Container>
  );
}
