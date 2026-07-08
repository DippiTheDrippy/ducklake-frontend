import type { Dataset } from "../types/dataset";
import type { Pagination } from "../types/pagination";
import { api } from "./client";

export async function listFavorites(
  pageIndex: number,
  pageSize: number,
): Promise<Pagination<Dataset>> {
  const { data, error } = await api.GET("/api/favorites", {
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

export async function favoriteDataset(id: string) {
  const { data, error } = await api.POST("/api/favorites/{id}", {
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
  const { data, error } = await api.DELETE("/api/favorites/{id}", {
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
