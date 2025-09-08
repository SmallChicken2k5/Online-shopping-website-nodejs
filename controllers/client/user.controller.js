const User = require('../../models/user.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const generate = require('../../helpers/generate');
const ForgotPassword = require('../../models/forgot-password.model');
const md5 = require('md5');
const Cart = require('../../models/cart.model');
const sendMailHelper = require('../../helpers/sendMail');
const productsHelper = require('../../helpers/products');
// [GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/user/register', {
        title: 'Đăng ký tài khoản'
    });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if (existEmail) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect(req.get('Referrer') || '/');
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/');
}

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render('client/pages/user/login', {
        title: 'Đăng nhập tài khoản'
    });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash('error', 'Email không tồn tại');
        res.redirect(req.get('Referrer') || '/');
        return;
    }
    if (user.password !== password) {
        req.flash('error', 'Mật khẩu không đúng');
        res.redirect(req.get('Referrer') || '/');
        return;
    }
    if (user.status !== 'active') {
        req.flash('error', 'Tài khoản không hoạt động');
        res.redirect(req.get('Referrer') || '/');
        return;
    }
    res.cookie('tokenUser', user.tokenUser);

    // Tìm cart đã có user_id
    const cartCurrent = await Cart.findOne({ _id: req.cookies.cartId });
    const cartOfUser = await Cart.findOne({ user_id: user.id, _id: { $ne: cartCurrent?._id } });

    if (cartOfUser) {
        res.cookie('cartId', cartOfUser.id);
        await Cart.deleteOne({ _id: cartCurrent._id });
    } else {
        await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
    }

    res.redirect('/');
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('tokenUser');
    res.redirect(req.get('Referrer') || '/');
}

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render('client/pages/user/forgot-password', {
        title: 'Quên mật khẩu'
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash('error', 'Email không tồn tại');
        res.redirect(req.get('Referrer') || '/');
        return;
    }

    const existdForgotPassword = await ForgotPassword.findOne({
        email: email
    })
    if (existdForgotPassword) {
        await ForgotPassword.deleteOne({
            email: email
        })
    }
    const otp = generate.generaterandomNumber(6);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Send Mail
    const subject = 'Yêu cầu đặt lại mật khẩu';
    const html = `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 40px;">
            <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 32px;">
                <h2 style="color: #2d7ff9; text-align: center; margin-bottom: 24px;">Xác nhận OTP</h2>
                <p style="font-size: 16px; color: #333; text-align: center;">Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP bên dưới để xác nhận:</p>
                <div style="margin: 32px 0; text-align: center;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d7ff9; background: #f0f4ff; padding: 16px 32px; border-radius: 8px; border: 1px dashed #2d7ff9;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 15px; color: #666; text-align: center;">Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>.<br>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 13px; color: #aaa; text-align: center;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
            </div>
        </div>
    `;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otp = (req, res) => {
    res.render('client/pages/user/otp-password', {
        title: 'Xác nhận OTP',
        email: req.query.email
    })
}

// [POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!result) {
        req.flash('error', 'OTP không đúng hoặc đã hết hạn');
        return res.redirect(req.get('Referrer') || '/');
    }
    const user = await User.findOne({
        email: email
    })
    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/user/password/reset');
}

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render('client/pages/user/reset-password', {
        title: 'Đặt lại mật khẩu'
    });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const newPassword = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(newPassword)
    })
    req.flash('success', 'Đặt lại mật khẩu thành công');
    res.redirect('/');
}

// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render('client/pages/user/info', {
        title: 'Thông tin tài khoản'
    });
}

// [GET] /user/edit
module.exports.edit = async (req, res) => {
    res.render('client/pages/user/edit', {
        title: 'Chỉnh sửa thông tin tài khoản',
    });
}

// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    }, req.body);
    req.flash('success', 'Cập nhật thông tin tài khoản thành công');
    res.redirect('/user/info');
}

// [GET] /user/orders
module.exports.orders = async (req, res) => {
    const token = req.cookies.tokenUser;
    const user = await User.findOne({
        tokenUser: token,
        deleted: false
    });
    console.log(user.id)
    const orderList = await Order.find({
        user_id: user.id
    });
    for (const order of orderList){
        let totalPrice = 0;
        let totalQuantity = 0;
        for (const product of order.products) {
            totalPrice += productsHelper.discountedPriceItem(product) * product.quantity;
            totalQuantity += product.quantity;
        }
        const firstProduct = await Product.findOne({
            _id: order.products[0].product_id,
            deleted: false,
            status: 'active'
        })
        order.totalPrice = totalPrice;
        order.totalQuantity = totalQuantity;
        order.firstProduct = firstProduct.thumbnail;
    }
    console.log(orderList);
    res.render('client/pages/user/orders', {
        title: 'Thông tin đơn hàng',
        orders: orderList
    });
}