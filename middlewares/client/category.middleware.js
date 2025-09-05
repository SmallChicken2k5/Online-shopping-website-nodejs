const ProductCategory = require('../../models/product-category.model');
const createTreeHelper = require('../../helpers/createTree');
module.exports.category = async (req, res, next) => {
    const find = {
        deleted: false,
        status: 'active'
    }
    const productCategory = await ProductCategory.find(find);
    let categoriesTree = createTreeHelper(productCategory);
    res.locals.layoutProductCategory = categoriesTree;
    next();
}