const allRoles = {
  user: [],
  admin: ["getUsers", "manageUsers"],
};

const adminUserRoles = new Set(["Superadmin", "Admin", "Data Entry"]);

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  adminUserRoles,
};
