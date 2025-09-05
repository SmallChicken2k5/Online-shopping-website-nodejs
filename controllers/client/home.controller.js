const ProductCategory = require('../../models/product-category.model');
const createTreeHelper = require('../../helpers/createTree');
const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/products');
// [GET] /
module.exports.index = async (req,res) => {
    const productFeatured = await Product.find({
        deleted: false,
        status: 'active',
        featured: '1'
    }).limit(6);
    const discountedProductsFeatured = productsHelper.discountedPrice(productFeatured);

    const productNew = await Product.find({
        deleted: false,
        status: 'active',
    }).sort({position: 'desc'}).limit(6);
    const discountedProductsNew = productsHelper.discountedPrice(productNew);
    res.render('client/pages/home/index',{
        title : 'Trang Chủ',
        productFeatured: discountedProductsFeatured,
        productNew: discountedProductsNew
    });
}