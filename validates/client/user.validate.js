const systemConfig = require('../../config/system')
module.exports.registerPost = (req ,res , next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Họ và tên không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.password) {
        req.flash('error', 'Mật khẩu không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}

module.exports.loginPost = (req ,res , next) => {
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.password) {
        req.flash('error', 'Mật khẩu không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}

module.exports.forgotPasswordPost = (req ,res , next) => {
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}

module.exports.otpPost = (req ,res , next) => {
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.otp) {
        req.flash('error', 'OTP không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}

module.exports.resetPasswordPost = (req ,res , next) => {
    if (!req.body.password) {
        req.flash('error', 'Mật khẩu không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không được để trống');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('error', 'Mật khẩu và xác nhận mật khẩu không khớp');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}