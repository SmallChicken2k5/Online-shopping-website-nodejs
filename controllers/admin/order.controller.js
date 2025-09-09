const Order = require('../../models/order.model')
const User = require('../../models/user.model')
const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/products');
// [GET] /admin/orders
module.exports.index = async(req , res ) => {
    const orders = await Order.find({});
    for (let order of orders) {
        const user = await User.findOne({
            _id: order.user_id
        })
        order.userFullName = user.fullName;
        let totalPrice = 0;
        let totalQuantity = 0;
        for (let prod of order.products){
            totalPrice += prod.quantity * productsHelper.discountedPriceItem(prod);
            totalQuantity += prod.quantity;
        }
        order.totalPrice = totalPrice;
        order.totalQuantity = `Tổng cộng ${totalQuantity} sản phẩm`;
    }

    res.render('admin/pages/orders/index', {
        title: 'Quản lý đơn hàng',
        records: orders
    })
}

// [GET] /admin/orders/detail/:id
module.exports.detail = async(req, res) => {
    const id = req.params.id;
    const order = await Order.findOne({_id: id});
    if (!order) {
        return res.status(404).send('Order not found');
    }
    let totalPrice = 0;
    let totalQuantity = 0;
    for (const product of order.products){
        const prod = await Product.findOne({
            _id: product.product_id,
            deleted: false,
            status: 'active'
        })
        product.thumbnail = prod.thumbnail;
        product.title = prod.title;
        product.newPrice = productsHelper.discountedPriceItem(product);
        totalPrice += product.newPrice * product.quantity;
        totalQuantity += product.quantity;

    }
    order.totalPrice = totalPrice;
    order.totalQuantity = totalQuantity;

    const user = await User.findOne({
        _id: order.user_id
    })
    res.render('admin/pages/orders/detail', {
        title: 'Chi tiết đơn hàng',
        order: order,
        user: user
    });
}

// [PATCH] /admin/orders/approve/:id
module.exports.approval = async(req, res) => {
    const id = req.params.id;
    await Order.updateOne({
        _id: id
    },{
        $set: {status: 'approved'}
    });
    req.flash('success', 'Duyệt đơn hàng thành công!');
    res.redirect('/admin/orders');
}

// [PATCH] /admin/orders/reject/:id
module.exports.rejection = async(req, res) => {
    const id = req.params.id;
    await Order.updateOne({
        _id: id
    },{
        $set: {status: 'rejected'}
    });
    req.flash('success', 'Từ chối đơn hàng thành công!');
    res.redirect('/admin/orders');
}