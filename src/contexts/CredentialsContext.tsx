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
  listCredentials,
  rotateDatasetCredential,
} from "../api/dataset";
import type { Pagination } from "../types/pagination";
import type { Dayjs } from "dayjs";
import type { Credential } from "../types/credentials";

interface CredentialsContextType {
  credentials: Credential[];
  totalItems: number;
  loading: boolean;
  isFetchingMore: boolean;
  credential: Credential | null;
  fetchCredentials: () => Promise<void>;
  fetchMore: () => Promise<void>;
  createCredentials: (
    datasetId: string,
    accessLevel: "READ" | "WRITE",
    expiresAt: Dayjs,
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

  const MIN_LOADING_MS = 300;
  const sleep = (ms: number) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const fetchCredentials = useCallback(async () => {
    if (loadingRef.current) return;

    const startedAt = performance.now();

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
    } finally {
      const elapsed = performance.now() - startedAt;
      const remaining = MIN_LOADING_MS - elapsed;

      if (remaining > 0) {
        await sleep(remaining);
      }

      loadingRef.current = false;
      setLoading(false);
    }
  }, [pageSize]);

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;

    if (totalItems !== null && credentials.length >= totalItems) {
      return;
    }

    const page = Math.floor(credentials.length / pageSize);

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
    } finally {
      loadingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [credentials.length, pageSize, totalItems]);

  const createCredentials = useCallback(
    async (
      datasetId: string,
      accessLevel: "READ" | "WRITE",
      expiresAt: Dayjs,
      neverExpires: boolean,
    ) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        const credential = await createDatasetCredential(
          datasetId,
          accessLevel,
          expiresAt,
          neverExpires,
        );
        setCredential(credential);
        setCredentials((prev) => {
          const { bucket, dataset, ...credentialWithoutBucketAndDataset } =
            credential;

          return [...prev, credentialWithoutBucketAndDataset];
        });
      } catch (err) {
        console.error("createCredentials: " + err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
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
        console.error("rotateCredentials: " + err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
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
        return false;
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [loading],
  );

  const value = useMemo<CredentialsContextType>(
    () => ({
      credentials,
      totalItems,
      loading,
      isFetchingMore,
      credential,
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
