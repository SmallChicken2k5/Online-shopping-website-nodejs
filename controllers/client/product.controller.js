const product = require('../../models/product.model');
const productsHelper = require('../../helpers/products');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await product.find({
        status: 'active',
        deleted: false
    }).sort({position: 'desc'});
    const  discountedProducts = productsHelper.discountedPrice(products);
    res.render('client/pages/products/index',{
        title: 'Danh Sách Sản Phẩm',
        products: discountedProducts,
    })
}

// GET /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            slug: req.params.slug,
            status: 'active',
            deleted: false
        }
        const productDetail = await product.findOne(find);
        res.render('client/pages/products/detail',{
            title: productDetail.title,
            product: productDetail
        })        
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại hoặc đã bị xóa');
        res.redirect('/products');
    }

}