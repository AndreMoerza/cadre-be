export const FEATURES = {
  ALL: '*',
  AUTH: 'auth',
  USER: 'user',
  FILE: 'file',
  TENANT: 'tenant',
  ROLE: 'role',
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;
