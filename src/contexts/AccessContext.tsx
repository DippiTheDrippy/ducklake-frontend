import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Pagination } from "../types/pagination";
import type { Group } from "../types/groups";
import type { User } from "../types/user";
import type {
  AccessLevel,
  GroupWithAccess,
  UserWithAccess,
} from "../types/access";

import { useNotification } from "./NotificationContext";

import {
  deleteGroupPermissions,
  deleteUserPermissions,
  getGroupsWithAccess as apiGetGroupsWithAccess,
  getUsersWithAccess as apiGetUsersWithAccess,
  searchGroups as apiSearchGroups,
  searchUsers as apiSearchUsers,
  updateGroupPermissions,
  updatePermissions,
} from "../api/security";

interface AccessContextType {
  usersWithAccess: UserWithAccess[];
  groupsWithAccess: GroupWithAccess[];

  loading: boolean;

  existingUserIds: Set<string>;
  existingGroupIds: Set<string>;

  getDatasetAccess: (datasetId: string) => Promise<void>;

  getUsersAccess: (datasetId: string) => Promise<void>;
  getGroupsAccess: (datasetId: string) => Promise<void>;

  searchUsers: (query: string) => Promise<User[]>;
  searchGroups: (query: string) => Promise<Group[]>;

  addUserAccess: (
    datasetId: string,
    user: User,
    accessLevel?: AccessLevel,
  ) => Promise<void>;

  addGroupAccess: (
    datasetId: string,
    group: Group,
    accessLevel?: AccessLevel,
  ) => Promise<void>;

  updateUserAccess: (
    datasetId: string,
    user: UserWithAccess,
    accessLevel: AccessLevel,
  ) => Promise<void>;

  updateGroupAccess: (
    datasetId: string,
    group: GroupWithAccess,
    accessLevel: AccessLevel,
  ) => Promise<void>;

  removeUserAccess: (datasetId: string, user: UserWithAccess) => Promise<void>;

  removeGroupAccess: (
    datasetId: string,
    group: GroupWithAccess,
  ) => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

const PAGE_SIZE = 20;
const DEFAULT_ACCESS_LEVEL: AccessLevel = "READ";

export const useAccess = (): AccessContextType => {
  const context = useContext(AccessContext);

  if (!context) {
    throw new Error("useAccess must be used within an AccessProvider");
  }

  return context;
};

export const AccessProvider = ({ children }: { children: ReactNode }) => {
  const notification = useNotification();

  const [usersWithAccess, setUsersWithAccess] = useState<UserWithAccess[]>([]);
  const [groupsWithAccess, setGroupsWithAccess] = useState<GroupWithAccess[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const pendingLoadingRequests = useRef(0);

  const existingUserIds = useMemo(
    () => new Set(usersWithAccess.map((user) => user.id)),
    [usersWithAccess],
  );

  const existingGroupIds = useMemo(
    () => new Set(groupsWithAccess.map((group) => group.id)),
    [groupsWithAccess],
  );

  const startLoading = useCallback(() => {
    pendingLoadingRequests.current += 1;
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    pendingLoadingRequests.current = Math.max(
      0,
      pendingLoadingRequests.current - 1,
    );
    setLoading(pendingLoadingRequests.current > 0);
  }, []);

  const runRequest = useCallback(
    async <T,>(
      label: string,
      failureMessage: string,
      request: () => Promise<T>,
      options: { trackLoading?: boolean } = {},
    ): Promise<T> => {
      const trackLoading = options.trackLoading ?? true;

      if (trackLoading) {
        startLoading();
      }

      try {
        return await request();
      } catch (err) {
        console.error(`${label}:`, err);
        notification.error(failureMessage);
        throw err;
      } finally {
        if (trackLoading) {
          stopLoading();
        }
      }
    },
    [notification, startLoading, stopLoading],
  );

  const getUsersAccess = useCallback(
    async (datasetId: string) => {
      const users = await runRequest(
        "getUsersAccess",
        "Failed to fetch users with access.",
        () => apiGetUsersWithAccess(datasetId),
      );

      setUsersWithAccess(users);
    },
    [runRequest],
  );

  const getGroupsAccess = useCallback(
    async (datasetId: string) => {
      const groups = await runRequest(
        "getGroupsAccess",
        "Failed to fetch groups with access.",
        () => apiGetGroupsWithAccess(datasetId),
      );

      setGroupsWithAccess(groups);
    },
    [runRequest],
  );

  const getDatasetAccess = useCallback(
    async (datasetId: string) => {
      const [users, groups] = await runRequest(
        "getDatasetAccess",
        "Failed to fetch dataset access.",
        () =>
          Promise.all([
            apiGetUsersWithAccess(datasetId),
            apiGetGroupsWithAccess(datasetId),
          ]),
      );

      setUsersWithAccess(users);
      setGroupsWithAccess(groups);
    },
    [runRequest],
  );

  const searchUsers = useCallback(
    async (query: string): Promise<User[]> => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) return [];

      const result = await runRequest(
        "searchUsers",
        "Failed to search users.",
        () => apiSearchUsers(normalizedQuery, 0, PAGE_SIZE),
        { trackLoading: false },
      );

      return getItems(result as Pagination<User> | User[]);
    },
    [runRequest],
  );

  const searchGroups = useCallback(
    async (query: string): Promise<Group[]> => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) return [];

      const result = await runRequest(
        "searchGroups",
        "Failed to search groups.",
        () => apiSearchGroups(normalizedQuery, 0, PAGE_SIZE),
        { trackLoading: false },
      );

      return getItems(result as Pagination<Group> | Group[]);
    },
    [runRequest],
  );

  const addUserAccess = useCallback(
    async (
      datasetId: string,
      user: User,
      accessLevel: AccessLevel = DEFAULT_ACCESS_LEVEL,
    ) => {
      await runRequest("addUserAccess", "Failed to add user access.", () =>
        updatePermissions(user.id, datasetId, accessLevel),
      );

      setUsersWithAccess((prev) => {
        if (prev.some((item) => item.id === user.id)) return prev;

        return [{ ...user, accessLevel }, ...prev];
      });
    },
    [runRequest],
  );

  const addGroupAccess = useCallback(
    async (
      datasetId: string,
      group: Group,
      accessLevel: AccessLevel = DEFAULT_ACCESS_LEVEL,
    ) => {
      await runRequest("addGroupAccess", "Failed to add group access.", () =>
        updateGroupPermissions(group.id, datasetId, accessLevel),
      );

      setGroupsWithAccess((prev) => {
        if (prev.some((item) => item.id === group.id)) return prev;

        return [{ ...group, accessLevel }, ...prev];
      });
    },
    [runRequest],
  );

  const updateUserAccess = useCallback(
    async (
      datasetId: string,
      user: UserWithAccess,
      accessLevel: AccessLevel,
    ) => {
      if (user.accessLevel === accessLevel) return;

      await runRequest(
        "updateUserAccess",
        "Failed to update user access.",
        () => updatePermissions(user.id, datasetId, accessLevel),
      );

      setUsersWithAccess((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, accessLevel } : item,
        ),
      );
    },
    [runRequest],
  );

  const updateGroupAccess = useCallback(
    async (
      datasetId: string,
      group: GroupWithAccess,
      accessLevel: AccessLevel,
    ) => {
      if (group.accessLevel === accessLevel) return;

      await runRequest(
        "updateGroupAccess",
        "Failed to update group access.",
        () => updateGroupPermissions(group.id, datasetId, accessLevel),
      );

      setGroupsWithAccess((prev) =>
        prev.map((item) =>
          item.id === group.id ? { ...item, accessLevel } : item,
        ),
      );
    },
    [runRequest],
  );

  const removeUserAccess = useCallback(
    async (datasetId: string, user: UserWithAccess) => {
      await runRequest(
        "removeUserAccess",
        "Failed to remove user access.",
        () => deleteUserPermissions(user.id, datasetId),
      );

      setUsersWithAccess((prev) => prev.filter((item) => item.id !== user.id));
    },
    [runRequest],
  );

  const removeGroupAccess = useCallback(
    async (datasetId: string, group: GroupWithAccess) => {
      await runRequest(
        "removeGroupAccess",
        "Failed to remove group access.",
        () => deleteGroupPermissions(group.id, datasetId),
      );

      setGroupsWithAccess((prev) =>
        prev.filter((item) => item.id !== group.id),
      );
    },
    [runRequest],
  );

  const value = useMemo<AccessContextType>(
    () => ({
      usersWithAccess,
      groupsWithAccess,

      loading,

      existingUserIds,
      existingGroupIds,

      getDatasetAccess,

      getUsersAccess,
      getGroupsAccess,

      searchUsers,
      searchGroups,

      addUserAccess,
      addGroupAccess,

      updateUserAccess,
      updateGroupAccess,

      removeUserAccess,
      removeGroupAccess,
    }),
    [
      usersWithAccess,
      groupsWithAccess,
      loading,
      existingUserIds,
      existingGroupIds,
      getDatasetAccess,
      getUsersAccess,
      getGroupsAccess,
      searchUsers,
      searchGroups,
      addUserAccess,
      addGroupAccess,
      updateUserAccess,
      updateGroupAccess,
      removeUserAccess,
      removeGroupAccess,
    ],
  );

  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
};

function getItems<T>(result: Pagination<T> | T[]): T[] {
  if (Array.isArray(result)) return result;

  return result.items ?? [];
}
