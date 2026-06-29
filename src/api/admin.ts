import { api } from "./client";

// DATASETS

export async function createEmptyDataset(body: {
  name: string;
  displayName: string;
  description: string;
  isPublic: boolean;
}) {
  const { data, error } = await api.POST("/api/admin/datasets", {
    body,
  });

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function createEmptyDatasetFromFile(
  metadata: {
    name: string;
    displayName: string;
    description: string;
    isPublic: boolean;
  },
  file: File,
) {
  const { data, error } = await api.POST("/api/admin/datasets/file", {
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

  if (error) {
    console.error("API error:", error);
    throw error;
  }

  return data;
}

export async function appendDataFromFile(id: string, file: File) {
  const { data, error } = await api.POST("/api/admin/datasets/append/{id}", {
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
  const { data, error } = await api.PUT("/api/admin/datasets/{id}", {
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
  const { data, error } = await api.DELETE("/api/admin/datasets/{id}", {
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
