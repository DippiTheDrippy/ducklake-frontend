import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import {
  DeleteForeverOutlined,
  Favorite,
  FavoriteBorder,
  Key,
  PersonAdd,
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
  onCreateCredentials?: () => void;
  onAccess?: () => void;
}

export default function DatasetHeader({
  dataset,
  isAdmin,
  isLoading,
  onDelete,
  onUpload,
  onCreateCredentials,
  onAccess,
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
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          width: "100%",
        }}
      >
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

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexShrink: 0,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", md: "flex-end" },
          width: { xs: "100%", md: "auto" },
        }}
      >
        {isAdmin && (
          <Box
            sx={{
              display: "inline-flex",
              gap: 1,
              outline: (theme) => `2px solid ${theme.palette.divider}`,
              outlineOffset: "8px",
              borderRadius: 1,
            }}
          >
            <Button
              aria-label="Delete dataset"
              color="error"
              disabled={isLoading}
              onClick={onDelete}
              size="small"
              sx={{
                backgroundColor: "error.main",
                color: "error.contrastText",
                width: "3rem",
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
                width: "3rem",
              }}
            >
              <UploadFileOutlined fontSize="medium" />
            </Button>

            <Button
              aria-label="Grant Access"
              color="success"
              disabled={isLoading}
              onClick={onAccess}
              size="small"
              sx={{
                backgroundColor: "success.main",
                color: "success.contrastText",
                width: "3rem",
              }}
            >
              <PersonAdd fontSize="medium" />
            </Button>
          </Box>
        )}
        <Box
          sx={{
            display: "inline-flex",
            gap: 1,
            outline: (theme) => `2px solid ${theme.palette.divider}`,
            outlineOffset: "8px",
            borderRadius: 1,
          }}
        >
          <Button
            aria-label="Delete dataset"
            color="warning"
            disabled={isLoading}
            onClick={onCreateCredentials}
            size="small"
            sx={{
              backgroundColor: "warning.main",
              color: "warning.contrastText",
              width: "3rem",
            }}
          >
            <Key fontSize="medium" />
          </Button>
          <Button
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
            color="error"
            disabled={isLoading}
            onClick={
              isFavorited
                ? () => unfavoriteDataset(dataset.id)
                : () => favoriteDataset(dataset)
            }
            size="medium"
            sx={{
              color: "error.main",
              width: "3rem",
            }}
          >
            {isFavorited ? (
              <Favorite fontSize="medium" />
            ) : (
              <FavoriteBorder fontSize="medium" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
