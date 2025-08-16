// const express = require('express');
// const router = express.Router();
// const controller = require('../../controllers/admin/dashboard.controller');
const dashboardRoute = require('./dashboard.route');
const productRoute = require('./product.route');
const productCategoryRoute = require('./product-category.route')
const roleRoute = require('./role.route')
module.exports = (app) => {
    const PATH_ADMIN =  app.locals.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoute);
    app.use(PATH_ADMIN + '/products', productRoute);
    app.use(PATH_ADMIN + '/products-category', productCategoryRoute);
    app.use(PATH_ADMIN + '/roles', roleRoute);
}
