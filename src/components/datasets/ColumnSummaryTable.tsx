import {
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ColumnSummary } from "../../types/dataset";
import {
  formatColumnType,
  formatPercentage,
  formatValue,
} from "../../utils/datasetHelpers";

interface ColumnSummaryTableProps {
  summary: ColumnSummary[];
}

export default function ColumnSummaryTable({
  summary,
}: Readonly<ColumnSummaryTableProps>) {
  return (
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

                  <TableCell align="right">
                    {formatValue(column.rowCount)}
                  </TableCell>
                  <TableCell align="right">
                    {formatPercentage(column.null_percentage)}
                  </TableCell>
                  <TableCell align="right">
                    {formatValue(column.approxUnique)}
                  </TableCell>
                  <TableCell align="right">{formatValue(column.min)}</TableCell>
                  <TableCell align="right">{formatValue(column.q25)}</TableCell>
                  <TableCell align="right">{formatValue(column.q50)}</TableCell>
                  <TableCell align="right">{formatValue(column.q75)}</TableCell>
                  <TableCell align="right">{formatValue(column.max)}</TableCell>
                  <TableCell align="right">{formatValue(column.avg)}</TableCell>
                  <TableCell align="right">{formatValue(column.std)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}
