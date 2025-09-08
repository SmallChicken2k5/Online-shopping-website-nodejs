const productRouter = require('./product.route')
const homeRouter = require('./home.route')
const searchRouter = require('./search.route')
const cartRouter = require('./cart.route')
const checkoutRouter = require('./checkout.route')
const userRouter = require('./user.route')
const settingMiddleware = require('../../middlewares/client/setting.middleware');
const cartMiddleware = require('../../middlewares/client/cart.middleware');
const categoryMiddleware = require('../../middlewares/client/category.middleware');
const userMiddleware = require('../../middlewares/client/user.middleware');
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(settingMiddleware.general);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.inforUser);
    app.use(
        '/',
        homeRouter
    );
    app.use(
        '/products',
        productRouter
    );
    app.use(
        '/search',
        searchRouter
    );
    app.use(
        '/cart',
        cartRouter
    );
    app.use(
        '/checkout',
        checkoutRouter
    )
    app.use(
        '/user',
        userRouter
    )
}