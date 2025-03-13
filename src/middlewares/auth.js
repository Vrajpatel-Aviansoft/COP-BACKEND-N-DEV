const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { permissionService } = require("../services");
const { getSidebarItems } = require("../utils/sidebar");

const verifyCallback =
  (req, resolve, reject, options) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    if (options.permission) {
      const isPermitted = await permissionService.isPermitted(
        user,
        options.permission
      );
      if (!isPermitted) {
        return reject(
          new ApiError(httpStatus.FORBIDDEN, "You are not permitted")
        );
      }
    }
    req.user = user;
    const permissions = await permissionService.getPermissions(user);
    req.sidebarItems = getSidebarItems(permissions);
    resolve();
  };

const auth = (options = {}) => {
  const { isView = true } = options;
  return async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, options)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => {
        if (isView) {
          return res.redirect("/auth/login");
        }
        next(err);
      });
  };
};

const checkAlreadyLogin = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (accessToken) {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = { auth, checkAlreadyLogin };
