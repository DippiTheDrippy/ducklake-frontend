import {
  Box,
  Container,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const SKELETON_ROWS = 8;
const SKELETON_COLUMNS = 12;

export default function DatasetPageSkeleton() {
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        px: 0,
      }}
    >
      <Box
        aria-busy="true"
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
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 760 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Skeleton variant="text" width="45%" height={34} />
              <Skeleton variant="rounded" width={96} height={22} />
            </Box>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="70%" />
          </Box>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
            <Skeleton variant="rounded" width={40} height={34} />
            <Skeleton variant="rounded" width={40} height={34} />
          </Box>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            borderColor: "divider",
            boxShadow: "none",
            p: 2,
          }}
        >
          <Skeleton variant="text" width={90} height={28} sx={{ mb: 2 }} />

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
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index}>
                <Skeleton variant="text" width={70} height={20} />
                <Skeleton variant="text" width="80%" height={24} />
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            borderColor: "divider",
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width={140} height={28} />
            <Skeleton variant="text" width={280} height={22} />
          </Box>

          <Divider />

          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {Array.from({ length: SKELETON_COLUMNS }).map((_, index) => (
                    <TableCell key={index} align={index > 1 ? "right" : "left"}>
                      <Skeleton variant="text" width={index === 0 ? 90 : 52} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: SKELETON_COLUMNS }).map((_, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        align={cellIndex > 1 ? "right" : "left"}
                      >
                        <Skeleton
                          variant="text"
                          width={cellIndex === 0 ? 120 : cellIndex === 1 ? 86 : 58}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
