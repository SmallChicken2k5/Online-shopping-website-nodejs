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

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne(
        {
            _id: cartId
        }
    );

    let products = [];

    for (let item of cart.products){
        const objectProduct = {
            product_id: item.product_id,
            quantity: item.quantity,
            price: 0,
            discountPercentage: 0
        };
        const productInfo = await Product.findOne({
            _id: item.product_id,
            deleted: false,
            status: 'active'
        });
        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;
        products.push(objectProduct);
    }
    
    const objectOrder = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };
    
    console.log(objectOrder);
    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({
        _id: cartId
    },{
        $set: {
            products: []
        }
    });

    res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:id
module.exports.success = async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findOne({
        _id: orderId
    })
    let totalPrice = 0;
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select('title thumbnail');

        product.productInfo = productInfo;

        product.priceNew = productsHelper.discountedPriceItem(product);
        product.totalPrice = product.quantity * product.priceNew;
        totalPrice += product.totalPrice;
    }
    res.render('client/pages/checkout/success', {
        title: 'Đặt Hàng Thành Công',
        order: order,
        totalPrice: totalPrice
    });
}