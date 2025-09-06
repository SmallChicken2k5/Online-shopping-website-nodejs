const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/products');
// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let products = [];
    if (keyword) {
        const keywordRegex = new RegExp(keyword, 'i');
        products = await Product.find({
            deleted: false,
            status: 'active',
            title: keywordRegex
        })
    }
    products = productsHelper.discountedPrice(products);
    res.render('client/pages/search/index', {
        title: 'Tìm kiếm sản phẩm',
        keyword: keyword,
        products: products
    });
}