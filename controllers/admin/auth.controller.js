const Account = require('../../models/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system')
module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        const user = await Account.findOne(
            { 
                token: req.cookies.token 
            }
        );
        if (user) {
            return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
        }
    }
    res.render('admin/pages/auth/login');
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await Account.findOne({
        email: email,
        deleted : false
    })

    if (!user) {
        req.flash('error', 'Email không tồn tại');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if (user.password !== password) {
        req.flash('error', 'Mật khẩu không đúng');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if (user.status !== 'active'){
        req.flash('error', 'Tài khoản đã bị khóa hoặc chưa kích hoạt');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }

    res.cookie('token', user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

module.exports.logout = async (req,res ) => {
    res.clearCookie('token');
    req.flash('success', 'Đăng xuất thành công');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}

