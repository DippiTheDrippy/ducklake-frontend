import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useDatasets } from "../contexts/DatasetsContext";
import { DeleteForeverOutlined, UploadFileOutlined } from "@mui/icons-material";
import ConfirmDialog from "../components/ConfirmDialog";

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return value;
}

function formatPercentage(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function formatColumnType(type: string) {
  return type
    .replaceAll("(", "(\n")
    .replaceAll(")", "\n)")
    .replaceAll(",", ",\n");
}

export default function Dataset() {
  const { id } = useParams<{ id: string }>();
  const { dataset, getDataset, deleteDataset, isLoading } = useDatasets();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    if (dataset?.dataset.id !== id) {
      getDataset(id);
    }
  }, [id, dataset?.dataset.id, getDataset]);

  if (!id) {
    return (
      <Container maxWidth={false}>
        <Typography color="text.secondary">No dataset ID provided.</Typography>
      </Container>
    );
  }

  if (dataset?.dataset.id !== id) {
    return (
      <Container maxWidth={false}>
        <Typography color="text.secondary">Loading dataset...</Typography>
      </Container>
    );
  }

  const { dataset: info, summary } = dataset;

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
            justifyContent: "space-between",
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
                {info.displayName || info.name}
              </Typography>

              <Chip
                label={info.bucketName}
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
              {info.description || "No description provided."}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              maxHeight: "4vh",
            }}
          >
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="contained"
              size="small"
              disabled={isLoading}
              sx={{
                backgroundColor: "error.main",
              }}
            >
              <DeleteForeverOutlined />
            </Button>
            <Button
              onClick={() => {}}
              variant="contained"
              size="small"
              disabled={isLoading}
              sx={{
                backgroundColor: "success.main",
              }}
            >
              <UploadFileOutlined />
            </Button>
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
            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                Dataset ID
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "text.primary" }}>
                {info.id}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                Name
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "text.primary" }}>
                {info.name}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                Bucket
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "text.primary" }}>
                {info.bucketName}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                Columns
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "text.primary" }}>
                {summary.length}
              </Typography>
            </Box>
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
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              Column summary
            </Typography>

            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              Statistical overview of each column in this dataset.
            </Typography>
          </Box>

          <Divider />

          {summary.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                No column summary available.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Column</TableCell>
                    <TableCell size="medium">Type</TableCell>
                    <TableCell align="right">Rows</TableCell>
                    <TableCell align="right">Nulls</TableCell>
                    <TableCell align="right">Unique</TableCell>
                    <TableCell align="right">Min</TableCell>
                    <TableCell align="right">Q25</TableCell>
                    <TableCell align="right">Median</TableCell>
                    <TableCell align="right">Q75</TableCell>
                    <TableCell align="right">Max</TableCell>
                    <TableCell align="right">Avg</TableCell>
                    <TableCell align="right">Std</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {summary.map((column) => (
                    <TableRow
                      key={column.columnName}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "text.primary",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {column.columnName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={formatColumnType(column.columnType)}
                          size="small"
                          variant="outlined"
                          sx={{
                            minHeight: 22,
                            height: "auto",
                            fontSize: "0.7rem",
                            borderColor: "divider",
                            color: "text.secondary",

                            "& .MuiChip-label": {
                              display: "block",
                              whiteSpace: "pre-line",
                              py: 0.4,
                              lineHeight: 1.35,
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">{column.rowCount}</TableCell>
                      <TableCell align="right">
                        {formatPercentage(column.null_percentage)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.approxUnique)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.min)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.q25)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.q50)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.q75)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.max)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.avg)}
                      </TableCell>
                      <TableCell align="right">
                        {formatValue(column.std)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Box>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete dataset?"
        message="This will permanently delete the dataset. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (!id) return;

          await deleteDataset(id);
          setDeleteDialogOpen(false);
          navigate("/browse");
        }}
      />
    </Container>
  );
}
