const express = require('express');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
// app.use(helmet());

// parse json request body
app.use(express.json());
app.use(cookieParser());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// sanitize request data
app.use(xss());
// gzip compression
app.use(compression());

// enable cors
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// for time being
// app.locals.sidebarItems = sidebarItems;
// v1 api routes
app.use('/', routes);

// wildcard route redirect / route to /dashboard
app.get('*', (req, res) => {
  res.redirect('/dashboard');
});

// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
// });

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
