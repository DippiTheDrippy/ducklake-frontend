import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDatasets } from "../contexts/DatasetsContext";
import type { Dataset } from "../types/dataset";

export default function Browse() {
  const navigate = useNavigate();
  const { datasets, isLoading, searchDatasets } = useDatasets();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      searchDatasets(search);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, searchDatasets]);

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
            Browse datasets
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            Search datasets by name or description.
          </Typography>
        </Box>

        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search datasets"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            maxWidth: 520,
            "& .MuiInputBase-root": {
              fontSize: "0.85rem",
              backgroundColor: "background.paper",
            },
          }}
        />

        {isLoading ? (
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            Loading datasets...
          </Typography>
        ) : datasets.length === 0 ? (
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
            }}
          >
            No datasets found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {datasets.map((dataset: Dataset) => (
              <Card
                key={dataset.id}
                variant="outlined"
                sx={{
                  backgroundColor: "background.paper",
                  borderColor: "divider",
                  boxShadow: "none",
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

                    {"description" in dataset && (
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: "text.secondary",
                          lineHeight: 1.6,
                        }}
                      >
                        {dataset.description || "No description provided."}
                      </Typography>
                    )}

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
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
