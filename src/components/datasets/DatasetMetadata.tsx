import { Box, Paper, Typography } from "@mui/material";
import type { Dataset as DatasetInfo } from "../../types/dataset";

interface DatasetMetadataProps {
  dataset: DatasetInfo;
  columnCount: number;
}

export default function DatasetMetadata({
  dataset,
  columnCount,
}: Readonly<DatasetMetadataProps>) {
  const metadata = [
    { label: "Dataset ID", value: dataset.id },
    { label: "Name", value: dataset.name },
    { label: "Bucket", value: dataset.bucketName },
    { label: "Columns", value: columnCount },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        boxShadow: "none",
        p: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.95rem",
          fontWeight: 500,
          mb: 2,
        }}
      >
        Metadata
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {metadata.map((item) => (
          <Box key={item.label}>
            <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "text.primary" }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
