const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

// [DELETE] /admin/carts/cleanup
module.exports.cleanup = async(req, res) => {
    const carts = await Cart.find({
        user_id: null,
    })
    for (const cart of carts){
        for (const product of cart.products){
            await Product.updateOne({
                _id: product.product_id,
            }, {
                $inc: {
                    stock: product.quantity,
                }
            })
        }
    }
    await Cart.deleteMany({
        user_id: null,
    })
    req.flash('success', 'Đã xoá giỏ hàng ẩn danh thành công!')
    res.redirect(req.get('Referrer') || '/')
}