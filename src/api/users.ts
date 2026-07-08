import type { UserWithAccess } from "../types/access";
import { api } from "./client";

// USERS

export async function listUsers(pageIndex: number, pageSize: number) {
  const { data, error } = await api.GET("/api/users", {
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

  return data;
}

export async function searchUsers(
  search: string,
  pageIndex: number,
  pageSize: number,
) {
  const { data, error } = await api.GET("/api/users/search", {
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

  return data;
}

export async function getUser(id: string) {
  const { data, error } = await api.GET("/api/users/{id}", {
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

  return data;
}

export async function updatePermissions(
  id: string,
  datasetId: string,
  accessLevel: "READ" | "WRITE",
) {
  const { data, error } = await api.PUT(
    "/api/users/{id}/dataset/{dataset_id}",
    {
      params: {
        path: {
          id: id,
          dataset_id: datasetId,
        },
      },
      body: {
        accessLevel: accessLevel,
      },
    },
  );

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function deleteUserPermissions(id: string, datasetId: string) {
  const { data, error } = await api.DELETE(
    "/api/users/{id}/dataset/{dataset_id}",
    {
      params: {
        path: {
          id: id,
          dataset_id: datasetId,
        },
      },
    },
  );

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function getUsersWithAccess(
  datasetId: string,
): Promise<UserWithAccess[]> {
  const { data, error } = await api.GET("/api/users/dataset/{id}", {
    params: {
      path: {
        id: datasetId,
      },
    },
  });

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data as UserWithAccess[];
}
