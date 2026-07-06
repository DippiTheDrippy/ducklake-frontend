import type { Group } from "../types/groups";
import type { User } from "../types/user";

export type AccessTab = "users" | "groups";
export type AccessEntity = "user" | "group";
export type AccessAction = "access" | "remove" | "add";

export const PAGE_SIZE = 10;

export function getActionKey(
  entity: AccessEntity,
  id: string,
  action: AccessAction,
) {
  return `${entity}:${id}:${action}`;
}

export function getUserDisplayName(user: User) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return fullName || user.username || user.email || user.id;
}

export function getGroupSubtitle(group: Pick<Group, "id"> & { path?: string }) {
  return group.path || group.id;
}
