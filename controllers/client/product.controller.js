const product = require('../../models/product.model');

module.exports.index = async (req, res) => {
    const products = await product.find({
        status: 'active',
        deleted: false
    });
    const  discountedProducts = products.map((item) => {
        item.discountedPrice = item.price - (item.price * item.discountPercentage / 100);
        item.discountedPrice = item.discountedPrice.toFixed(2);
        return item;
    });
    res.render('client/pages/products/index',{
        title: 'Danh Sách Sản Phẩm',
        products: discountedProducts,
    })
}