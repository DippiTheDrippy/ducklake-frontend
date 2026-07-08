import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dataset } from "../types/dataset";
import {
  favoriteDataset,
  listFavorites,
  unfavoriteDataset,
} from "../api/dataset";
import type { Pagination } from "../types/pagination";
import { useNotification } from "./NotificationContext";
import type { Err } from "../types/error";

interface FavoritesContextType {
  favorites: Dataset[];
  listFavorites: () => Promise<void>;
  fetchMore: () => Promise<void>;
  favoriteDataset: (dataset: Dataset) => Promise<void>;
  unfavoriteDataset: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
};

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [pageSize] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const hasMore = totalItems === null || favorites.length < totalItems;
  const loadingRef = useRef(false);

  const notification = useNotification();

  function appendUniqueDatasets(current: Dataset[], incoming: Dataset[]) {
    const existingIds = new Set(current.map((dataset) => dataset.id));

    return [
      ...current,
      ...incoming.filter((dataset) => !existingIds.has(dataset.id)),
    ];
  }

  const favoriteIds = useMemo(
    () => new Set(favorites.map((dataset) => dataset.id)),
    [favorites],
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  const fetchDatasets = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const page = 0;

      const resp: Pagination<Dataset> = await listFavorites(page, pageSize);

      setFavorites(resp.items);
      setTotalItems(resp.totalItems);
    } catch (err) {
      console.error("listFavorites:", err);
      notification.error(
        "Failed to fetch favorite datasets. Please try again later.",
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [pageSize, notification]);

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;

    if (totalItems !== null && favorites.length >= totalItems) {
      return;
    }

    const page = Math.floor((favorites.length + pageSize - 1) / pageSize);

    try {
      loadingRef.current = true;
      setIsFetchingMore(true);

      const resp: Pagination<Dataset> = await listFavorites(page, pageSize);

      setFavorites((prev) => appendUniqueDatasets(prev, resp.items));
      setTotalItems(resp.totalItems);
    } catch (err) {
      console.error("fetchMoreDatasets:", err);
      notification.error(
        "Failed to fetch more favorite datasets. Please try again later.",
      );
    } finally {
      loadingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [favorites.length, pageSize, totalItems, notification]);

  const postFavoriteDataset = useCallback(
    async (dataset: Dataset) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        await favoriteDataset(dataset.id);
        setFavorites((prev) => [...prev, dataset]);
        setTotalItems((prev) => (prev === null ? 1 : prev + 1));
      } catch (err) {
        console.error("createDataset: " + err);
        notification.error(
          "Failed to favorite dataset: " + (err as Err).message,
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const deleteUnfavoriteDataset = useCallback(
    async (id: string) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        await unfavoriteDataset(id);
        setFavorites((prev) => prev.filter((dataset) => dataset.id !== id));
        setTotalItems((prev) => Math.max(0, prev === null ? 0 : prev - 1));
      } catch (err) {
        console.error("deleteDataset: " + err);
        notification.error(
          "Failed to unfavorite dataset: " + (err as Err).message,
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const value = useMemo<FavoritesContextType>(
    () => ({
      favorites: favorites,
      listFavorites: fetchDatasets,
      fetchMore: fetchMore,
      favoriteDataset: postFavoriteDataset,
      unfavoriteDataset: deleteUnfavoriteDataset,
      isFavorite,
      isLoading: loading,
      isFetchingMore,
      hasMore,
    }),
    [
      favorites,
      fetchDatasets,
      fetchMore,
      postFavoriteDataset,
      deleteUnfavoriteDataset,
      isFavorite,
      loading,
      isFetchingMore,
      hasMore,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
