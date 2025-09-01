const systemConfig = require('../../config/system');
module.exports.loginPost = (req, res ,next) => {
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if (!req.body.password) {
        req.flash('error', 'Mật khẩu không được để trống');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    next();
}