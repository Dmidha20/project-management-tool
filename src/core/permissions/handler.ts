import { lazy } from 'react';

import { IS_ADMIN } from '@app/configs';
import type { IRolePermission } from '@app/modules/role-and-access';

import { STORE_PERMISSIONS } from './constants';

// TODO: Its need to be handle in better way
let permissionFromAPI: IRolePermission[] = [];

const hasPermission = (permission: string): boolean => {
  // Admin has all permissions
  if (IS_ADMIN) {
    return true;
  }

  // Don't override available modules in store
  // even its allowed in api if not available module
  // don't give permission to view
  // if (!STORE_PERMISSIONS.includes(permission)) {
  //   return false;
  // }

  // Permission format module.permission
  const moduleName = permission.split('.')[0];
  const askedPermission = permission.split('.')[1] as keyof IRolePermission;

  return !!permissionFromAPI.find((item) => item.module === moduleName)?.[askedPermission];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithPermission(importFn: () => Promise<any>, permission: string) {
  return IS_ADMIN || STORE_PERMISSIONS.includes(permission)
    ? lazy(importFn)
    : lazy(() => import('@app/pages/forbidden/forbidden-page'));
}

function setApiPermissions(permissions: IRolePermission[]) {
  permissionFromAPI = permissions;
}

export { hasPermission, lazyWithPermission, setApiPermissions };
