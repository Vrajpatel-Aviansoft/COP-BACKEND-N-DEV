const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService, roleService } = require("../services");

const userView = (req, res, next) => {
  return res.render("pages/user/view", {
    title: "User",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const userCreateView = async (req, res, next) => {
  const roles = await roleService.getRoles();

  return res.render("pages/user/create", {
    title: "User",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    roles,
  });
};

const editUserView = catchAsync(async (req, res, next) => {
  const roles = await roleService.getRoles();

  const user = await userService.getUserByUuid(req.params.uuid);
  return res.render("pages/user/edit", {
    title: "User",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    user: user.dataValues,
    roles,
  });
});

const createUser = async (req, res, next) => {
  const users = await userService.createUser(
    req.body
  );
  return res.status(httpStatus.CREATED).send(users);
};

const getUser = catchAsync(async (req, res, next) => {
  try {
    const users = await userService.queryUser(req.query);
    res.status(httpStatus.OK).send(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    next(error);
  }
});

// const createUser = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   res.status(httpStatus.CREATED).send(user);
// });

// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ["name", "role"]);
//   const options = pick(req.query, ["sortBy", "limit", "page"]);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   res.send(user);
// });

// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });

const updateUser = catchAsync(async (req, res, next) => {
  const users = await userService.updateUser(req.params.uuid, {role_id: req.body.role_id, 
    ...req.body,
  });
  return res.status(httpStatus.OK).send(users);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  userView,
  userCreateView,
  editUserView,
  createUser,
  // getUsers,
  getUser,
  updateUser,
  deleteUser,
};
