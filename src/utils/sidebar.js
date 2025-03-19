const sidebarItems = require("../config/sidebar");

/**
 * Get sidebar items based on user permissions
 * @param {Set<string>} permissions
 * @returns {Array}
 */
const getSidebarItems = (permissions) => {
  return sidebarItems.filter((item) => {
    if (item.children) {
      return item.children.filter((child) =>
        permissions.has(child.requiredRights)
      );
    }
    return permissions.has(item.requiredRights);
  });
};

module.exports = {
  getSidebarItems,
};
