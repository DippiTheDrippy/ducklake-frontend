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

export async function register() {
  const { data, error } = await api.POST("/api/security/register");

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

export async function deleteUser(id: string) {
  const { data, error } = await api.DELETE("/api/security/{id}", {
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

// GROUPS

export async function listGroup(pageIndex: number, pageSize: number) {
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

export async function createGroup(body: {
  name: string;
  displayName: string;
  description: string;
}) {
  const { data, error } = await api.POST("/api/security/groups", {
    body,
  });

  if (!data || error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
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

export async function deleteGroup(id: string) {
  const { data, error } = await api.DELETE("/api/security/groups/{id}", {
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
