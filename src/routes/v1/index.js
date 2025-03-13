const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const dashboardRoute = require('./dashboard.routes');
const carListingRoute = require('./master/car-listing.routes');
const bannerCategoryRoute = require('./master/banner-category.routes');
const brandRoute = require('./brand.routes');
const carModelRoute = require('./car-model.routes');
const masterRoute = require('./master');
const specificationRoute = require('./specification.routes');
const featureRoute = require('./feature.routes');
const featureValueRoute = require('./feature-value.routes');
const variantRoute = require('./variant.routes');
const evStationRoute = require('./ev-station.routes');
const carGraphicsRoute = require('./car-graphics.routes');
const serviceStationRoute = require('./service-station.routes');
const fuelStationRoute = require('./fuel-station.routes');
const bannerRoute = require('./banner.routes');
const pageContentRoute = require('./page-content.routes');
const carListingDataRoute = require('./car-listing-data.routes');
const dealerShipRoute = require('./dealership.routes');
const warningLightRoute = require('./warning-light.routes');
const websiteCustomerRoute = require('./website-customer.routes');
const bookTestDriveRoute = require('./book-test-drive.routes');
const subscribeRoute = require('./subscribe.routes');
const wishlistRoute = require('./wishlist.routes');
const b2bInquiryRoute = require('./b2b-inquiry.routes');
const seoRoute = require('./seo/seo.routes');
const metatagsRoute = require('./seo/meta-tag.routes');
const pageRoute = require('./seo/page.routes');
const servicesLeadRoute = require('./services-lead.routes');
const roleRoute = require('./role.routes');
const priceEntryRoute = require('./price-entry.routes');
const reviewRoute = require('./review.routes');
const app = express();

const router = express.Router();

// Use express-ejs-layouts globally (for all EJS views)
// app.use(expressLayouts);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Default routes
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
    layout: expressLayouts,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
    layout: expressLayouts,
  },
  {
    path: '/car-listing',
    route: carListingRoute,
    layout: expressLayouts,
  },
  {
    path: '/banner-cat',
    route: bannerCategoryRoute,
    layout: expressLayouts,
  },
  {
    path: '/brand',
    route: brandRoute,
    layout: expressLayouts,
  },
  {
    path: '/car-model',
    route: carModelRoute,
    layout: expressLayouts,
  },
  {
    path: '/spec',
    route: specificationRoute,
    layout: expressLayouts,
  },
  {
    path: '/feature',
    route: featureRoute,
    layout: expressLayouts,
  },
  {
    path: '/feature-value',
    route: featureValueRoute,
    layout: expressLayouts,
  },
  {
    path: '/master',
    route: masterRoute,
    layout: expressLayouts,
  },
  {
    path: '/variant',
    route: variantRoute,
    layout: expressLayouts,
  },
  {
    path: '/ev-station',
    route: evStationRoute,
    layout: expressLayouts,
  },
  {
    path: '/car-graphics',
    route: carGraphicsRoute,
    layout: expressLayouts,
  },
  {
    path: '/service-station',
    route: serviceStationRoute,
    layout: expressLayouts,
  },
  {
    path: '/fuel-station',
    route: fuelStationRoute,
    layout: expressLayouts,
  },
  {
    path: '/banner',
    route: bannerRoute,
    layout: expressLayouts,
  },
  {
    path: '/page-content',
    route: pageContentRoute,
    layout: expressLayouts,
  },
  {
    path: '/car-listing-data',
    route: carListingDataRoute,
    layout: expressLayouts,
  },
  {
    path: '/dealership',
    route: dealerShipRoute,
    layout: expressLayouts,
  },
  {
    path: '/warning-light',
    route: warningLightRoute,
    layout: expressLayouts,
  },
  {
    path: '/website-customer',
    route: websiteCustomerRoute,
    layout: expressLayouts,
  },
  {
    path: '/book-test-drive',
    route: bookTestDriveRoute,
    layout: expressLayouts,
  },
  {
    path: '/subscribe',
    route: subscribeRoute,
    layout: expressLayouts,
  },
  {
    path: '/wishlist',
    route: wishlistRoute,
    layout: expressLayouts,
  },
  {
    path: '/seo',
    route: seoRoute,
    layout: expressLayouts,
  },
  {
    path: '/b2b-inquiry',
    route: b2bInquiryRoute,
    layout: expressLayouts,
  },
  {
    path: '/meta-tags',
    route: metatagsRoute,
    layout: expressLayouts,
  },
  {
    path: '/pages',
    route: pageRoute,
    layout: expressLayouts,
  },
  {
    path: '/services-lead',
    route: servicesLeadRoute,
    layout: expressLayouts,
  },
  {
    path: '/role',
    route: roleRoute,
    layout: expressLayouts,
  },
  {
    path: '/price-entry',
    route: priceEntryRoute,
    layout: expressLayouts,
  },
  {
    path: '/review',
    route: reviewRoute,
    layout: expressLayouts,
  },
];

defaultRoutes.forEach((route) => {
  if (route.layout) {
    router.use(route.path, route.layout, route.route);
  } else {
    router.use(route.path, route.route);
  }
});

module.exports = router;
