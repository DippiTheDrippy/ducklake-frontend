import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { Dataset } from "../../types/dataset";

type DatasetCardProps = {
  dataset: Dataset;
};

export default function DatasetCard({ dataset }: Readonly<DatasetCardProps>) {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        boxShadow: "none",
        height: "100%",
        minHeight: "19vh",
        maxHeight: "19vh",
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/datasets/${dataset.id}`)}
        sx={{
          height: "100%",
          alignItems: "stretch",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {dataset.displayName || dataset.name}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "text.secondary",
                mt: 0.25,
              }}
            >
              {dataset.name}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: "0.82rem",
              color: "text.secondary",
              lineHeight: 1.6,
              flex: 1,

              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {dataset.description || "No description provided."}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mt: 0.5,
            }}
          >
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
