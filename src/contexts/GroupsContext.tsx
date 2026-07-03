import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Pagination } from "../types/pagination";
import type { Group } from "../types/groups";
import { useNotification } from "./NotificationContext";
import type { User } from "../types/user";
import { getGroupMembers, listMyGroups } from "../api/security";

interface GroupsContextType {
  groups: Group[];
  members: Record<string, User[]>;
  loading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  getGroups: () => Promise<void>;
  getMoreGroups: () => Promise<void>;
  getGroupMembers: (groupId: string) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const useGroups = (): GroupsContextType => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }

  return context;
};

export const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Record<string, User[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const notification = useNotification();

  const [pageSize] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);

  const hasMore = totalItems === null || groups.length < totalItems;
  const loadingRef = useRef(false);

  function appendUniqueGroups(current: Group[], incoming: Group[]) {
    const existingIds = new Set(current.map((group) => group.id));

    return [
      ...current,
      ...incoming.filter((group) => !existingIds.has(group.id)),
    ];
  }

  const fetchGroups = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const page = 0;

      const resp: Pagination<Group> = await listMyGroups(page, pageSize);

      setGroups(resp.items);
      setTotalItems(resp.totalItems);
    } catch (err) {
      console.error("listMyGroups:", err);
      notification.error(
        "Failed to fetch your groups. Please try again later.",
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [pageSize, notification]);

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;

    if (totalItems !== null && groups.length >= totalItems) {
      return;
    }

    const page = Math.floor((groups.length + pageSize - 1) / pageSize);

    try {
      loadingRef.current = true;
      setIsFetchingMore(true);

      const resp: Pagination<Group> = await listMyGroups(page, pageSize);

      setGroups((prev) => appendUniqueGroups(prev, resp.items));
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
  }, [groups.length, pageSize, totalItems, notification]);

  const fetchGroupMembers = useCallback(
    async (groupId: string) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        const resp: User[] = await getGroupMembers(groupId);

        setMembers((prev) => ({
          ...prev,
          [groupId]: resp,
        }));
      } catch (err) {
        console.error("getGroupMembers:", err);
        notification.error(
          "Failed to fetch group members. Please try again later.",
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [pageSize, notification],
  );

  const value = useMemo<GroupsContextType>(
    () => ({
      groups,
      members,
      loading,
      isFetchingMore,
      hasMore,
      getGroups: fetchGroups,
      getMoreGroups: fetchMore,
      getGroupMembers: fetchGroupMembers,
    }),
    [
      groups,
      members,
      loading,
      isFetchingMore,
      hasMore,
      fetchGroups,
      fetchMore,
      fetchGroupMembers,
    ],
  );

  return (
    <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>
  );
};
