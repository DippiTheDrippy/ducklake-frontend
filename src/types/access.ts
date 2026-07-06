import type { Group } from "./groups";
import type { User } from "./user";

export type AccessLevel = "READ" | "WRITE";

export type UserWithAccess = User & {
  accessLevel: AccessLevel;
};

export type GroupWithAccess = Group & {
  accessLevel: AccessLevel;
};
