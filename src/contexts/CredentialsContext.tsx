import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createDatasetCredential,
  deleteCredential,
  getDatasetCredential,
  listCredentials,
  rotateDatasetCredential,
} from "../api/dataset";
import type { Pagination } from "../types/pagination";
import type { Dayjs } from "dayjs";
import type { Credential } from "../types/credentials";
import { useNotification } from "./NotificationContext";

interface CredentialsContextType {
  credentials: Credential[];
  totalItems: number;
  loading: boolean;
  isFetchingMore: boolean;
  credential: Credential | null;
  getCredential: (id: string) => Promise<void>;
  resetCredential: () => void;
  fetchCredentials: () => Promise<void>;
  fetchMore: () => Promise<void>;
  createCredentials: (
    datasetId: string,
    name: string,
    accessLevel: "READ" | "WRITE",
    expiresAt: Dayjs | null,
    neverExpires: boolean,
  ) => Promise<void>;
  rotateCredentials: (id: string) => Promise<void>;
  delCredentials: (id: string) => Promise<boolean>;
}

const CredentialsContext = createContext<CredentialsContextType | undefined>(
  undefined,
);

export const useCredentials = (): CredentialsContextType => {
  const context = useContext(CredentialsContext);
  if (!context) {
    throw new Error("useCredentials must be used within a CredentialsProvider");
  }

  return context;
};

export const CredentialsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const notification = useNotification();

  const [pageSize] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);

  const hasMore = totalItems === null || credentials.length < totalItems;
  const loadingRef = useRef(false);

  function appendUniqueCredentials(
    current: Credential[],
    incoming: Credential[],
  ) {
    const existingIds = new Set(current.map((credential) => credential.id));

    return [
      ...current,
      ...incoming.filter((credential) => !existingIds.has(credential.id)),
    ];
  }

  const resetCredential = useCallback(() => {
    setCredential((prev) => {
      if (prev === null) return prev;
      const { bucket, database, ...credentialWithoutBucketAndDataset } = prev;

      return credentialWithoutBucketAndDataset;
    });
  }, []);

  const fetchCredential = useCallback(
    async (datasetId: string) => {
      if (loadingRef.current) return;
      setCredential(null);

      try {
        loadingRef.current = true;
        setLoading(true);

        const resp: Credential = await getDatasetCredential(datasetId);

        setCredential(resp);
      } catch (err) {
        console.error("fetchCredential:", err);
        notification.error(
          "Failed to fetch credentials. Please try again later.",
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [pageSize, notification],
  );

  const fetchCredentials = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const page = 0;

      const resp: Pagination<Credential> = await listCredentials(
        page,
        pageSize,
      );

      setCredentials(resp.items);
      setTotalItems(resp.totalItems);
    } catch (err) {
      console.error("listCredentials:", err);
      notification.error(
        "Failed to fetch credentials. Please try again later.",
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [pageSize, notification]);

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;

    if (totalItems !== null && credentials.length >= totalItems) {
      return;
    }

    const page = Math.floor((credentials.length + pageSize - 1) / pageSize);

    try {
      loadingRef.current = true;
      setIsFetchingMore(true);

      const resp: Pagination<Credential> = await listCredentials(
        page,
        pageSize,
      );

      setCredentials((prev) => appendUniqueCredentials(prev, resp.items));
      setTotalItems(resp.totalItems);
    } catch (err) {
      console.error("fetchMoreCredentials:", err);
      notification.error(
        "Failed to fetch more credentials. Please try again later.",
      );
    } finally {
      loadingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [credentials.length, pageSize, totalItems, notification]);

  const createCredentials = useCallback(
    async (
      datasetId: string,
      name: string,
      accessLevel: "READ" | "WRITE",
      expiresAt: Dayjs | null,
      neverExpires: boolean,
    ) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        const credential = await createDatasetCredential(
          datasetId,
          name,
          accessLevel,
          expiresAt,
          neverExpires,
        );
        setCredential(credential);
        setCredentials((prev) => {
          const { bucket, database, ...credentialWithoutBucketAndDataset } =
            credential;

          return [...prev, credentialWithoutBucketAndDataset];
        });
      } catch (err) {
        setCredential(null);
        console.error("createCredentials: " + err);
        notification.error(
          "Failed to create credentials: " +
            (err instanceof Error ? err.message : String(err)),
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const rotateCredentials = useCallback(
    async (id: string) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        const credential: Credential = await rotateDatasetCredential(id);
        setCredential(credential);
        setCredentials((prev) =>
          prev.map((cred) =>
            cred.id === id
              ? { ...cred, garageAccessKeyId: credential.garageAccessKeyId }
              : cred,
          ),
        );
      } catch (err) {
        setCredential(null);
        console.error("rotateCredentials: " + err);
        notification.error(
          "Failed to rotate credentials: " +
            (err instanceof Error ? err.message : String(err)),
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const delCredentials = useCallback(
    async (id: string): Promise<boolean> => {
      if (loadingRef.current) return false;

      try {
        loadingRef.current = true;
        setLoading(true);
        await deleteCredential(id);
        setCredentials((prev) =>
          prev.filter((credential) => credential.id !== id),
        );
        setTotalItems((prev) => Math.max(0, prev - 1));
        return true;
      } catch (err) {
        console.error("deleteCredential: " + err);
        notification.error(
          "Failed to delete credential: " +
            (err instanceof Error ? err.message : String(err)),
        );
        return false;
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [notification],
  );

  const value = useMemo<CredentialsContextType>(
    () => ({
      credentials,
      totalItems,
      loading,
      isFetchingMore,
      credential,
      getCredential: fetchCredential,
      resetCredential,
      fetchCredentials,
      fetchMore,
      createCredentials,
      rotateCredentials,
      delCredentials,
    }),
    [
      credentials,
      totalItems,
      loading,
      isFetchingMore,
      credential,
      fetchCredential,
      resetCredential,
      fetchCredentials,
      fetchMore,
      createCredentials,
      rotateCredentials,
      delCredentials,
    ],
  );

  return (
    <CredentialsContext.Provider value={value}>
      {children}
    </CredentialsContext.Provider>
  );
};
