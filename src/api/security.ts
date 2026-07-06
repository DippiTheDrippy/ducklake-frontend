import type { GroupWithAccess, UserWithAccess } from "../types/access";
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

export async function deleteUserPermissions(id: string, datasetId: string) {
  const { data, error } = await api.DELETE(
    "/api/security/{id}/dataset/{dataset_id}",
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
  const { data, error } = await api.GET("/api/security/users/dataset/{id}", {
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

export async function deleteGroupPermissions(id: string, datasetId: string) {
  const { data, error } = await api.DELETE(
    "/api/security/groups/{id}/dataset/{dataset_id}",
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
  const { data, error } = await api.GET("/api/security/groups/dataset/{id}", {
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
