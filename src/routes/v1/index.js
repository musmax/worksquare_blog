const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const messageTemplateRoute = require('./message_template.route');
const variableRoute = require('./variable.route');
const roleRoute = require('./role.route');
const permissionRoute = require('./permission.route');
const messageRoute = require('./message.route');
const blogRoute = require('./blog.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/variables',
    route: variableRoute,
  },
  {
    path: '/message-templates',
    route: messageTemplateRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
  {
    path: '/blogs',
    route: blogRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
