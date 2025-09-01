// const express = require('express');
// const router = express.Router();
// const controller = require('../../controllers/admin/dashboard.controller');
const dashboardRoute = require('./dashboard.route');
const productRoute = require('./product.route');
const productCategoryRoute = require('./product-category.route')
const roleRoute = require('./role.route')
const accountRoute = require('./account.route')
const authRoute = require('./auth.route')
const authMiddleware = require('../../middlewares/admin/auth.middleware')
module.exports = (app) => {
    const PATH_ADMIN = app.locals.prefixAdmin;
    app.use(
        PATH_ADMIN + '/dashboard',
        authMiddleware.requireAuth,
        dashboardRoute
    );
    app.use(
        PATH_ADMIN + '/products',
        authMiddleware.requireAuth,
        productRoute
    );
    app.use(
        PATH_ADMIN + '/products-category',
        authMiddleware.requireAuth,
        productCategoryRoute
    );
    app.use(
        PATH_ADMIN + '/roles',
        authMiddleware.requireAuth,
        roleRoute
    );
    app.use(
        PATH_ADMIN + '/accounts',
        authMiddleware.requireAuth,
        accountRoute
    );
    app.use(PATH_ADMIN + '/auth', authRoute);
}
