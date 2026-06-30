import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function DatasetCardSkeleton() {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        boxShadow: "none",
        height: "100%",
        maxHeight: "19vh",
        minHeight: "19vh",
      }}
    >
      <CardContent
        sx={{
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
          <Skeleton variant="text" width="65%" height={24} />
          <Skeleton variant="text" width="40%" height={18} />
        </Box>

        <Box>
          <Skeleton variant="text" width="100%" height={18} />
          <Skeleton variant="text" width="90%" height={18} />
          <Skeleton variant="text" width="72%" height={18} />
        </Box>

        <Box sx={{ mt: 0.5 }}>
          <Skeleton
            variant="rounded"
            width={90}
            height={18}
            sx={{ borderRadius: 999 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
