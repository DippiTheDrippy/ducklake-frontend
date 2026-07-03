import type { Group } from "../types/groups";
import type { Pagination } from "../types/pagination";
import type { User } from "../types/user";
import { api } from "./client";

// USERS

export async function listUsers(pageIndex: number, pageSize: number) {
  const { data, error } = await api.GET("/api/security", {
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
  const { data, error } = await api.GET("/api/security/search", {
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
  const { data, error } = await api.GET("/api/security/{id}", {
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
    "/api/security/{id}/dataset/{dataset_id}",
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

// GROUPS

export async function listGroups(pageIndex: number, pageSize: number) {
  const { data, error } = await api.GET("/api/security/groups", {
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
  const { data, error } = await api.GET("/api/security/groups/me", {
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
  const { data, error } = await api.GET("/api/security/groups/search", {
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
  const { data, error } = await api.GET("/api/security/groups/{id}", {
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
  const { data, error } = await api.GET("/api/security/groups/{id}/members", {
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
    "/api/security/groups/{id}/dataset/{dataset_id}",
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
