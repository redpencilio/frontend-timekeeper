import constants from './constants';

const { ADMIN, EMPLOYEE } = constants.USER_GROUPS;

const permissionsForGroup = [
  {
    uri: EMPLOYEE,
    permissions: [],
  },
  {
    uri: ADMIN,
    permissions: ['manage-users'],
  },
];

export default permissionsForGroup;

export function getPermissionsForGroups(userGroups) {
  return userGroups
    .map((group) => {
      const groupPermissions = permissionsForGroup.find(
        (g) => g.uri == group.uri,
      );
      return groupPermissions?.permissions || [];
    })
    .flat();
}
