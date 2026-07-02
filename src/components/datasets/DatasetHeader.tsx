import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import {
  DeleteForeverOutlined,
  Favorite,
  FavoriteBorder,
  UploadFileOutlined,
} from "@mui/icons-material";
import type { Dataset as DatasetInfo } from "../../types/dataset";
import { useFavorites } from "../../contexts/FavoritesContext";

interface DatasetHeaderProps {
  dataset: DatasetInfo;
  isAdmin: boolean;
  isLoading: boolean;
  onDelete: () => void;
  onUpload?: () => void;
}

export default function DatasetHeader({
  dataset,
  isAdmin,
  isLoading,
  onDelete,
  onUpload,
}: Readonly<DatasetHeaderProps>) {
  const { isFavorite, favoriteDataset, unfavoriteDataset } = useFavorites();
  const isFavorited = isFavorite(dataset.id);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mb: 1,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "text.primary",
              letterSpacing: "-0.03em",
            }}
          >
            {dataset.displayName || dataset.name}
          </Typography>

          <Chip
            label={dataset.bucketName}
            size="small"
            variant="outlined"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              color: "text.secondary",
              borderColor: "divider",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
            maxWidth: 760,
            lineHeight: 1.7,
          }}
        >
          {dataset.description || "No description provided."}
        </Typography>
      </Box>

      {isAdmin && (
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button
            aria-label="Delete dataset"
            color="error"
            disabled={isLoading}
            onClick={onDelete}
            size="small"
            sx={{
              backgroundColor: "error.main",
              color: "error.contrastText",
            }}
          >
            <DeleteForeverOutlined fontSize="medium" />
          </Button>

          <Button
            aria-label="Upload file"
            color="success"
            disabled={isLoading}
            onClick={onUpload}
            size="small"
            sx={{
              backgroundColor: "success.main",
              color: "success.contrastText",
            }}
          >
            <UploadFileOutlined fontSize="medium" />
          </Button>

          <IconButton
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
            color="primary"
            disabled={isLoading}
            onClick={
              isFavorited
                ? () => unfavoriteDataset(dataset.id)
                : () => favoriteDataset(dataset)
            }
            size="medium"
          >
            {isFavorited ? (
              <Favorite fontSize="large" />
            ) : (
              <FavoriteBorder fontSize="large" />
            )}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
