import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dataset } from "../types/dataset";
import { listDatasets, searchDatasets } from "../api/dataset";
import type { Pagination } from "../types/pagination";
import { deleteDataset, updateDataset } from "../api/admin";

interface DatasetsContextType {
  datasets: Dataset[];
  //   getDataset: () => Promise<void>;
  searchDatasets: (search: string) => Promise<void>;
  updateDataset: (
    id: string,
    displayName: string,
    description: string,
    isPublic: boolean,
  ) => Promise<void>;
  deleteDataset: (id: string) => Promise<void>;
  isLoading: boolean;
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
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(30);
  const loadingRef = useRef(false);

  const fetchDatasets = useCallback(
    async (search: string) => {
      if (loadingRef.current) return;
      const trimmed = search.trim();

      try {
        loadingRef.current = true;
        setLoading(true);

        const page = Math.floor(datasets.length / pageSize);

        const resp: Pagination<Dataset> =
          trimmed.length > 0
            ? await searchDatasets(trimmed, page, pageSize)
            : await listDatasets(page, pageSize);

        setDatasets(resp.items);
      } catch (err) {
        console.error("searchDatasets: " + err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [datasets.length, pageSize],
  );

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

  const delDataset = useCallback(
    async (id: string) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        await deleteDataset(id);
        setDatasets((prev) => prev.filter((group) => group.id !== id));
      } catch (err) {
        console.error("deleteDataset: " + err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
  );

  const value = useMemo<DatasetsContextType>(
    () => ({
      datasets: datasets,
      searchDatasets: fetchDatasets,
      updateDataset: putDataset,
      deleteDataset: delDataset,
      isLoading: loading,
    }),
    [datasets, putDataset, fetchDatasets, delDataset, loading],
  );

  return (
    <DatasetsContext.Provider value={value}>
      {children}
    </DatasetsContext.Provider>
  );
};
