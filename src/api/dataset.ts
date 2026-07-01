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

  if (error) {
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

  if (error) {
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

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Pagination<Dataset>;
}

// FAVORTIES

export async function listFavorites(pageIndex: number, pageSize: number) {
  const { data, error } = await api.GET("/api/datasets/favorite", {
    params: {
      query: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function favoriteDataset(id: string) {
  const { data, error } = await api.POST("/api/datasets/favorite/{id}", {
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

export async function unfavoriteDataset(id: string) {
  const { data, error } = await api.DELETE("/api/datasets/favorite/{id}", {
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

// CREDENTIALS

export async function listCredentials(
  pageIndex: number,
  pageSize: number,
): Promise<Pagination<Credential>> {
  const { data, error } = await api.GET("/api/datasets/credentials", {
    params: {
      query: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Pagination<Credential>;
}

export async function getDatasetCredential(datasetId: string) {
  const { data, error } = await api.GET("/api/datasets/{id}/credentials", {
    params: {
      path: {
        id: datasetId,
      },
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function createDatasetCredential(
  datasetId: string,
  accessLevel: "READ" | "WRITE",
  expiresAt: Dayjs,
  neverExpires: boolean,
): Promise<Credential> {
  const { data, error } = await api.POST("/api/datasets/{id}/credentials", {
    params: {
      path: {
        id: datasetId,
      },
    },
    body: {
      access: accessLevel,
      expiresAt: expiresAt.toISOString(),
      neverExpires: neverExpires,
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Credential;
}

export async function rotateDatasetCredential(
  credentialId: string,
): Promise<Credential> {
  const { data, error } = await api.POST(
    "/api/datasets/credentials/{id}/rotate",
    {
      params: {
        path: {
          id: credentialId,
        },
      },
    },
  );

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Credential;
}

export async function deleteCredential(credentialId: string) {
  const { data, error } = await api.DELETE("/api/datasets/credentials/{id}", {
    params: {
      path: {
        id: credentialId,
      },
    },
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}
