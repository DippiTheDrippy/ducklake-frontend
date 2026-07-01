import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dataset, DatasetWithSummary } from "../types/dataset";
import { getDataset, listDatasets, searchDatasets } from "../api/dataset";
import type { Pagination } from "../types/pagination";
import { appendDataFromFile, deleteDataset, updateDataset } from "../api/admin";

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
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [datasets.length, pageSize],
  );

  const MIN_LOADING_MS = 300;
  const sleep = (ms: number) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const fetchDatasets = useCallback(
    async (search: string) => {
      const trimmed = search.trim();

      if (loadingRef.current || lastSearch === trimmed) return;

      const startedAt = performance.now();

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
      } finally {
        const elapsed = performance.now() - startedAt;
        const remaining = MIN_LOADING_MS - elapsed;

        if (remaining > 0) {
          await sleep(remaining);
        }

        loadingRef.current = false;
        setLoading(false);
      }
    },
    [lastSearch, pageSize],
  );

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (lastSearch === null) return;

    if (totalItems !== null && datasets.length >= totalItems) {
      return;
    }

    const trimmed = lastSearch.trim();
    const page = Math.floor(datasets.length / pageSize);

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
      console.error("fetchMore:", err);
    } finally {
      loadingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [datasets.length, pageSize, lastSearch, totalItems]);

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
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
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
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
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
        return false;
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
  );

  const value = useMemo<DatasetsContextType>(
    () => ({
      dataset,
      datasets,
      getDataset: fetchDataset,
      searchDatasets: fetchDatasets,
      fetchMore,
      updateDataset: putDataset,
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
