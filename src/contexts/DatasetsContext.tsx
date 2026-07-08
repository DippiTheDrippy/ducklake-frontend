import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dataset, DatasetWithSummary } from "../types/dataset";
import type { Pagination } from "../types/pagination";
import {
  appendDataFromFile,
  createDatasetFromFile,
  deleteDataset,
  updateDataset,
  getDataset,
  listDatasets,
  searchDatasets,
} from "../api/dataset";
import { useNotification } from "./NotificationContext";
import type { Err } from "../types/error";

interface DatasetsContextType {
  dataset: DatasetWithSummary | null;
  datasets: Dataset[];
  getDataset: (id: string) => Promise<void>;
  searchDatasets: (search: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  updateDataset: (
    id: string,
    displayName: string,
    description: string,
    isPublic: boolean,
  ) => Promise<void>;
  createDataset: (
    metadata: {
      name: string;
      displayName: string;
      description: string;
      isPublic: boolean;
    },
    file: File,
  ) => Promise<void>;
  uploadDatasetFile: (id: string, file: File) => Promise<void>;
  deleteDataset: (id: string) => Promise<boolean>;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  lastSearch: string | null;
}

const DatasetsContext = createContext<DatasetsContextType | undefined>(
  undefined,
);

export const useDatasets = (): DatasetsContextType => {
  const context = useContext(DatasetsContext);
  if (!context) {
    throw new Error("useDatasets must be used within a DatasetsProvider");
  }

  return context;
};

export const DatasetsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dataset, setDataset] = useState<DatasetWithSummary | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [pageSize] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const hasMore = totalItems === null || datasets.length < totalItems;
  const loadingRef = useRef(false);

  const notification = useNotification();

  function appendUniqueDatasets(current: Dataset[], incoming: Dataset[]) {
    const existingIds = new Set(current.map((dataset) => dataset.id));

    return [
      ...current,
      ...incoming.filter((dataset) => !existingIds.has(dataset.id)),
    ];
  }

  const fetchDataset = useCallback(
    async (id: string) => {
      if (loadingRef.current) return;
      setDataset(null);

      try {
        loadingRef.current = true;
        setLoading(true);

        const resp: DatasetWithSummary = await getDataset(id);

        setDataset(resp);
      } catch (err) {
        console.error("getDataset: " + err);
        notification.error("Failed to fetch dataset.");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [datasets.length, pageSize, notification],
  );

  const fetchDatasets = useCallback(
    async (search: string) => {
      const trimmed = search.trim();

      if (loadingRef.current || lastSearch === trimmed) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        const page = 0;

        const resp: Pagination<Dataset> =
          trimmed.length > 0
            ? await searchDatasets(trimmed, page, pageSize)
            : await listDatasets(page, pageSize);

        setDatasets(resp.items);
        setTotalItems(resp.totalItems);
        setLastSearch(trimmed);
      } catch (err) {
        console.error("searchDatasets:", err);
        notification.error("Failed to fetch datasets. Please try again later.");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [lastSearch, pageSize, notification],
  );

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (lastSearch === null) return;

    if (totalItems !== null && datasets.length >= totalItems) {
      return;
    }

    const trimmed = lastSearch.trim();
    const page = Math.floor((datasets.length + pageSize - 1) / pageSize);

    try {
      loadingRef.current = true;
      setIsFetchingMore(true);

      const resp: Pagination<Dataset> =
        trimmed.length > 0
          ? await searchDatasets(trimmed, page, pageSize)
          : await listDatasets(page, pageSize);

      setDatasets((prev) => appendUniqueDatasets(prev, resp.items));
      setTotalItems(resp.totalItems);
    } catch (err) {
      console.error("fetchMoreDatasets:", err);
      notification.error(
        "Failed to fetch more datasets. Please try again later.",
      );
    } finally {
      loadingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [datasets.length, pageSize, lastSearch, totalItems, notification]);

  const putDataset = useCallback(
    async (
      id: string,
      displayName: string,
      description: string,
      isPublic: boolean,
    ) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        await updateDataset(id, {
          displayName,
          description,
          isPublic,
        });
        setDatasets((prev) =>
          prev.map((dataset) =>
            dataset.id === id
              ? {
                  id: id,
                  name: dataset.name,
                  displayName: displayName,
                  description: description,
                  bucketName: dataset.bucketName,
                }
              : dataset,
          ),
        );
      } catch (err) {
        console.error("updateDataset: " + err);
        notification.error("Failed to update dataset: " + (err as Err).message);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const createDataset = useCallback(
    async (
      metadata: {
        name: string;
        displayName: string;
        description: string;
        isPublic: boolean;
      },
      file: File,
    ) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        const dataset = await createDatasetFromFile(metadata, file);
        setDatasets((prev) => [...prev, dataset]);
        setTotalItems((prev) => prev + 1);
      } catch (err) {
        console.error("createDataset: " + err);
        notification.error("Failed to create dataset: " + (err as Err).message);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const uploadDatasetFile = useCallback(
    async (id: string, file: File) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        await appendDataFromFile(id, file);
      } catch (err) {
        console.error("uploadDatasetFile: " + err);
        notification.error(
          "Failed to upload file to dataset: " + (err as Err).message,
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const delDataset = useCallback(
    async (id: string): Promise<boolean> => {
      if (loadingRef.current) return false;

      try {
        loadingRef.current = true;
        setLoading(true);
        await deleteDataset(id);
        setDatasets((prev) => prev.filter((dataset) => dataset.id !== id));
        setTotalItems((prev) => Math.max(0, prev - 1));
        return true;
      } catch (err) {
        console.error("deleteDataset: " + err);
        notification.error("Failed to delete dataset: " + (err as Err).message);
        return false;
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const value = useMemo<DatasetsContextType>(
    () => ({
      dataset,
      datasets,
      getDataset: fetchDataset,
      searchDatasets: fetchDatasets,
      fetchMore,
      updateDataset: putDataset,
      createDataset: createDataset,
      uploadDatasetFile: uploadDatasetFile,
      deleteDataset: delDataset,
      isLoading: loading,
      isFetchingMore,
      hasMore,
      lastSearch,
    }),
    [
      dataset,
      datasets,
      fetchDataset,
      fetchDatasets,
      fetchMore,
      putDataset,
      createDataset,
      uploadDatasetFile,
      delDataset,
      loading,
      isFetchingMore,
      hasMore,
      lastSearch,
    ],
  );

  return (
    <DatasetsContext.Provider value={value}>
      {children}
    </DatasetsContext.Provider>
  );
};
