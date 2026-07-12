////////////////////////////////////
// All available modules permissions
////////////////////////////////////
export const PERMISSIONS = {
  SUBSCRIPTION: {
    VIEW: 'subscription.readPermission',
    EDIT: 'subscription.updatePermission',
    DELETE: 'subscription.deletePermission',
  },
  ROLE_AND_ACCESS: {
    VIEW: 'role.readPermission',
    EDIT: 'role.updatePermission',
    DELETE: 'role.deletePermission',
  },
 
  
  DASHBOARD: {
    VIEW: 'dashboard.readPermission',
    EDIT: 'dashboard.updatePermission',
  },
 
 
  NOTIFICATION: {
    VIEW: 'notification.readPermission',
    EDIT: 'notification.updatePermission',
    DELETE: 'notification.deletePermission',
  },

};
//_______________________________

/////////////////////////////////////////////////////////
// Store permissions can be extended to show more modules
/////////////////////////////////////////////////////////
export const STORE_PERMISSIONS = [
  PERMISSIONS.DASHBOARD.VIEW,
  PERMISSIONS.NOTIFICATION.VIEW,
];

export const currency = 'AED';
