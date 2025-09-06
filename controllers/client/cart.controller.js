const Product = require("../../models/product.model");
const Cart = require('../../models/cart.model');
const productsHelper = require('../../helpers/products');
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

// [GET] /cart
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
    res.render('client/pages/cart/index',{
        title: 'Giỏ hàng',
        cartDetail: cart
    })
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    
    await Cart.updateOne({
        _id: cartId
    },{
        $pull: {
            products: {
                product_id: productId
            }
        }
    })
    req.flash('success', 'Xoá sản phẩm khỏi giỏ hàng thành công');
    res.redirect(req.get('Referrer') || '/')
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    const product = await Product.findOne(
        {
            _id: productId,
            deleted: false,
            status: 'active'
        });
    if (product.stock < quantity) {
        req.flash('error', 'Số lượng sản phẩm trong kho không đủ');
        return res.redirect(req.get('Referrer') || '/');
    }
    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
    },{
        $set: {
            "products.$.quantity": quantity
        }
    })

    req.flash('success', 'Cập nhật số lượng sản phẩm thành công');
    res.redirect(req.get('Referrer') || '/')
}