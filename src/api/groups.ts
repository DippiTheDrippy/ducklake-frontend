// GROUPS

import type { GroupWithAccess } from "../types/access";
import type { Group } from "../types/groups";
import type { Pagination } from "../types/pagination";
import { api } from "./client";
import type { User } from "../types/user";

export async function listGroups(pageIndex: number, pageSize: number) {
  const { data, error } = await api.GET("/api/groups", {
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

export async function listMyGroups(
  pageIndex: number,
  pageSize: number,
): Promise<Pagination<Group>> {
  const { data, error } = await api.GET("/api/groups/me", {
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

  return data as Pagination<Group>;
}

export async function searchGroups(
  search: string,
  pageIndex: number,
  pageSize: number,
) {
  const { data, error } = await api.GET("/api/groups/search", {
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

export async function getGroup(id: string) {
  const { data, error } = await api.GET("/api/groups/{id}", {
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

export async function getGroupMembers(id: string): Promise<User[]> {
  const { data, error } = await api.GET("/api/groups/{id}/members", {
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

  return data as User[];
}

export async function updateGroupPermissions(
  id: string,
  datasetId: string,
  accessLevel: "READ" | "WRITE",
) {
  const { data, error } = await api.PUT(
    "/api/groups/{id}/dataset/{dataset_id}",
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

export async function deleteGroupPermissions(id: string, datasetId: string) {
  const { data, error } = await api.DELETE(
    "/api/groups/{id}/dataset/{dataset_id}",
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

export async function getGroupsWithAccess(
  datasetId: string,
): Promise<GroupWithAccess[]> {
  const { data, error } = await api.GET("/api/groups/dataset/{id}", {
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

  return data as GroupWithAccess[];
}
