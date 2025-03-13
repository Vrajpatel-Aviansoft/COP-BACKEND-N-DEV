const { Strategy: JwtStrategy } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const { User } = require("../db/models");
const cookie = require("cookie");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie);
      token = cookies["accessToken"];
    }
    return token;
  },
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user.dataValues);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
