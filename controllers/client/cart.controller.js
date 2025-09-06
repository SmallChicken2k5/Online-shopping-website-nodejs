const Product = require("../../models/product.model");
const Cart = require('../../models/cart.model');
// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const product = await Product.findOne({_id: productId});
    const cart = await Cart.findOne({
        _id: cartId
    })

    const existProduct = cart.products.find(item => item.product_id.toString() === productId);

    if (!existProduct) {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
        await Cart.updateOne({
            _id: cartId
        },{
            $push: {
                products: objectCart
            }
        })

        req.flash('success', `Đã thêm ${quantity} sản phẩm ${product.title} vào giỏ hàng thành công`);
        res.redirect(req.get('Referrer') || '/')
    } else {
        const newQuantity = existProduct.quantity + quantity;
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        },{
            $set: {
                "products.$.quantity": newQuantity
            }
        })
        req.flash('success', `Đã thêm ${quantity} sản phẩm ${product.title} vào giỏ hàng thành công`);
        res.redirect(req.get('Referrer') || '/')
    }

}
