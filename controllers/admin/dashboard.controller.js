const Product = require('../../models/product.model');
const CategoryProduct = require('../../models/product-category.model');
const Account = require('../../models/account.model');
const User = require('../../models/user.model');
const statisticHelper = require('../../helpers/statistic');
// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = await statisticHelper.multi({
        productCategory: CategoryProduct,
        product: Product,
        account: Account,
        user: User
    });

    res.render('admin/pages/dashboard', {
        title: 'Dashboard',
        statistic
    });
}