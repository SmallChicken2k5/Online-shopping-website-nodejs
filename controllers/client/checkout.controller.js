const Order = require('../../models/order.model');
const Product = require("../../models/product.model");
const Cart = require('../../models/cart.model');
const productsHelper = require('../../helpers/products');
// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({_id: cartId});

    let totalPrice = 0;
    if (cart.products.length > 0) {
        for (let item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
                deleted: false,
                status: 'active'
            })
            productInfo.newPrice = productsHelper.discountedPriceItem(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = item.quantity * productInfo.newPrice;
            totalPrice += item.totalPrice;
        }
    }
    cart.totalPrice = totalPrice;
    res.render('client/pages/checkout/index', {
        title: 'Đặt Hàng',
        cartDetail: cart
    });
}