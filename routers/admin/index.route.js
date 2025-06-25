// const express = require('express');
// const router = express.Router();
// const controller = require('../../controllers/admin/dashboard.controller');
const dashboardRoute = require('./dashboard.route');

module.exports = (app) => {
    const PATH_ADMIN =  app.locals.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoute);
}
