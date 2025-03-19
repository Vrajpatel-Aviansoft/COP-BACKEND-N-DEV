const httpStatus = require("http-status");
const { roleService, permissionService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const roleView = (req, res, next) => {
  return res.render("pages/role/view", {
    title: "Role",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

// // Utility Function to Format Permission Names
// const formatPermissions = (permissions) => {
//   return permissions.map(permission => {
//     const formattedName = permission.name
//       .split("_") // Split by underscores
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
//       .join(" "); // Join with spaces

//     return {
//       ...permission,
//       formattedName, // Add the formatted name to the permission object
//     };
//   });
// };

// Role Create View
const roleCreateView = async (req, res, next) => {
  try {
    // Fetch all permissions from the service
    const prs = await permissionService.getAllPermissions();

    // Format the permission names
    // const formattedPermissions = formatPermissions(prs);

    // Render the role creation page, passing the formatted permissions
    return res.render("pages/role/create", {
      title: "Create Role",
      layout: "./layouts/main",
      currentRoute: req.originalUrl,
      sidebarItems: req.sidebarItems,
      // prs: formattedPermissions, // Pass the formatted permissions to the view
      prs,
    });
  } catch (error) {
    console.error("Error loading create role view:", error);
    next(error); // Forward the error to the error-handling middleware
  }
};


// Role Edit View
const editRoleView = async (req, res, next) => {
  try {
    const prs = await permissionService.getAllPermissions();
    const formattedPermissions = formatPermissions(prs);

    const role = await roleService.getRoleByUuid(req.params.uuid);

    return res.render("pages/role/edit", {
      title: "Edit Role",
      layout: "./layouts/main",
      currentRoute: req.originalUrl,
      sidebarItems: req.sidebarItems,
      role: role.dataValues,
      prs: formattedPermissions, // Pass the formatted permissions
    });
  } catch (error) {
    console.error("Error loading edit role view:", error);
    next(error); // Forward the error to the error-handling middleware
  }
};


const createRole = async (req, res, next) => {

  const role = await roleService.createRole(req.user, req.body, req.files);
  return res.status(httpStatus.CREATED).send(role);
};

const getRoles = catchAsync(async (req, res, next) => {
  try {
    const roles = await roleService.queryRoles(req.query);
    res.status(httpStatus.OK).send(roles);
  } catch (error) {
    console.error("Error in getRoles:", error);
    next(error);
  }
});

const updateRole = catchAsync(async (req, res, next) => {
  const role = await roleService.updateRole(
    req.params.uuid,
    req.body,
    req.files
  );
  return res.status(httpStatus.OK).send(role);
});

const deleteRole = catchAsync(async (req, res, next) => {
  await roleService.deleteRole(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  roleView,
  roleCreateView,
  createRole,
  getRoles,
  deleteRole,
  editRoleView,
  updateRole,
};
