import type { Dataset, DatasetWithSummary } from "../types/dataset";
import type { Credential } from "../types/credentials";
import type { Pagination } from "../types/pagination";
import { api } from "./client";
import type { Dayjs } from "dayjs";

export async function listCredentials(
  pageIndex: number,
  pageSize: number,
): Promise<Pagination<Credential>> {
  const { data, error } = await api.GET("/api/credentials", {
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

  return data as Pagination<Credential>;
}

export async function getDatasetCredential(
  datasetId: string,
): Promise<Credential> {
  const { data, error } = await api.GET("/api/credentials/dataset/{id}", {
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

  return data as Credential;
}

export async function createDatasetCredential(
  datasetId: string,
  name: string,
  accessLevel: "READ" | "WRITE",
  expiresAt: Dayjs | null,
  neverExpires: boolean,
): Promise<Credential> {
  const { data, error } = await api.POST("/api/credentials/dataset/{id}", {
    params: {
      path: {
        id: datasetId,
      },
    },
    body: {
      name: name,
      access: accessLevel,
      expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
      neverExpires: neverExpires,
    },
  });

  if (!data || error) {
    console.error("API error:", error);
    throw new Error(error);
  }

  return data as Credential;
}

export async function rotateDatasetCredential(
  credentialId: string,
): Promise<Credential> {
  const { data, error } = await api.POST(
    "/api/credentials/dateset/{id}/rotate",
    {
      params: {
        path: {
          id: credentialId,
        },
      },
    },
  );

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data as Credential;
}

export async function deleteCredential(credentialId: string) {
  const { data, error } = await api.DELETE("/api/credentials/{id}", {
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
