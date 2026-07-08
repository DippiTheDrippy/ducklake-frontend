import type { Dataset, DatasetWithSummary } from "../types/dataset";
import type { Credential } from "../types/credentials";
import type { Pagination } from "../types/pagination";
import { api } from "./client";
import type { Dayjs } from "dayjs";

// DATASETS

export async function getDataset(id: string): Promise<DatasetWithSummary> {
  const { data, error } = await api.GET("/api/datasets/{id}", {
    params: {
      path: {
        id: id,
      },
    },
  });

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data as DatasetWithSummary;
}

export async function listDatasets(
  pageIndex: number,
  pageSize: number,
): Promise<Pagination<Dataset>> {
  const { data, error } = await api.GET("/api/datasets", {
    params: {
      query: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
  });

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Pagination<Dataset>;
}

export async function searchDatasets(
  search: string,
  pageIndex: number,
  pageSize: number,
): Promise<Pagination<Dataset>> {
  const { data, error } = await api.GET("/api/datasets/search", {
    params: {
      query: {
        search: search,
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
  });

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Pagination<Dataset>;
}

// ADMIN

export async function createDatasetFromFile(
  metadata: {
    name: string;
    displayName: string;
    description: string;
    isPublic: boolean;
  },
  file: File,
): Promise<Dataset> {
  const { data, error } = await api.POST("/api/datasets", {
    body: {
      metadata,
      file: file as unknown as string,
    },
    bodySerializer() {
      const formData = new FormData();

      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], {
          type: "application/json",
        }),
      );

      formData.append("file", file, file.name);

      return formData;
    },
  });

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Dataset;
}

export async function appendDataFromFile(id: string, file: File) {
  const { data, error } = await api.POST("/api/datasets/append/{id}", {
    params: {
      path: {
        id: id,
      },
    },
    body: {
      file: file as unknown as string,
    },
    bodySerializer() {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return formData;
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function updateDataset(
  id: string,
  body: {
    displayName: string;
    description: string;
    isPublic: boolean;
  },
) {
  const { data, error } = await api.PUT("/api/datasets/{id}", {
    params: {
      path: {
        id: id,
      },
    },
    body,
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function deleteDataset(id: string) {
  const { data, error } = await api.DELETE("/api/datasets/{id}", {
    params: {
      path: {
        id: id,
      },
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}
